"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Loader2, CheckCheck, Undo2 } from "lucide-react";
import { MagazineContent } from "@/components/MagazinePreview";

interface Message {
  role: "user" | "assistant";
  content: string;
  hasEdit?: boolean;
  snapshot?: Partial<MagazineContent>; // content state before this edit (for undo)
}

interface MinimaxChatProps {
  isOpen: boolean;
  onClose: () => void;
  content?: MagazineContent;
  onEdit?: (patch: Partial<MagazineContent>) => void;
  onUndo?: (snapshot: Partial<MagazineContent>) => void;
}

function buildMagazineContext(content: MagazineContent): string {
  const eventsList = content.events
    .map((e) => `  • ${e.day} ${e.month}: ${e.title}${e.detail ? ` — ${e.detail}` : ""}`)
    .join("\n");

  const crewList = content.crew
    .map((c) => `  • ${c.name} (${c.role})`)
    .join("\n");

  // Serialize customRows as JSON so the AI can reference and extend them
  const customRowsJson = content.customRows.length > 0
    ? JSON.stringify(content.customRows, null, 2)
    : "  (geen custom rijen — template is niet Custom)";

  return `
=== HUIDIGE MAGAZINE INHOUD ===
Editie: ${content.edition} | Maand: ${content.month} ${content.year} | Stad: ${content.city}
Template: ${content.template}
Banner: "${content.bannerText}"
Logo: kleur=${content.logoColor}, positie=${content.logoPosition}, grootte=${content.logoSize}px, x=${content.logoX}, padding=${content.logoPadding}px
Custom canvas: padding=${content.customPadding}px, gap=${content.customGap}px

CREW (${content.crew.length} leden):
${crewList || "  (geen crew ingevuld)"}
Crew teaser: "${content.crewTeaser}"

AGENDA / EVENTS (${content.events.length}):
${eventsList || "  (geen events ingevuld)"}

HOOFD FEATURE:
Titel: "${content.mainFeatureHeadline}"
Tekst: "${content.mainFeatureBody?.slice(0, 300) || "(leeg)"}"

BUURTPOST:
Titel: "${content.buurtpostHeadline}"
Tekst: "${content.buurtpostBody?.slice(0, 200) || "(leeg)"}"

PAK DE MIC:
"${content.pakDeMicText?.slice(0, 200) || "(leeg)"}"

TERUGBLIK:
Titel: "${content.flashbackHeadline}"
Tekst: "${content.flashbackBody?.slice(0, 200) || "(leeg)"}"

OVER CLUBVANONS:
"${content.companyDescription?.slice(0, 200) || "(leeg)"}"

CUSTOM RIJEN (${content.customRows.length} rijen) — volledige JSON:
${customRowsJson}
=== EINDE MAGAZINE INHOUD ===`.trim();
}

/** Extract <edit>{...}</edit> from response, return { text, patch } */
function parseEditBlock(raw: string): { text: string; patch: Partial<MagazineContent> | null } {
  const match = raw.match(/<edit>\s*([\s\S]*?)\s*<\/edit>/i);
  if (!match) return { text: raw.trim(), patch: null };

  const text = raw.replace(/<edit>[\s\S]*?<\/edit>/i, "").trim();
  try {
    const patch = JSON.parse(match[1]) as Partial<MagazineContent>;
    return { text, patch };
  } catch {
    return { text, patch: null };
  }
}

/** Detect if request is for a big build (full magazine, new layout, etc.) */
function isBigBuild(input: string): boolean {
  const keywords = ["volledig", "magazine", "lay-out", "layout", "template", "bouw", "opnieuw", "from scratch", "helemaal", "compleet", "alle blokken", "alle secties"];
  const lower = input.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const SUGGESTIONS = [
  "Bouw een volledig magazine voor deze maand",
  "Maak een brutalist lay-out met 4 blokken",
  "Voeg een grote quote sectie toe",
  "Schrijf een nieuwe feature headline",
  "Maak 3 events voor april",
  "Zet template op Street stijl",
  "Voeg een crew blok toe",
  "Schrijf een buurtpost over de wijk",
];

export default function MinimaxChat({ isOpen, onClose, content, onEdit, onUndo }: MinimaxChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hoi! Ik ben je AI editor voor CLUBvanONS Magazine.\n\nIk kan teksten schrijven, het volledige magazine opbouwen, nieuwe lay-outs maken en custom blokken toevoegen — allemaal direct in je magazine. Zeg maar wat je wilt.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Aan het schrijven...");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  useEffect(() => { contentRef.current = content; }, [content]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };

    // Snapshot current content for undo
    const snapshot = contentRef.current ? { ...contentRef.current } : undefined;

    setMessages((prev) => [...prev, userMsg]);
    setLoadingLabel(isBigBuild(input) ? "Magazine aan het bouwen..." : "Aan het schrijven...");
    setInput("");
    setLoading(true);

    try {
      const magazineContext = contentRef.current
        ? buildMagazineContext(contentRef.current)
        : undefined;

      const res = await fetch("/api/minimax-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          magazineContext,
        }),
      });

      const data = await res.json();
      const raw: string = data.reply ?? "Sorry, er ging iets mis.";
      const { text, patch } = parseEditBlock(raw);

      let hasEdit = false;
      if (patch && onEdit && Object.keys(patch).length > 0) {
        onEdit(patch);
        hasEdit = true;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text || "✓ Aanpassing toegepast.",
          hasEdit,
          snapshot: hasEdit ? snapshot : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Verbindingsfout. Probeer opnieuw." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", top: 0, right: 0, width: 390, height: "100vh",
        background: "#18181b", borderLeft: "2px solid #f97316",
        display: "flex", flexDirection: "column", zIndex: 9999,
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ background: "#f97316", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageCircle size={18} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>AI Editor</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>bouwt & bewerkt je magazine</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
          <X size={18} />
        </button>
      </div>

      {/* Context badge */}
      {content && (
        <div style={{ background: "#27272a", padding: "5px 14px", fontSize: 11, color: "#a1a1aa", borderBottom: "1px solid #3f3f46", flexShrink: 0 }}>
          📄 Editie {content.edition} — {content.month} {content.year} · Template: {content.template} · {content.customRows.length} custom rijen
        </div>
      )}

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #27272a", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              style={{
                background: "#27272a", border: "1px solid #3f3f46", borderRadius: 6,
                padding: "4px 8px", color: "#a1a1aa", fontSize: 11, cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "88%", padding: "8px 12px", borderRadius: 12,
                background: m.role === "user" ? "#f97316" : "#27272a",
                color: "white", fontSize: 13, lineHeight: 1.55,
                borderBottomRightRadius: m.role === "user" ? 2 : 12,
                borderBottomLeftRadius: m.role === "assistant" ? 2 : 12,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
            {/* Edit applied badge + undo */}
            {m.hasEdit && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#22c55e", fontSize: 11 }}>
                  <CheckCheck size={12} />
                  <span>Aanpassing toegepast</span>
                </div>
                {m.snapshot && onUndo && (
                  <button
                    onClick={() => onUndo(m.snapshot!)}
                    style={{
                      display: "flex", alignItems: "center", gap: 3,
                      background: "none", border: "1px solid #3f3f46",
                      borderRadius: 4, padding: "2px 6px",
                      color: "#71717a", fontSize: 10, cursor: "pointer",
                    }}
                  >
                    <Undo2 size={10} />
                    Ongedaan
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a", fontSize: 12 }}>
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            <span>{loadingLabel}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: "1px solid #27272a", display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Bouw, schrijf, pas aan of vraag iets..."
          style={{
            flex: 1, background: "#27272a", border: "1px solid #3f3f46",
            borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: "#f97316", border: "none", borderRadius: 8,
            padding: "8px 12px", cursor: "pointer", color: "white",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
