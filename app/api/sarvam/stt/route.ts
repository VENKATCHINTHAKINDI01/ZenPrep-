// ─────────────────────────────────────────────
// ZenPrep — STT API Route
// POST /api/sarvam/stt
// Called by Agent component after user finishes speaking
// Receives audio as binary blob, returns transcript text
// ─────────────────────────────────────────────

import { speechToText } from "@/lib/sarvam";

export async function POST(request: Request) {
  try {
    // STT receives multipart/form-data (audio file + language code)
    const formData = await request.formData();

    const audioFile = formData.get("audio") as File | null;
    const languageCode = formData.get("languageCode") as string | null;

    // ── Validation ──
    if (!audioFile) {
      return Response.json(
        { success: false, error: "audio file is required" },
        { status: 400 }
      );
    }

    if (!languageCode) {
      return Response.json(
        { success: false, error: "languageCode is required" },
        { status: 400 }
      );
    }

    // Convert File → Blob for Sarvam SDK
    const audioBlob = new Blob([await audioFile.arrayBuffer()], {
      type: audioFile.type || "audio/webm",
    });

    // ── Call Sarvam STT ──
    const result = await speechToText(
      audioBlob,
      languageCode as SarvamLanguageCode
    );

    return Response.json(
      {
        success: true,
        transcript: result.transcript,
        confidence: result.confidence,
        languageCode: result.languageCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("STT API error:", error?.response?.data || error.message);

    return Response.json(
      {
        success: false,
        error: "Failed to transcribe audio. Please try again.",
        transcript: "",
      },
      { status: 500 }
    );
  }
}

// Allow large audio uploads (up to 10MB)
