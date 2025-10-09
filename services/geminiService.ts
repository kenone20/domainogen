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
        seoStrength: 7,
        estimatedValue: Math.floor(Math.random() * 5000) + 500,
        summary: `The domain '${domain}' is highly brandable and memorable. Its inclusion of a strong keyword boosts its SEO potential, making it a valuable asset for a modern tech company.`,
        logoSuggestion: {
            prompt: `A minimalist logo for a company called '${domain.split('.')[0]}', clean, modern, abstract.`,
        },
        colorPalette: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
        tagline: `Unlocking the Future with ${domain.split('.')[0]}.`,
        domainAge: age,
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

    const prompt = `Generate 20 short, brandable domain names for a SaaS product about "${keywords}". The style should be "${style}". Include only domains with the following TLDs: ${tlds.join(', ')}. Return only the domain names.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        domains: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                },
                            },
                        },
                    },
                },
            },
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.domains.map((d: { name: string }) => ({ name: d.name, isFavorited: false, status: 'pending' as const }));
    } catch (error) {
        console.error("Error generating domains with Gemini:", error);
        return generateDomainsMock(keywords, tlds); // Fallback to mock on error
    }
};

export const analyzeDomain = async (domain: string): Promise<DomainAnalysis> => {
    if (!ai) return analyzeDomainMock(domain);

    const prompt = `Provide a detailed analysis for the domain name "${domain}". Include a brandability score (1-10), SEO strength score (1-10), an estimated monetary value, a brief summary, a creative tagline, a DALL-E prompt for a logo, and an array of 4 hex color codes for a brand palette.`;

    try {
        // Fetch AI analysis and domain age concurrently
        const [analysisResponse, age] = await Promise.all([
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            brandability: { type: Type.INTEGER },
                            seoStrength: { type: Type.INTEGER },
                            estimatedValue: { type: Type.INTEGER },
                            summary: { type: Type.STRING },
                            tagline: { type: Type.STRING },
                            logoPrompt: { type: Type.STRING },
                            colorPalette: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                        },
                    },
                },
            }),
            getDomainAge(domain)
        ]);

        const jsonResponse = JSON.parse(analysisResponse.text);
        return {
            domain,
            brandability: jsonResponse.brandability,
            seoStrength: jsonResponse.seoStrength,
            estimatedValue: jsonResponse.estimatedValue,
            summary: jsonResponse.summary,
            tagline: jsonResponse.tagline,
            logoSuggestion: {
                prompt: jsonResponse.logoPrompt,
            },

            colorPalette: jsonResponse.colorPalette,
            domainAge: age,
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