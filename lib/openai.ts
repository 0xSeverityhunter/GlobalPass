import OpenAI from "openai";
import { ParsedVisaData, VISA_PARSING_PROMPT, processVisaResponse, cleanJsonResponse } from "./ai-types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function parseVisaWithOpenAI(imageBase64: string, mimeType: string): Promise<ParsedVisaData> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: VISA_PARSING_PROMPT },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${mimeType};base64,${imageBase64}`,
                        },
                    },
                ],
            },
        ],
        max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || "";

    try {
        const parsed = cleanJsonResponse(text);
        return processVisaResponse(parsed);
    } catch (e) {
        console.error("Failed to parse OpenAI response:", text);
        throw new Error("Failed to parse visa document. Please try with a clearer image.");
    }
}
