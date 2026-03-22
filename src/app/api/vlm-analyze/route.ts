import { NextRequest, NextResponse } from "next/server";

// Separate endpoint for VLM image analysis — keeps each API call under 10s
// (Vercel hobby plan limit) instead of combining VLM + text in one request.
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { imageBase64, imageMimeType, prompt } = await req.json();

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ description: null, error: "API key not configured" });
  }

  if (!imageBase64) {
    return NextResponse.json({ description: null, error: "No image provided" });
  }

  const apiHost = (process.env.MINIMAX_API_HOST ?? "https://api.minimaxi.chat").replace(/\/$/, "");
  const dataUrl = `data:${imageMimeType ?? "image/jpeg"};base64,${imageBase64}`;

  const userPrompt = prompt
    || "Beschrijf deze afbeelding gedetailleerd in het Nederlands: wat zie je, sfeer, kleuren, mensen, locatie, stijl. Is de foto geschikt als magazine-afbeelding?";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(`${apiHost}/v1/coding_plan/vlm`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt: userPrompt, image_url: dataUrl }),
    });

    clearTimeout(timer);

    if (!res.ok) {
      const err = await res.text();
      console.error(`VLM HTTP ${res.status}:`, err.slice(0, 300));
      return NextResponse.json({ description: null, error: `VLM HTTP ${res.status}` });
    }

    const data = await res.json() as { content?: string; base_resp?: { status_code: number; status_msg: string } };
    console.log("VLM response:", JSON.stringify(data).slice(0, 400));

    // Check MiniMax-specific error codes
    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error("VLM error:", data.base_resp.status_code, data.base_resp.status_msg);
      return NextResponse.json({
        description: null,
        error: `VLM error ${data.base_resp.status_code}: ${data.base_resp.status_msg}`,
      });
    }

    const description = data.content || null;

    if (description) {
      console.log("VLM description:", description.slice(0, 200));
    }

    return NextResponse.json({ description, error: null });
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : String(e);
    console.error("VLM call failed:", msg);
    return NextResponse.json({ description: null, error: msg });
  }
}
