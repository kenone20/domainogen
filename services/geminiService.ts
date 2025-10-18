import { GoogleGenAI, Type } from "@google/genai";
import type { DomainSuggestion, DomainAnalysis } from '../types';
import { getDomainAge } from './domainApiService';

// --- API Key Configuration ---
// IMPORTANT: In a real application, use environment variables and a backend proxy.
// Never expose API keys on the client-side.
//
// Required for AI features:
// const GEMINI_API_KEY = process.env.API_KEY;
//
// For real domain availability checks (replace mock service):
// const DOMAINR_API_KEY = '...';
// const WHOISXML_API_KEY = '...';
//
// For affiliate links:
// const NAMECHEAP_API_USER = '...';
// const NAMECHEAP_API_KEY = '...';
// const AFFILIATE_ID_GOODADDY = '...';
// ---

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
    };
};

const generateImageMock = async (prompt: string): Promise<string> => {
    console.log("Using mock image generation service for prompt:", prompt);
    // Fetch a placeholder image, convert to blob, then to base64 to mimic the API response type
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
            model: "gemini-2.5-flash",
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
        
        // Extract, clean, and deduplicate domains
        let domains = jsonResponse
            .map((d: { domain: string }) => d.domain)
            .filter((domain: string) => domain && !/\d/.test(domain)); // Filter out null/undefined and domains with numbers

        domains = [...new Set(domains)]; // Remove duplicates

        return domains.map((name: string) => ({ name, isFavorited: false, status: 'pending' as const }));
    } catch (error) {
        console.error("Error generating domains with Gemini:", error);
        return generateDomainsMock(keywords, tlds); // Fallback to mock on error
    }
};

export const analyzeDomain = async (domain: string): Promise<DomainAnalysis> => {
    if (!ai) return analyzeDomainMock(domain);

    // Fetch domain age first to include it in the analysis prompt
    const age = await getDomainAge(domain);

    const prompt = `Act as a seasoned domain name appraiser and digital asset strategist. Your task is to conduct a rigorous, professional analysis of the domain "${domain}", treating it as a significant business investment. The domain's registration age is "${age}".

    Your analysis must be data-driven and impartial. Critically evaluate the domain based on the following core pillars:
    1.  **Commercial Potential & Keyword Strength:** How valuable are the keywords? Do they target a high-value niche?
    2.  **TLD Authority:** How does the TLD (.com, .io, .ai, etc.) impact trust, value, and target audience perception?
    3.  **Brandability:** Is it memorable, pronounceable, and unique?
    4.  **Domain Age:** The provided age is a critical factor for SEO trust and valuation.

    Your response MUST be a valid JSON object with the following strict structure:

    - "brandability": A score from 1-10.
    - "brandabilityJustification": A detailed justification for the brandability score. Directly reference its memorability, length, and potential for brand recognition.
    - "seoStrength": A score from 1-10.
    - "seoStrengthJustification": A detailed justification for the SEO score. Your reasoning must explicitly incorporate the domain's age, keyword relevance, and the TLD's authority in search engine rankings.
    - "estimatedValue": An estimated monetary value in USD (integer). This valuation must be primarily driven by the domain's age and TLD, followed by its commercial keyword potential. An older domain with strong keywords is exponentially more valuable.
    - "summary": A professional summary evaluating the domain as a digital asset, balancing its strengths against its weaknesses.
    - "tagline": A creative, brand-appropriate tagline.
    - "logoPrompt": A highly descriptive prompt for an AI image generator to create a modern, minimalist, vector-style logo suitable for a favicon. Describe a simple graphic element and incorporate the generated color palette. Example: 'a clean, modern vector logo of an abstract geometric bird in flight, using shades of indigo and cyan, minimalist design, sharp lines, on a pure white background'.
    - "colorPalette": An array of exactly 4 complementary hex color codes.
    - "risks": A mandatory sentence identifying at least one potential risk (e.g., 'The .co TLD can be mistaken for .com by users,' 'The name is difficult to spell,' 'Potential trademark conflicts with existing brands'). This field cannot be empty.
    - "alternativeSuggestions": An array of 3-5 similar, high-quality domain names.`;

    try {
        const analysisResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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
            domainAge: age, // Use the age we fetched
            risks: jsonResponse.risks,
            alternativeSuggestions: jsonResponse.alternativeSuggestions,
        };
    } catch (error) {
        console.error("Error analyzing domain with Gemini:", error);
        return analyzeDomainMock(domain); // Fallback to mock on error
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    if (!ai) return generateImageMock(prompt);

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No image was generated by the API.");
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        return generateImageMock(prompt); // Fallback to mock on error
    }
};