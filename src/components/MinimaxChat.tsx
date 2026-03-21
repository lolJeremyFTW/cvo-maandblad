"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";
import { MagazineContent } from "@/components/MagazinePreview";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MinimaxChatProps {
  isOpen: boolean;
  onClose: () => void;
  content?: MagazineContent;
}

function buildMagazineContext(content: MagazineContent): string {
  const eventsList = content.events
    .map((e) => `  • ${e.day} ${e.month}: ${e.title}${e.detail ? ` — ${e.detail}` : ""}`)
    .join("\n");

  const crewList = content.crew
    .map((c) => `  • ${c.name} (${c.role})`)
    .join("\n");

  const customTiles = content.customRows
    .flatMap((row) => row.cards)
    .map((card) => `  • [${card.contentType}] "${card.headline}"${card.body ? ` — ${card.body.slice(0, 60)}...` : ""}`)
    .join("\n");

  return `
=== HUIDIGE MAGAZINE STAAT ===
Editie: ${content.edition} | Maand: ${content.month} ${content.year} | Stad: ${content.city}
Template: ${content.template}
Banner: "${content.bannerText}"

CREW:
${crewList || "  (geen crew ingevuld)"}
Crew teaser: "${content.crewTeaser}"

AGENDA / EVENTS:
${eventsList || "  (geen events ingevuld)"}

HOOFD FEATURE:
Titel: "${content.mainFeatureHeadline}"
Tekst: "${content.mainFeatureBody?.slice(0, 150) || "(leeg)"}..."

BUURTPOST:
Titel: "${content.buurtpostHeadline}"
Tekst: "${content.buurtpostBody?.slice(0, 100) || "(leeg)"}..."

PAK DE MIC:
"${content.pakDeMicText?.slice(0, 150) || "(leeg)"}..."

TERUGBLIK:
Titel: "${content.flashbackHeadline}"
Tekst: "${content.flashbackBody?.slice(0, 100) || "(leeg)"}..."

CUSTOM BLOKKEN (${content.customRows.length} rijen):
${customTiles || "  (geen custom blokken)"}

SPONSORS: ${content.sponsors.map((s) => s.name).join(", ") || "(geen)"}
=== EINDE MAGAZINE STAAT ===
`.trim();
}

export default function MinimaxChat({ isOpen, onClose, content }: MinimaxChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hoi! Ik ben je AI assistent voor CLUBvanONS Magazine. Ik kan de inhoud van je huidige magazine zien en je helpen met teksten, agenda items, crew-profielen en meer. Hoe kan ik je helpen?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  useEffect(() => { contentRef.current = content; }, [content]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const magazineContext = contentRef.current ? buildMagazineContext(contentRef.current) : undefined;
      const res = await fetch("/api/minimax-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], magazineContext }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "Sorry, er ging iets mis." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Verbindingsfout. Probeer opnieuw." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: 380, height: "100vh",
      background: "#18181b", borderLeft: "2px solid #f97316",
      display: "flex", flexDirection: "column", zIndex: 9999,
      fontFamily: "sans-serif"
    }}>
      {/* Header */}
      <div style={{ background: "#f97316", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageCircle size={18} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>AI Assistent</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>powered by Minimax</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
          <X size={18} />
        </button>
      </div>

      {/* Context badge */}
      {content && (
        <div style={{ background: "#27272a", padding: "6px 14px", fontSize: 11, color: "#a1a1aa", borderBottom: "1px solid #3f3f46" }}>
          📄 Editie {content.edition} — {content.month} {content.year} · {content.crew.length} crew · {content.events.length} events
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              maxWidth: "80%", padding: "8px 12px", borderRadius: 12,
              background: m.role === "user" ? "#f97316" : "#27272a",
              color: "white", fontSize: 13, lineHeight: 1.5,
              borderBottomRightRadius: m.role === "user" ? 2 : 12,
              borderBottomLeftRadius: m.role === "assistant" ? 2 : 12,
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a", fontSize: 12 }}>
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            <span>Aan het typen...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #27272a", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Stel een vraag over je magazine..."
          style={{
            flex: 1, background: "#27272a", border: "1px solid #3f3f46",
            borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 13,
            outline: "none"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: "#f97316", border: "none", borderRadius: 8,
            padding: "8px 12px", cursor: "pointer", color: "white",
            opacity: loading || !input.trim() ? 0.5 : 1
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
