import { NextRequest, NextResponse } from "next/server";
import { ParsedVisaData, AIProvider } from "@/lib/ai-types";
import { parseVisaDocument as parseWithGemini } from "@/lib/gemini";
import { parseVisaWithOpenAI } from "@/lib/openai";
import { parseVisaWithClaude } from "@/lib/claude";

// Priority order for automatic failover
const PROVIDER_PRIORITY: AIProvider[] = ["gemini", "openai", "claude"];

async function tryProvider(
    provider: AIProvider,
    base64: string,
    mimeType: string
): Promise<{ success: true; data: ParsedVisaData; provider: AIProvider } | { success: false; error: string }> {
    try {
        let result: ParsedVisaData;

        switch (provider) {
            case "openai":
                if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("your_")) {
                    return { success: false, error: "OpenAI not configured" };
                }
                result = await parseVisaWithOpenAI(base64, mimeType);
                break;

            case "claude":
                if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("your_")) {
                    return { success: false, error: "Anthropic not configured" };
                }
                result = await parseVisaWithClaude(base64, mimeType);
                break;

            case "gemini":
            default:
                if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your_")) {
                    return { success: false, error: "Gemini not configured" };
                }
                result = await parseWithGemini(base64, mimeType);
                break;
        }

        return { success: true, data: result, provider };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(`[${provider}] Failed:`, message);
        return { success: false, error: message };
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const preferredProvider = formData.get("provider") as AIProvider | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");

        // Build provider order: preferred first (if specified), then standard priority
        let providerOrder = [...PROVIDER_PRIORITY];
        if (preferredProvider && PROVIDER_PRIORITY.includes(preferredProvider)) {
            providerOrder = [preferredProvider, ...PROVIDER_PRIORITY.filter(p => p !== preferredProvider)];
        }

        // Try each provider in order until one succeeds
        const errors: string[] = [];
        for (const provider of providerOrder) {
            console.log(`[Visa Scan] Trying provider: ${provider}`);
            const result = await tryProvider(provider, base64, file.type);

            if (result.success) {
                console.log(`[Visa Scan] Success with: ${provider}`);
                return NextResponse.json({ data: result.data, provider: result.provider });
            }

            errors.push(`${provider}: ${result.error}`);
        }

        // All providers failed
        return NextResponse.json(
            { error: "All AI providers are currently unavailable. Please try again later." },
            { status: 503 }
        );

    } catch (error) {
        console.error("Visa scan error:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
