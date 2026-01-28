import Anthropic from "@anthropic-ai/sdk";
import { ParsedVisaData, VISA_PARSING_PROMPT, processVisaResponse, cleanJsonResponse } from "./ai-types";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function parseVisaWithClaude(imageBase64: string, mimeType: string): Promise<ParsedVisaData> {
    // Claude expects specific media types
    const mediaType = mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: mediaType,
                            data: imageBase64,
                        },
                    },
                    {
                        type: "text",
                        text: VISA_PARSING_PROMPT,
                    },
                ],
            },
        ],
    });

    // Extract text from response
    const textBlock = response.content.find((block) => block.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

    try {
        const parsed = cleanJsonResponse(text);
        return processVisaResponse(parsed);
    } catch (e) {
        console.error("Failed to parse Claude response:", text);
        throw new Error("Failed to parse visa document. Please try with a clearer image.");
    }
}
