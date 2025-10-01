
import { GoogleGenAI, Type } from "@google/genai";
import type { SeedKeyword, KeywordExpansionData, BlogCreationDetails } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

// --- Stage 1: Main Keywords Research ---
export const getMainKeywords = async (niche: string): Promise<string[]> => {
    const prompt1 = `Provide a comprehensive list of the top main keywords related to "${niche}". Include terms that are highly relevant and frequently searched by users interested in this topic.`;

    const response = await ai.models.generateContent({
        model,
        contents: `Based on the following request, provide the output as a clean JSON array of strings, with each string being a keyword. Request: "${prompt1}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    try {
        const result = JSON.parse(response.text);
        if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
            return result;
        }
        throw new Error("Invalid format for main keywords.");
    } catch (e) {
        console.error("Failed to parse main keywords:", response.text);
        throw new Error("Could not retrieve main keywords. The model returned an unexpected format.");
    }
};

// --- Stage 2: Seed Keywords Table ---
export const getSeedKeywords = async (mainKeyword: string): Promise<SeedKeyword[]> => {
    const prompt2 = `Create a detailed table for the seed keyword and its related keywords. For the keyword "${mainKeyword}", provide 50 entries with columns for estimated search volume, ranking difficulty, CPC (Cost Per Click), and possible blog post topics. Ensure all related keywords are highly relevant and frequently searched by users interested in this topic, and make the table clear and accurate.`;

    const response = await ai.models.generateContent({
        model,
        contents: `Based on the following request, provide the output in a JSON format matching the provided schema. Request: "${prompt2}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        keyword: { type: Type.STRING },
                        searchVolume: { type: Type.STRING },
                        rankingDifficulty: { type: Type.STRING },
                        cpc: { type: Type.STRING },
                        blogPostTopic: { type: Type.STRING },
                    },
                    required: ["keyword", "searchVolume", "rankingDifficulty", "cpc", "blogPostTopic"]
                }
            }
        }
    });
    
    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse seed keywords:", response.text);
        throw new Error("Could not retrieve seed keywords. The model returned an unexpected format.");
    }
};

// --- Stage 3: Target Keyword Expansion ---
export const getKeywordExpansion = async (seedKeyword: string): Promise<KeywordExpansionData> => {
    const prompt3 = `For the keyword "${seedKeyword}", please provide the following:
• Frequently Asked Questions (FAQs): List at least 10 common questions that users typically ask about this topic.
• Core Keywords: Identify the 5-10 most relevant primary keywords associated with the main keyword.
• Secondary Keywords: List 10-15 secondary keywords or long-tail keywords that can be used to optimize content.
• Top Product Recommendations: Provide a detailed list of the top 20 products that are highly relevant to the keyword. This should include product names, links, and brief descriptions.
Please ensure that your response is comprehensive, accurate, and up-to-date.`;

    const response = await ai.models.generateContent({
        model,
        contents: `Based on the following request, provide the output in a JSON format matching the provided schema. Request: "${prompt3}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    faqs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    secondaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    productRecommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                link: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                             required: ["name", "link", "description"]
                        }
                    }
                },
                 required: ["faqs", "coreKeywords", "secondaryKeywords", "productRecommendations"]
            }
        }
    });

    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse keyword expansion:", response.text);
        throw new Error("Could not retrieve keyword expansion data. The model returned an unexpected format.");
    }
};

// --- Stage 4: Blog Content Creator ---
export const createBlogPost = async (details: BlogCreationDetails): Promise<string> => {
    const { mainKeyword, country, expansionData, selection } = details;

    let infoProvided = `• Main Keyword/Title: ${mainKeyword}\n`;
    if (selection.faqs) {
        infoProvided += `• Frequently Asked Questions (FAQs): ${expansionData.faqs.join(', ')}\n`;
    }
    if (selection.secondaryKeywords) {
        infoProvided += `• Secondary Keywords/Questions: ${expansionData.secondaryKeywords.join(', ')}\n`;
    }
    if (selection.coreKeywords) {
        infoProvided += `• Core Keywords to include: ${expansionData.coreKeywords.join(', ')}\n`;
    }
    if (selection.productRecommendations) {
        infoProvided += `• Top Product Recommendations:\n${expansionData.productRecommendations.map(p => `- ${p.name}: ${p.description} (${p.link})`).join('\n')}\n`;
    }

    const prompt4 = `Act like an expert content writer assigned to create a high-quality, SEO-optimized blog post about "${mainKeyword}" for an audience in "${country}".
An outline is provided below.

Instructions:
1. Content Structure:
   - Introduction: Start with an engaging hook that captures the essence of the topic.
   - Body: Incorporate the provided Frequently Asked Questions (FAQs) and secondary keywords/questions seamlessly into the content. Develop each section thoroughly, ensuring it adds value and depth to the reader’s understanding. Where appropriate, include tables to present data or comparisons clearly.
   - Conclusion: Summarize key insights and encourage reader engagement with a compelling call-to-action.
2. Writing Style:
   - Adopt a natural, organic and casual tone.
   - Use simple, everyday language, avoiding jargon. Write with a unique, personal, and engaging voice.
   - Use formatting like bolding, italics, bullet points, and short paragraphs for readability.
   - Write conversationally using "you" and "I".
   - Be witty and clever, including subtle humor or analogies.
   - Include relevant anecdotes or personal insights.
   - Be authoritative yet approachable.
   - Use a mix of simple, compound, and complex sentences.
   - Vary sentence lengths for a human-like rhythm.
   - Ensure a logical flow with smooth transitions.
3. SEO Optimization:
   - Integrate the main keyword and secondary keywords naturally.
   - Use headings and subheadings with keywords where appropriate.
   - Craft a compelling meta description (~155 characters) that includes the main keyword. Start the entire response with "META DESCRIPTION:" followed by the description, then a newline, and then the full article.
4. EEAT Compliance (Experience, Expertise, Authoritativeness, Trustworthiness):
   - Provide accurate, detailed information.
   - Build trustworthiness through honest, transparent content.
5. Content Variety:
   - Suggest where to insert relevant images (e.g., "[Insert image of description here]").
   - Include tables to organize complex information if it makes sense.
6. Additional Guidelines:
   - Length: Aim for around 1,500 words.
   - Originality: Ensure the content is original and not AI-detectable.

Information Provided:
${infoProvided}

Objective: Create a blog post that informs, engages, and resonates with the reader, positioning it as a valuable resource that stands out in search engine results. Deliver the article ready-to-publish.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt4,
    });
    
    return response.text;
};
