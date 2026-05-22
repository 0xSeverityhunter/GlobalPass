import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ParsedVisaData {
    visaType: string;
    holderNationality: string;
    issuingCountry: string;
    issueDate: string;
    expiryDate: string;
    entryType: "single" | "multiple" | "unknown";
    maxStay: string;
    restrictions: string[];
    visaNumber: string;
    isValid: boolean;
    daysRemaining: number | null;
    rawNotes: string;
}

const VISA_PARSING_PROMPT = `You are a visa document parser. Analyze this visa image and extract the following information in JSON format:

{
  "visaType": "Tourist Visa / Work Visa / Student Visa / etc.",
  "holderNationality": "Country name",
  "issuingCountry": "Country that issued the visa",
  "issueDate": "YYYY-MM-DD format",
  "expiryDate": "YYYY-MM-DD format",
  "entryType": "single" | "multiple" | "unknown",
  "maxStay": "e.g. 90 days, 6 months",
  "restrictions": ["array of any restrictions or conditions noted"],
  "visaNumber": "The visa number if visible",
  "rawNotes": "Any other important information visible on the visa"
}

If any field cannot be determined, use "unknown" or empty array for restrictions.
Return ONLY valid JSON, no markdown or explanation.`;

export async function parseVisaDocument(imageBase64: string, mimeType: string): Promise<ParsedVisaData> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };

    const result = await model.generateContent([VISA_PARSING_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
        // Clean up potential markdown formatting
        const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanedText);

        // Calculate validity
        let isValid = false;
        let daysRemaining: number | null = null;

        if (parsed.expiryDate && parsed.expiryDate !== "unknown") {
            const expiry = new Date(parsed.expiryDate);
            const today = new Date();
            daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            isValid = daysRemaining > 0;
        }

        return {
            visaType: parsed.visaType || "Unknown",
            holderNationality: parsed.holderNationality || "Unknown",
            issuingCountry: parsed.issuingCountry || "Unknown",
            issueDate: parsed.issueDate || "Unknown",
            expiryDate: parsed.expiryDate || "Unknown",
            entryType: parsed.entryType || "unknown",
            maxStay: parsed.maxStay || "Unknown",
            restrictions: parsed.restrictions || [],
            visaNumber: parsed.visaNumber || "Unknown",
            isValid,
            daysRemaining,
            rawNotes: parsed.rawNotes || "",
        };
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Failed to parse visa document. Please try with a clearer image.");
    }
}
