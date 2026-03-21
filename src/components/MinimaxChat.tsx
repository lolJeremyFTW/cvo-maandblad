"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Loader2, CheckCheck, Undo2, UserCircle2, ChevronDown, ImageIcon, Trash2, Eye, RotateCcw } from "lucide-react";
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

// ── Chat history persistence ──────────────────────────────────────────────────

const CHAT_KEY = "cvo_chat_history";

function loadChatHistory(): Message[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Message[];
  } catch { return []; }
}

function saveChatHistory(msgs: Message[]) {
  // Don't store base64 images in history to keep localStorage light
  const slim = msgs.map(m => ({ ...m, imageDataUrl: m.imageDataUrl ? "[afbeelding]" : undefined }));
  try { localStorage.setItem(CHAT_KEY, JSON.stringify(slim.slice(-60))); } catch { /* quota */ }
}

// ── Message types ─────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  hasEdit?: boolean;
  snapshot?: Partial<MagazineContent>;
  imageDataUrl?: string;   // for display in chat
}

interface MinimaxChatProps {
  isOpen: boolean;
  onClose: () => void;
  content?: MagazineContent;
  onEdit?: (patch: Partial<MagazineContent>) => void;
  onUndo?: (snapshot: Partial<MagazineContent>) => void;
  externalPendingImage?: { dataUrl: string; mimeType: string } | null;
}

// ── Magazine context builder ──────────────────────────────────────────────────

function buildMagazineContext(content: MagazineContent): string {
  const eventsList = content.events
    .map((e) => `  • ${e.day} ${e.month}: ${e.title}${e.detail ? ` — ${e.detail}` : ""}`)
    .join("\n");
  const crewList = content.crew.map((c) => `  • ${c.name} (${c.role})`).join("\n");

  // Strip base64 images from customRows — replace with human-readable marker
  const slimRows = content.customRows.map(row => ({
    ...row,
    cards: row.cards.map(card => ({
      ...card,
      image: card.image
        ? (card.image.startsWith("data:") ? "[AFBEELDING AANWEZIG ✓]" : card.image)
        : "",
    })),
  }));
  const customRowsJson = content.customRows.length > 0
    ? JSON.stringify(slimRows, null, 2)
    : "  (geen custom rijen)";

  // Summarise which standard-template image slots are filled
  const hasMainImg   = !!content.mainFeatureImage;
  const hasBuurtImg  = !!content.buurtpostImage;
  const flashCount   = (content.flashbackImages ?? []).filter(Boolean).length;

  return `
=== HUIDIGE MAGAZINE INHOUD ===
Editie: ${content.edition} | Maand: ${content.month} ${content.year} | Stad: ${content.city}
Template: ${content.template}
Banner: "${content.bannerText}"
Logo: kleur=${content.logoColor}, positie=${content.logoPosition}, grootte=${content.logoSize}px, x=${content.logoX}, padding=${content.logoPadding}px
Custom canvas: padding=${content.customPadding}px, gap=${content.customGap}px

AFBEELDINGEN IN MAGAZINE:
• Hoofdfeature foto: ${hasMainImg ? "✓ Afbeelding aanwezig" : "(leeg — geen foto)"}
• Buurtpost foto:    ${hasBuurtImg ? "✓ Afbeelding aanwezig" : "(leeg — geen foto)"}
• Terugblik foto's: ${flashCount} van 3 aanwezig
• Custom blokken:   zie JSON hieronder (veld "image": "[AFBEELDING AANWEZIG ✓]" = foto aanwezig)

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

CUSTOM RIJEN (${content.customRows.length} rijen) — volledige JSON (images vervangen door marker):
${customRowsJson}
=== EINDE MAGAZINE INHOUD ===`.trim();
}

function buildProfileContext(profile: UserProfile | null): string {
  if (!profile) {
    return `=== GEBRUIKER ===\nOnbekend — vraag aan het begin wie er chat.\n=== EINDE GEBRUIKER ===`;
  }
  return `=== GEBRUIKER ===
Naam: ${profile.name}
Voorkeuren (geleerd uit eerdere sessies):
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
    "crew", "banner", "style", "stijl", "analyseer", "kijk naar", "beschrijf"];
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

export default function MinimaxChat({ isOpen, onClose, content, onEdit, onUndo, externalPendingImage }: MinimaxChatProps) {
  // Profile state
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [activeUserName, setActiveUserNameState] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPrefsPanel, setShowPrefsPanel] = useState(false);

  // Image state
  const [pendingImage, setPendingImage] = useState<{ dataUrl: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProfile = activeUserName ? profiles[activeUserName] ?? null : null;

  // Load profiles from localStorage on mount
  useEffect(() => {
    const p = loadProfiles();
    const a = getActiveUserName();
    setProfiles(p);
    setActiveUserNameState(a);
  }, []);

  // Accept region captures from the parent (RegionSelector)
  useEffect(() => {
    if (externalPendingImage) {
      setPendingImage(externalPendingImage);
    }
  }, [externalPendingImage]);

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
    const history = loadChatHistory();
    if (history.length > 0) return history;
    const p = loadProfiles();
    const a = getActiveUserName();
    const profile = a ? p[a] ?? null : null;
    return [{ role: "assistant", content: buildInitialMessage(profile) }];
  });

  // Persist chat history whenever messages change
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Clipboard paste handler (screenshots) ────────────────────────────────
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (!file) continue;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            setPendingImage({ dataUrl, mimeType: item.type });
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);
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

      setActiveUserName(name);
      setActiveUserNameState(name);

      return newProfiles;
    });
  }

  function deletePreference(prefToDelete: string) {
    if (!activeUserName) return;
    setProfiles((prev) => {
      const existing = prev[activeUserName];
      if (!existing) return prev;
      const updated: UserProfile = {
        ...existing,
        preferences: existing.preferences.filter(p => p !== prefToDelete),
      };
      const newProfiles = { ...prev, [activeUserName]: updated };
      saveProfiles(newProfiles);
      return newProfiles;
    });
  }

  function switchUser(name: string) {
    setActiveUserName(name);
    setActiveUserNameState(name);
    setShowUserMenu(false);
    setShowPrefsPanel(false);
    localStorage.removeItem(CHAT_KEY);
    const p = loadProfiles();
    const profile = p[name] ?? null;
    setMessages([{ role: "assistant", content: buildInitialMessage(profile) }]);
  }

  function newUser() {
    setActiveUserName("");
    setActiveUserNameState(null);
    setShowUserMenu(false);
    setShowPrefsPanel(false);
    localStorage.removeItem(CHAT_KEY);
    setMessages([{ role: "assistant", content: buildInitialMessage(null) }]);
  }

  function startNewChat() {
    const fresh = [{ role: "assistant" as const, content: buildInitialMessage(activeProfile) }];
    setMessages(fresh);
    localStorage.removeItem(CHAT_KEY);
    setPendingImage(null);
    setInput("");
  }

  // ── Client-side instant name detection ────────────────────────────────────
  // Saves the user's name IMMEDIATELY (before AI responds) so they appear
  // in "Bekende gebruikers" the moment they send their first message.

  function tryDetectName(text: string): string | null {
    const t = text.trim();
    // Must be 1–3 words, letters only (includes accented chars), no punctuation
    if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]{1,30}$/.test(t)) return null;
    const words = t.split(/\s+/);
    if (words.length > 3) return null;
    // Reject obvious command words / greetings that aren't names
    const notNames = ["hoi", "hallo", "hey", "hi", "ja", "nee", "ok", "oke", "oké",
      "goed", "zet", "maak", "bouw", "voeg", "schrijf", "test", "help"];
    if (notNames.includes(t.toLowerCase())) return null;
    // Capitalise first letter of each word → treat as proper name
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  function instantSaveName(name: string) {
    setProfiles((prev) => {
      // Don't overwrite an existing profile
      if (prev[name]) return prev;
      const newProfile: UserProfile = {
        name,
        preferences: [],
        lastSeen: new Date().toLocaleDateString("nl-NL"),
      };
      const next = { ...prev, [name]: newProfile };
      saveProfiles(next);
      return next;
    });
    setActiveUserName(name);
    setActiveUserNameState(name);
  }

  // ── Image upload ───────────────────────────────────────────────────────────

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPendingImage({ dataUrl, mimeType: file.type });
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = "";
  }

  // ── Send message ───────────────────────────────────────────────────────────

  async function sendMessage() {
    if ((!input.trim() && !pendingImage) || loading) return;
    const userContent = input.trim() || (pendingImage ? "Analyseer deze afbeelding en geef suggesties voor het magazine." : "");
    const snapshot = contentRef.current ? { ...contentRef.current } : undefined;

    // ── Instant name detection (no AI needed) ─────────────────────────────
    // If we don't know the user yet and the message looks like a name, save it NOW
    if (!activeUserName && input.trim()) {
      const detectedName = tryDetectName(input.trim());
      if (detectedName) {
        instantSaveName(detectedName);
      }
    }
    // Also detect "ik ben [naam]" / "mijn naam is [naam]" patterns
    if (!activeUserName) {
      const nameMatch = input.trim().match(
        /(?:ik ben|mijn naam is|ik heet|noem mij|call me)\s+([a-zA-ZÀ-ÖØ-öø-ÿ\s'-]{1,20})/i
      );
      if (nameMatch) {
        const extracted = nameMatch[1].trim();
        const capitalised = extracted.charAt(0).toUpperCase() + extracted.slice(1);
        instantSaveName(capitalised);
      }
    }

    const userMsg: Message = {
      role: "user",
      content: userContent,
      imageDataUrl: pendingImage?.dataUrl,
    };

    // Extract base64 from dataUrl (strip "data:image/...;base64,")
    const imageBase64 = pendingImage?.dataUrl.split(",")[1] ?? null;
    const imageMimeType = pendingImage?.mimeType ?? null;

    setMessages((prev) => [...prev, userMsg]);
    setLoadingLabel(isBigBuild(userContent) ? "Magazine aan het bouwen..." : pendingImage ? "Afbeelding analyseren..." : "Aan het schrijven...");
    setInput("");
    setPendingImage(null);
    setLoading(true);

    try {
      const magazineContext = contentRef.current ? buildMagazineContext(contentRef.current) : undefined;
      const profileContext = buildProfileContext(activeProfile);

      const res = await fetch("/api/minimax-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          magazineContext,
          profileContext,
          imageBase64,
          imageMimeType,
        }),
      });

      const data = await res.json();
      const raw: string = data.reply ?? "Sorry, er ging iets mis.";
      const { text, patch, profileUpdate } = parseAllBlocks(raw);

      // Apply profile update (self-learning)
      if (profileUpdate) {
        applyProfileUpdate(profileUpdate);
      }

      // Apply magazine edit
      let hasEdit = false;
      if (patch && onEdit && Object.keys(patch).length > 0) {
        onEdit(patch);
        hasEdit = true;
      }

      const noEditWarning = !hasEdit && !profileUpdate && isEditRequest(userContent) && !imageBase64
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
              onClick={() => { setShowUserMenu(p => !p); setShowPrefsPanel(false); }}
              title="Gebruiker wisselen"
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, padding: "4px 7px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 3 }}
            >
              <UserCircle2 size={14} />
              <ChevronDown size={10} />
            </button>
            {showUserMenu && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#1c1c1f",
                border: "1px solid #3f3f46", borderRadius: 8, minWidth: 190, zIndex: 100,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden",
              }}>
                <div style={{ padding: "6px 10px", fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                  Bekende gebruikers
                </div>
                {knownUsers.map((u) => (
                  <div key={u.name} style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() => switchUser(u.name)}
                      style={{
                        flex: 1, textAlign: "left", background: u.name === activeUserName ? "#F15B2B22" : "none",
                        border: "none", padding: "8px 12px", cursor: "pointer", color: u.name === activeUserName ? "#F15B2B" : "white",
                        fontSize: 12, fontWeight: u.name === activeUserName ? 700 : 400,
                      }}
                    >
                      {u.name}
                      {u.preferences.length > 0 && (
                        <span style={{ color: "#71717a", fontSize: 10, marginLeft: 6 }}>· {u.preferences.length} voorkeuren</span>
                      )}
                    </button>
                    {u.name === activeUserName && u.preferences.length > 0 && (
                      <button
                        onClick={() => { setShowPrefsPanel(p => !p); setShowUserMenu(false); }}
                        title="Beheer voorkeuren"
                        style={{ background: "none", border: "none", padding: "6px 8px", cursor: "pointer", color: "#71717a" }}
                      >
                        <Eye size={12} />
                      </button>
                    )}
                  </div>
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
          <button
            onClick={startNewChat}
            title="Nieuwe chat starten"
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, padding: "4px 7px", cursor: "pointer", color: "white", display: "flex", alignItems: "center" }}
          >
            <RotateCcw size={14} />
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Preferences panel (inline, below header) */}
      {showPrefsPanel && activeProfile && activeProfile.preferences.length > 0 && (
        <div style={{ background: "#1c1c1f", borderBottom: "1px solid #3f3f46", padding: "10px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Opgeslagen voorkeuren — {activeProfile.name}
            </span>
            <button onClick={() => setShowPrefsPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}>
              <X size={12} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {activeProfile.preferences.map((pref, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#27272a", borderRadius: 6, padding: "5px 8px" }}>
                <span style={{ fontSize: 11, color: "#e4e4e7", flex: 1 }}>{pref}</span>
                <button
                  onClick={() => deletePreference(pref)}
                  title="Verwijder voorkeur"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a", padding: "2px 4px", marginLeft: 6, flexShrink: 0 }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: "#52525b", marginTop: 6 }}>
            De AI gebruikt deze voorkeuren automatisch. Klik op 🗑 om te verwijderen.
          </p>
        </div>
      )}

      {/* User preferences strip */}
      {!showPrefsPanel && activeProfile && activeProfile.preferences.length > 0 && (
        <button
          onClick={() => setShowPrefsPanel(true)}
          style={{ background: "#1c1c1f", padding: "5px 14px", fontSize: 10, color: "#a1a1aa", borderBottom: "1px solid #27272a", flexShrink: 0, border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}
        >
          ✦ Jouw stijl: {activeProfile.preferences.slice(0, 2).join(" · ")}
          {activeProfile.preferences.length > 2 && ` · +${activeProfile.preferences.length - 2}`}
          <span style={{ color: "#52525b", marginLeft: 8, fontSize: 9 }}>klik om te beheren</span>
        </button>
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
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }} onClick={() => { setShowUserMenu(false); }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            {/* Image preview in message */}
            {m.imageDataUrl && (
              <img
                src={m.imageDataUrl}
                alt="Uploaded"
                style={{ maxWidth: 200, maxHeight: 140, borderRadius: 8, marginBottom: 4, objectFit: "cover", border: "1px solid #3f3f46" }}
              />
            )}
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

      {/* Pending image preview */}
      {pendingImage && (
        <div style={{ padding: "8px 12px", borderTop: "1px solid #27272a", background: "#1c1c1f", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={pendingImage.dataUrl}
            alt="Te versturen"
            style={{ height: 48, width: 64, objectFit: "cover", borderRadius: 6, border: "1px solid #3f3f46" }}
          />
          <span style={{ fontSize: 11, color: "#a1a1aa", flex: 1 }}>Afbeelding klaar om te versturen</span>
          <button
            onClick={() => setPendingImage(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 12px 8px", borderTop: "1px solid #27272a", flexShrink: 0 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
        {/* Image upload button (also supports Ctrl+V paste) */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Afbeelding uploaden (of plak met Ctrl+V)"
          style={{
            background: pendingImage ? "#F15B2B22" : "#27272a",
            border: `1px solid ${pendingImage ? "#F15B2B" : "#3f3f46"}`,
            borderRadius: 8, padding: "8px 10px", cursor: "pointer",
            color: pendingImage ? "#F15B2B" : "#71717a", flexShrink: 0,
          }}
        >
          <ImageIcon size={16} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder={activeProfile ? `${activeProfile.name}, wat wil je doen?` : "Zeg je naam of vraag iets..."}
          style={{ flex: 1, background: "#27272a", border: "1px solid #3f3f46", borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 13, outline: "none" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || (!input.trim() && !pendingImage)}
          style={{ background: "#F15B2B", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "white", opacity: loading || (!input.trim() && !pendingImage) ? 0.5 : 1, flexShrink: 0 }}
        >
          <Send size={16} />
        </button>
      </div>
      <p style={{ color: "#3f3f46", fontSize: 9, marginTop: 5, textAlign: "center" }}>
        📋 Plak een screenshot met Ctrl+V · 📷 Upload via het icoontje
      </p>
      </div>
    </div>
  );
}
