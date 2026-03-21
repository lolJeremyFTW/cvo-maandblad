"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Loader2, CheckCheck, Undo2, UserCircle2, ChevronDown } from "lucide-react";
import { MagazineContent } from "@/components/MagazinePreview";

// ── User profile types & storage ─────────────────────────────────────────────

interface UserProfile {
  name: string;
  preferences: string[];   // free-form, e.g. "houdt van mint kleur"
  lastSeen: string;
}

const PROFILES_KEY = "cvo_user_profiles";
const ACTIVE_KEY   = "cvo_active_user";

function loadProfiles(): Record<string, UserProfile> {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY) ?? "{}"); } catch { return {}; }
}
function saveProfiles(p: Record<string, UserProfile>) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(p));
}
function getActiveUserName(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}
function setActiveUserName(name: string) {
  localStorage.setItem(ACTIVE_KEY, name);
}

// ── Message types ─────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  hasEdit?: boolean;
  snapshot?: Partial<MagazineContent>;
}

interface MinimaxChatProps {
  isOpen: boolean;
  onClose: () => void;
  content?: MagazineContent;
  onEdit?: (patch: Partial<MagazineContent>) => void;
  onUndo?: (snapshot: Partial<MagazineContent>) => void;
}

// ── Magazine context builder ──────────────────────────────────────────────────

function buildMagazineContext(content: MagazineContent): string {
  const eventsList = content.events
    .map((e) => `  • ${e.day} ${e.month}: ${e.title}${e.detail ? ` — ${e.detail}` : ""}`)
    .join("\n");
  const crewList = content.crew.map((c) => `  • ${c.name} (${c.role})`).join("\n");
  const customRowsJson = content.customRows.length > 0
    ? JSON.stringify(content.customRows, null, 2)
    : "  (geen custom rijen)";

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

function buildProfileContext(profile: UserProfile | null): string {
  if (!profile) {
    return `=== GEBRUIKER ===\nOnbekend — vraag aan het begin wie er chat.\n=== EINDE GEBRUIKER ===`;
  }
  return `=== GEBRUIKER ===
Naam: ${profile.name}
Voorkeuren:
${profile.preferences.length > 0 ? profile.preferences.map(p => `  • ${p}`).join("\n") : "  (nog geen voorkeuren opgeslagen)"}
=== EINDE GEBRUIKER ===`;
}

// ── Response parsers ──────────────────────────────────────────────────────────

function parseEditBlock(raw: string): { text: string; patch: Partial<MagazineContent> | null } {
  const match = raw.match(/<edit>\s*([\s\S]*?)\s*<\/edit>/i);
  if (!match) return { text: raw.trim(), patch: null };
  const text = raw.replace(/<edit>[\s\S]*?<\/edit>/i, "").trim();
  try {
    return { text, patch: JSON.parse(match[1]) as Partial<MagazineContent> };
  } catch {
    return { text, patch: null };
  }
}

interface ProfileUpdate {
  name?: string;
  addPreference?: string;
  removePreference?: string;
}

function parseProfileBlock(raw: string): { text: string; profileUpdate: ProfileUpdate | null } {
  const match = raw.match(/<profile>\s*([\s\S]*?)\s*<\/profile>/i);
  if (!match) return { text: raw.trim(), profileUpdate: null };
  const text = raw.replace(/<profile>[\s\S]*?<\/profile>/i, "").trim();
  try {
    return { text, profileUpdate: JSON.parse(match[1]) as ProfileUpdate };
  } catch {
    return { text, profileUpdate: null };
  }
}

function parseAllBlocks(raw: string): {
  text: string;
  patch: Partial<MagazineContent> | null;
  profileUpdate: ProfileUpdate | null;
} {
  // Strip profile block first, then edit block
  const profileResult = parseProfileBlock(raw);
  const editResult = parseEditBlock(profileResult.text);
  return {
    text: editResult.text,
    patch: editResult.patch,
    profileUpdate: profileResult.profileUpdate,
  };
}

function isBigBuild(input: string): boolean {
  const keywords = ["volledig", "magazine", "lay-out", "layout", "template", "bouw", "opnieuw", "from scratch", "helemaal", "compleet"];
  return keywords.some((k) => input.toLowerCase().includes(k));
}

function isEditRequest(input: string): boolean {
  const keywords = ["zet", "maak", "schrijf", "voeg", "verander", "pas", "update", "bouw",
    "geef", "verwijder", "vul", "aanpas", "wijzig", "stel", "template",
    "headline", "tekst", "blok", "sectie", "layout", "lay-out", "events",
    "crew", "banner", "style", "stijl"];
  return keywords.some((k) => input.toLowerCase().includes(k));
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function MinimaxChat({ isOpen, onClose, content, onEdit, onUndo }: MinimaxChatProps) {
  // Profile state
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [activeUserName, setActiveUserNameState] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeProfile = activeUserName ? profiles[activeUserName] ?? null : null;

  // Load profiles from localStorage on mount
  useEffect(() => {
    const p = loadProfiles();
    const a = getActiveUserName();
    setProfiles(p);
    setActiveUserNameState(a);
  }, []);

  // Build initial greeting based on whether we know the user
  const buildInitialMessage = (profile: UserProfile | null): string => {
    if (profile) {
      const prefNote = profile.preferences.length > 0
        ? ` Ik weet dat je ${profile.preferences[0]}.`
        : "";
      return `Hoi ${profile.name}! 👋 Welkom terug.${prefNote} Wat wil je vandaag doen met het magazine?`;
    }
    return `Hoi! Ik ben je AI editor voor CLUBvanONS Magazine.\n\nMet wie praat ik? Zeg gewoon je naam, dan onthoud ik jouw stijlvoorkeuren voor de volgende keer.`;
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    const p = loadProfiles();
    const a = getActiveUserName();
    const profile = a ? p[a] ?? null : null;
    return [{ role: "assistant", content: buildInitialMessage(profile) }];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Aan het schrijven...");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  useEffect(() => { contentRef.current = content; }, [content]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function applyProfileUpdate(update: ProfileUpdate) {
    setProfiles((prev) => {
      const name = update.name ?? activeUserName ?? "Gebruiker";
      const existing = prev[name] ?? { name, preferences: [], lastSeen: "" };
      let prefs = [...existing.preferences];

      if (update.addPreference && !prefs.includes(update.addPreference)) {
        prefs.push(update.addPreference);
      }
      if (update.removePreference) {
        prefs = prefs.filter((p) => p !== update.removePreference);
      }

      const updated: UserProfile = {
        name,
        preferences: prefs,
        lastSeen: new Date().toLocaleDateString("nl-NL"),
      };

      const newProfiles = { ...prev, [name]: updated };
      saveProfiles(newProfiles);

      // Set as active user
      setActiveUserName(name);
      setActiveUserNameState(name);

      return newProfiles;
    });
  }

  function switchUser(name: string) {
    setActiveUserName(name);
    setActiveUserNameState(name);
    setShowUserMenu(false);
    const p = loadProfiles();
    const profile = p[name] ?? null;
    setMessages([{ role: "assistant", content: buildInitialMessage(profile) }]);
  }

  function newUser() {
    setActiveUserName("");
    setActiveUserNameState(null);
    setShowUserMenu(false);
    setMessages([{ role: "assistant", content: buildInitialMessage(null) }]);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const snapshot = contentRef.current ? { ...contentRef.current } : undefined;

    setMessages((prev) => [...prev, userMsg]);
    setLoadingLabel(isBigBuild(input) ? "Magazine aan het bouwen..." : "Aan het schrijven...");
    setInput("");
    setLoading(true);

    try {
      const magazineContext = contentRef.current ? buildMagazineContext(contentRef.current) : undefined;
      const profileContext = buildProfileContext(activeProfile);

      const res = await fetch("/api/minimax-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          magazineContext,
          profileContext,
        }),
      });

      const data = await res.json();
      const raw: string = data.reply ?? "Sorry, er ging iets mis.";
      const { text, patch, profileUpdate } = parseAllBlocks(raw);

      // Apply profile update
      if (profileUpdate) {
        applyProfileUpdate(profileUpdate);
      }

      // Apply magazine edit
      let hasEdit = false;
      if (patch && onEdit && Object.keys(patch).length > 0) {
        onEdit(patch);
        hasEdit = true;
      }

      const noEditWarning = !hasEdit && !profileUpdate && isEditRequest(userMsg.content)
        ? "\n\n⚠️ De AI paste niets aan. Probeer het opnieuw of wees specifieker."
        : "";

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: (text || "✓ Gedaan.") + noEditWarning,
        hasEdit,
        snapshot: hasEdit ? snapshot : undefined,
      }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Verbindingsfout. Probeer opnieuw." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const knownUsers = Object.values(profiles);

  return (
    <div style={{
      width: 390, minWidth: 390, height: "100vh",
      background: "#18181b", borderLeft: "2px solid #F15B2B",
      display: "flex", flexDirection: "column",
      fontFamily: "sans-serif", flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ background: "#F15B2B", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageCircle size={18} color="white" />
          <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>AI Editor</span>
          {activeProfile && (
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, background: "rgba(0,0,0,0.15)", padding: "1px 6px", borderRadius: 10 }}>
              {activeProfile.name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* User menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu(p => !p)}
              title="Gebruiker wisselen"
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, padding: "4px 7px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 3 }}
            >
              <UserCircle2 size={14} />
              <ChevronDown size={10} />
            </button>
            {showUserMenu && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#1c1c1f",
                border: "1px solid #3f3f46", borderRadius: 8, minWidth: 170, zIndex: 100,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden",
              }}>
                <div style={{ padding: "6px 10px", fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                  Bekende gebruikers
                </div>
                {knownUsers.map((u) => (
                  <button
                    key={u.name}
                    onClick={() => switchUser(u.name)}
                    style={{
                      width: "100%", textAlign: "left", background: u.name === activeUserName ? "#F15B2B22" : "none",
                      border: "none", padding: "8px 12px", cursor: "pointer", color: u.name === activeUserName ? "#F15B2B" : "white",
                      fontSize: 12, fontWeight: u.name === activeUserName ? 700 : 400,
                    }}
                  >
                    {u.name}
                    {u.preferences.length > 0 && (
                      <span style={{ color: "#71717a", fontSize: 10, marginLeft: 6 }}>· {u.preferences.length} voorkeuren</span>
                    )}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid #27272a" }}>
                  <button
                    onClick={newUser}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "8px 12px", cursor: "pointer", color: "#a1a1aa", fontSize: 12 }}
                  >
                    + Nieuwe gebruiker
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* User preferences strip */}
      {activeProfile && activeProfile.preferences.length > 0 && (
        <div style={{ background: "#1c1c1f", padding: "5px 14px", fontSize: 10, color: "#a1a1aa", borderBottom: "1px solid #27272a", flexShrink: 0 }}>
          ✦ Jouw stijl: {activeProfile.preferences.slice(0, 2).join(" · ")}
          {activeProfile.preferences.length > 2 && ` · +${activeProfile.preferences.length - 2}`}
        </div>
      )}

      {/* Context badge */}
      {content && (
        <div style={{ background: "#27272a", padding: "5px 14px", fontSize: 11, color: "#a1a1aa", borderBottom: "1px solid #3f3f46", flexShrink: 0 }}>
          📄 Editie {content.edition} — {content.month} {content.year} · Template: {content.template} · {content.customRows.length} rijen
        </div>
      )}

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #27272a", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              style={{ background: "#27272a", border: "1px solid #3f3f46", borderRadius: 6, padding: "4px 8px", color: "#a1a1aa", fontSize: 11, cursor: "pointer" }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }} onClick={() => setShowUserMenu(false)}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "88%", padding: "8px 12px", borderRadius: 12,
              background: m.role === "user" ? "#F15B2B" : "#27272a",
              color: "white", fontSize: 13, lineHeight: 1.55,
              borderBottomRightRadius: m.role === "user" ? 2 : 12,
              borderBottomLeftRadius: m.role === "assistant" ? 2 : 12,
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
            {m.hasEdit && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#22c55e", fontSize: 11 }}>
                  <CheckCheck size={12} />
                  <span>Aanpassing toegepast</span>
                </div>
                {m.snapshot && onUndo && (
                  <button
                    onClick={() => onUndo(m.snapshot!)}
                    style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "1px solid #3f3f46", borderRadius: 4, padding: "2px 6px", color: "#71717a", fontSize: 10, cursor: "pointer" }}
                  >
                    <Undo2 size={10} /> Ongedaan
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
          placeholder={activeProfile ? `${activeProfile.name}, wat wil je doen?` : "Zeg je naam of vraag iets..."}
          style={{ flex: 1, background: "#27272a", border: "1px solid #3f3f46", borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 13, outline: "none" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ background: "#F15B2B", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "white", opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
