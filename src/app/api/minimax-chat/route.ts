import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, magazineContext } = await req.json();

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "Minimax API key niet geconfigureerd. Voeg MINIMAX_API_KEY toe aan je .env.local bestand (en in Vercel → Settings → Environment Variables).",
    });
  }

  const model = process.env.MINIMAX_MODEL ?? "MiniMax-Text-01";

  const baseSystemPrompt =
    "Je bent een creatieve AI assistent voor CLUBvanONS Magazine — een urban community magazine uit Breda. " +
    "Je helpt de redactie met het schrijven van teksten, artikelen, agenda items, crew-profielen, buurtpost berichten, " +
    "Pak de Mic onderdelen en andere magazine content. Je geeft ook layout-tips en creatief advies. " +
    "Antwoord altijd in het Nederlands. Wees kort, krachtig en to the point — net als het magazine zelf.";

  const systemPrompt = magazineContext
    ? `${baseSystemPrompt}\n\nJe hebt toegang tot de HUIDIGE staat van het magazine dat de redacteur aan het bewerken is. Gebruik deze informatie om gerichte, relevante hulp te geven:\n\n${magazineContext}`
    : baseSystemPrompt;

  try {
    const res = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 1500,
        temperature: 0.75,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Minimax API HTTP error:", res.status, errText);
      return NextResponse.json({
        reply: `Minimax API fout (${res.status}): Controleer of je API key geldig is en het model beschikbaar is op jouw plan. Details: ${errText.slice(0, 150)}`,
      });
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      data.reply ??
      "Geen antwoord ontvangen van Minimax.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Minimax API error:", err);
    return NextResponse.json({
      reply: "Verbindingsfout met Minimax. Controleer je API key en netwerkverbinding.",
    });
  }
}
