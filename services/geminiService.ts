import { GoogleGenAI, Type } from "@google/genai";
import type { DomainSuggestion, DomainAnalysis } from '../types';
import { getDomainAge } from './domainApiService';

// --- API Key Configuration ---
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const generateDomainsMock = async (keywords: string, tlds: string[]): Promise<DomainSuggestion[]> => {
    console.log("Using mock domain generation service.");
    await new Promise(res => setTimeout(res, 1000));
    const randomWords = ['ify', 'labs', 'flow', 'zen', 'next', 'co', 'base', 'hub'];
    const domains = Array.from({length: 20}, (_, i) => {
        const keyword = keywords.split(' ')[0] || `word${i}`;
        const tld = tlds[i % tlds.length] || '.com';
        const prefix = randomWords[i % randomWords.length];
        return { name: `${keyword}${prefix}${i % 5}.`+ tld.replace('.',''), isFavorited: false, status: 'pending' as const };
    });
    return domains;
};

const analyzeDomainMock = async (domain: string): Promise<DomainAnalysis> => {
    console.log("Using mock domain analysis service.");
    const age = await getDomainAge(domain);
    await new Promise(res => setTimeout(res, 1500));
    return {
        domain,
        brandability: 8,
        brandabilityJustification: "The name is short, catchy, and easy to spell.",
        seoStrength: 7,
        seoStrengthJustification: "Contains a relevant keyword that aligns with search intent.",
        estimatedValue: Math.floor(Math.random() * 5000) + 500,
        summary: `The domain '${domain}' is highly brandable and memorable. Its inclusion of a strong keyword boosts its SEO potential, making it a valuable asset for a modern tech company.`,
        logoSuggestion: {
            prompt: `A minimalist logo for a company called '${domain.split('.')[0]}', clean, modern, abstract vector, professional.`,
        },
        colorPalette: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
        tagline: `Unlocking the Future with ${domain.split('.')[0]}.`,
        domainAge: age,
        alternativeSuggestions: [`${domain.split('.')[0]}ly.co`, `get${domain.split('.')[0]}.app`, `${domain.split('.')[0]}hq.io`],
        risks: "The name might be too generic in a crowded market, requiring significant branding effort to stand out.",
        metaDescription: `Discover the future of innovation with ${domain}. Leading the way in modern solutions and digital excellence.`,
        metaKeywords: `${domain.split('.')[0]}, tech startup, digital brand, brandable domain`,
    };
};

const generateImageMock = async (prompt: string): Promise<string> => {
    console.log("Using mock image generation service for prompt:", prompt);
    const response = await fetch(`https://picsum.photos/seed/${prompt.slice(0, 15)}/400`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const generateDomains = async (keywords: string, style: string, tlds: string[]): Promise<DomainSuggestion[]> => {
    if (!ai) return generateDomainsMock(keywords, tlds);

    const prompt = `You are a professional brand naming assistant. Generate 20 unique, short, and catchy domain name ideas based on this concept: "${keywords}". The desired branding style is "${style}".

Strict Rules:
1. Each name must be 5-12 letters long (excluding the TLD).
2. Absolutely no numbers or hyphens.
3. Use only the following TLDs: ${tlds.join(', ')}.
4. Ensure the names sound professional, are brandable, and are suitable for startups. Avoid weird combinations.
5. Do not return duplicate domain names.

Return the result as a valid JSON array of objects. Do not wrap it in a parent object or include any other text or markdown.

Example format:
[
  { "domain": "innovate.io" },
  { "domain": "fluxify.ai" }
]
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            domain: { type: Type.STRING },
                        },
                        required: ['domain'],
                    },
                },
            },
        });
        
        const jsonResponse = JSON.parse(response.text);

        if (!Array.isArray(jsonResponse)) {
          console.error("AI response is not a JSON array:", jsonResponse);
          return generateDomainsMock(keywords, tlds);
        }
        
        let domains = jsonResponse
            .map((d: { domain: string }) => d.domain)
            .filter((domain: string) => domain && !/\d/.test(domain));

        domains = [...new Set(domains)];

        return domains.map((name: string) => ({ name, isFavorited: false, status: 'pending' as const }));
    } catch (error) {
        console.error("Error generating domains with Gemini:", error);
        return generateDomainsMock(keywords, tlds);
    }
};

export const analyzeDomain = async (domain: string): Promise<DomainAnalysis> => {
    if (!ai) return analyzeDomainMock(domain);

    const age = await getDomainAge(domain);

    const prompt = `Act as a seasoned domain name appraiser and digital asset strategist. Your task is to conduct a rigorous, professional analysis of the domain "${domain}", treating it as a significant business investment. The domain's registration age is "${age}".

    Your analysis must be data-driven and impartial. Critically evaluate the domain based on the following core pillars:
    1.  **Commercial Potential & Keyword Strength:** How valuable are the keywords? Do they target a high-value niche?
    2.  **TLD Authority:** How does the TLD (.com, .io, .ai, etc.) impact trust, value, and target audience perception?
    3.  **Brandability:** Is it memorable, pronounceable, and unique?
    4.  **Domain Age:** The provided age is a critical factor for SEO trust and valuation.

    Your response MUST be a valid JSON object with the following strict structure:

    - "brandability": A score from 1-10.
    - "brandabilityJustification": A detailed justification for the brandability score.
    - "seoStrength": A score from 1-10.
    - "seoStrengthJustification": A detailed justification for the SEO score.
    - "estimatedValue": An estimated monetary value in USD (integer).
    - "summary": A professional summary.
    - "tagline": A creative tagline.
    - "logoPrompt": A highly descriptive prompt for an AI image generator.
    - "colorPalette": An array of exactly 4 complementary hex color codes.
    - "risks": A mandatory risk assessment sentence.
    - "alternativeSuggestions": An array of 3-5 similar domain names.
    - "metaDescription": A compelling SEO meta description (150-160 characters) for a website launched on this domain.
    - "metaKeywords": A comma-separated list of 5-8 relevant SEO keywords for this domain.`;

    try {
        const analysisResponse = await ai.models.generateContent({
            // Fix: Use gemini-3-pro-preview for complex appraisal tasks as per guidelines.
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        brandability: { type: Type.INTEGER },
                        brandabilityJustification: { type: Type.STRING },
                        seoStrength: { type: Type.INTEGER },
                        seoStrengthJustification: { type: Type.STRING },
                        estimatedValue: { type: Type.INTEGER },
                        summary: { type: Type.STRING },
                        tagline: { type: Type.STRING },
                        logoPrompt: { type: Type.STRING },
                        colorPalette: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        risks: { type: Type.STRING },
                        alternativeSuggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        metaDescription: { type: Type.STRING },
                        metaKeywords: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonResponse = JSON.parse(analysisResponse.text);
        return {
            domain,
            brandability: jsonResponse.brandability,
            brandabilityJustification: jsonResponse.brandabilityJustification,
            seoStrength: jsonResponse.seoStrength,
            seoStrengthJustification: jsonResponse.seoStrengthJustification,
            estimatedValue: jsonResponse.estimatedValue,
            summary: jsonResponse.summary,
            tagline: jsonResponse.tagline,
            logoSuggestion: {
                prompt: jsonResponse.logoPrompt,
            },
            colorPalette: jsonResponse.colorPalette,
            domainAge: age,
            risks: jsonResponse.risks,
            alternativeSuggestions: jsonResponse.alternativeSuggestions,
            metaDescription: jsonResponse.metaDescription,
            metaKeywords: jsonResponse.metaKeywords,
        };
    } catch (error) {
        console.error("Error analyzing domain with Gemini:", error);
        return analyzeDomainMock(domain);
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    if (!ai) return generateImageMock(prompt);

    try {
        // Fix: Use gemini-2.5-flash-image with generateContent for default image generation as per guidelines.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                },
            },
        });

        // Fix: Iterate through all parts to find the image part, do not assume it is the first part.
        for (const candidate of response.candidates || []) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        throw new Error("No image was generated by the API.");
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        return generateImageMock(prompt);
    }
};