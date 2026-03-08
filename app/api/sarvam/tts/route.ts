// ─────────────────────────────────────────────
// ZenPrep — TTS API Route
// POST /api/sarvam/tts
// Called by the Agent component when AI needs to speak
// Runs SERVER-SIDE so the Sarvam API key stays secret
// ─────────────────────────────────────────────

import { textToSpeech } from "@/lib/sarvam";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, languageCode } = body;

    // ── Validation ──
    if (!text || typeof text !== "string") {
      return Response.json(
        { success: false, error: "text is required and must be a string" },
        { status: 400 }
      );
    }

    if (!languageCode) {
      return Response.json(
        { success: false, error: "languageCode is required" },
        { status: 400 }
      );
    }

    // ── Call Sarvam TTS ──
    const result = await textToSpeech({
      text,
      languageCode: languageCode as SarvamLanguageCode,
    });

    // Return base64 audio + mime type to the client
    return Response.json(
      {
        success: true,
        audioBase64: result.audioBase64,
        mimeType: result.mimeType,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("TTS API error:", error?.response?.data || error.message);

    return Response.json(
      {
        success: false,
        error: "Failed to generate speech. Please try again.",
      },
      { status: 500 }
    );
  }
}