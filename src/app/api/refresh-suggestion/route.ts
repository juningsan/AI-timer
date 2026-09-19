import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// const interaction = await ai.interactions.create({
//   model: "gemini-3.7-flash",
//   input: "Explain how AI works in a few words",
// });
// console.log(interaction.output_text);

export async function GET() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Explain how AI works in a few words",
        });

        return NextResponse.json({ suggestion: response.text }, { status: 200 });
    } catch (error) {
        console.error("Failed to generate refresh suggestion", error);
        return NextResponse.json(
            { error: "Failed to generate refresh suggestion" },
            { status: 500 },
        );
    }
}