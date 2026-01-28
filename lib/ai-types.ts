// Shared types for all AI providers
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

export type AIProvider = "gemini" | "openai" | "claude";

export const VISA_PARSING_PROMPT = `You are a visa document parser. Analyze this visa image and extract the following information in JSON format:

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

export function processVisaResponse(parsed: Record<string, unknown>): ParsedVisaData {
    // Calculate validity
    let isValid = false;
    let daysRemaining: number | null = null;

    const expiryDate = parsed.expiryDate as string;
    if (expiryDate && expiryDate !== "unknown") {
        const expiry = new Date(expiryDate);
        const today = new Date();
        daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        isValid = daysRemaining > 0;
    }

    return {
        visaType: (parsed.visaType as string) || "Unknown",
        holderNationality: (parsed.holderNationality as string) || "Unknown",
        issuingCountry: (parsed.issuingCountry as string) || "Unknown",
        issueDate: (parsed.issueDate as string) || "Unknown",
        expiryDate: expiryDate || "Unknown",
        entryType: (parsed.entryType as "single" | "multiple" | "unknown") || "unknown",
        maxStay: (parsed.maxStay as string) || "Unknown",
        restrictions: (parsed.restrictions as string[]) || [],
        visaNumber: (parsed.visaNumber as string) || "Unknown",
        isValid,
        daysRemaining,
        rawNotes: (parsed.rawNotes as string) || "",
    };
}

export function cleanJsonResponse(text: string): Record<string, unknown> {
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleanedText);
}
