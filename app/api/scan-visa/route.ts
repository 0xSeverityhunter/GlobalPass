import { NextRequest, NextResponse } from "next/server";
import { parseVisaDocument } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10MB." },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");

        // Parse the visa document
        const visaData = await parseVisaDocument(base64, file.type);

        return NextResponse.json({ success: true, data: visaData });
    } catch (error) {
        console.error("Visa scan error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to scan visa" },
            { status: 500 }
        );
    }
}
