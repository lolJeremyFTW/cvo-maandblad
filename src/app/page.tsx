"use client";

import React, { useState, useEffect } from "react";
import MagazinePreview, { defaultContent, MagazineContent, CustomBlock, CustomRow } from "@/components/MagazinePreview";
import EditorPanel from "@/components/EditorPanel";
import MinimaxChat from "@/components/MinimaxChat";
import PasswordGate from "@/components/PasswordGate";
import { Printer, Save, FolderOpen, Trash2, X, Plus, MessageCircle, ZoomIn, ZoomOut } from "lucide-react";

// ── Defaults for any missing CustomBlock fields ──────────────────────────────
const BLOCK_DEFAULTS: Omit<CustomBlock, "id" | "headline" | "body"> = {
  cols: 12,
  heightPx: 200,
  style: "black",
  contentType: "text",
  headlineSize: 28,
  bodySize: 13,
  textAlign: "left",
  uppercase: true,
  italic: false,
  padding: "md",
  borderTop: false,
  imagePosition: "left",
  imageSize: 100,
  imageFit: "cover",
  imageOpacity: 100,
};

function sanitizeBlock(raw: Partial<CustomBlock>, rowHeight: number): CustomBlock {
  return {
    ...BLOCK_DEFAULTS,
    headline: "",
    body: "",
    ...raw,
    id: raw.id ?? `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    heightPx: raw.heightPx ?? rowHeight,
  };
}

function sanitizeCustomRows(rows: unknown[]): CustomRow[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((r): r is Record<string, unknown> => r !== null && typeof r === "object")
    .map((row, i) => {
      const rowHeight = typeof row.heightPx === "number" ? row.heightPx : 200;
      const cards = Array.isArray(row.cards)
        ? row.cards.map((c) => sanitizeBlock(c as Partial<CustomBlock>, rowHeight))
        : [];
      return {
        id: typeof row.id === "string" ? row.id : `row-${i}`,
        heightPx: rowHeight,
        cards,
      };
    })
    .filter((row) => row.cards.length > 0);
}

/** Apply an AI patch safely — sanitize customRows and auto-set template */
function applyAiPatch(
  prev: MagazineContent,
  patch: Partial<MagazineContent>
): MagazineContent {
  const next = { ...prev, ...patch };

  // Sanitize customRows if present
  if (patch.customRows !== undefined) {
    next.customRows = sanitizeCustomRows(patch.customRows as unknown[]);
    // Auto-switch to Custom template when AI sends customRows
    if (!patch.template) next.template = "Custom";
  }

  return next;
}

const STORAGE_KEY = "cvo_magazine_editions";

interface SavedEdition {
  id: string;
  name: string;
  savedAt: string;
  content: MagazineContent;
}

function loadEditions(): SavedEdition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEditions(editions: SavedEdition[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(editions));
}

export default function Home() {
  const [content, setContent] = useState<MagazineContent>(defaultContent);
  const [editions, setEditions] = useState<SavedEdition[]>([]);
  const [showManager, setShowManager] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [zoom, setZoom] = useState(90);

  useEffect(() => {
    setEditions(loadEditions());
    const last = localStorage.getItem("cvo_magazine_current");
    if (last) {
      try { setContent(JSON.parse(last)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cvo_magazine_current", JSON.stringify(content));
  }, [content]);

  const handleSave = () => {
    const name = saveName.trim() || `Editie ${content.edition} — ${content.month} ${content.year}`;
    const newEdition: SavedEdition = {
      id: Date.now().toString(),
      name,
      savedAt: new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" }),
      content,
    };
    const updated = [newEdition, ...editions];
    setEditions(updated);
    saveEditions(updated);
    setSaveName("");
    setShowSaveInput(false);
  };

  const handleLoad = (edition: SavedEdition) => {
    setContent(edition.content);
    setShowManager(false);
  };

  const handleDelete = (id: string) => {
    const updated = editions.filter((e) => e.id !== id);
    setEditions(updated);
    saveEditions(updated);
  };

  const handleNew = () => {
    setContent({ ...defaultContent, edition: String(editions.length + 2).padStart(2, "0") });
    setShowManager(false);
  };

  return (
    <PasswordGate>
    <main className="flex h-screen bg-gray-200 overflow-hidden">
      {/* Left: Editor panel */}
      <EditorPanel content={content} onChange={setContent} selectedBlockId={selectedBlockId} onSelectBlock={setSelectedBlockId} />

      {/* Center: Preview area — flex-1, shrinks naturally when chat opens */}
      <div className="flex-1 h-screen overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto bg-gray-200 print:bg-white min-w-0">

        {/* Toolbar */}
        <div className="print:hidden max-w-[820px] mx-auto mb-5 bg-cvo-cream border-[3px] border-cvo-black" style={{ boxShadow: "4px 4px 0 #1a1a1a" }}>
          {/* Top row: label + action buttons */}
          <div className="flex justify-between items-center px-3 py-2 border-b-[2px] border-cvo-black/10">
            <div className="flex items-center gap-3">
              <div className="bg-cvo-black text-cvo-cream px-3 py-1 font-archivo-black text-[13px] uppercase tracking-tight">
                Preview
              </div>
              <p className="text-[9px] font-bold uppercase text-gray-400 font-archivo tracking-widest hidden sm:block">
                Editie {content.edition} — {content.month} {content.year}
              </p>
            </div>
            <div className="flex gap-1.5 items-center">
              {/* Reset */}
              <button
                onClick={() => {
                  if (confirm("Sessie resetten naar standaard? Opgeslagen edities blijven bewaard.")) {
                    localStorage.removeItem("cvo_magazine_current");
                    setContent({ ...defaultContent });
                  }
                }}
                className="flex items-center gap-1 px-2 py-1.5 border-[2px] border-gray-300 text-gray-400 font-archivo-black text-[10px] uppercase tracking-tight hover:bg-gray-100 transition-colors"
                title="Sessie resetten"
              >
                ↺ Reset
              </button>
              {/* Edities */}
              <button
                onClick={() => setShowManager(true)}
                className="flex items-center gap-1 px-2 py-1.5 border-[2px] border-cvo-black font-archivo-black text-[10px] uppercase tracking-tight hover:bg-gray-100 transition-colors"
              >
                <FolderOpen size={12} /> Edities
              </button>
              {/* Opslaan */}
              {showSaveInput ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    placeholder={`Editie ${content.edition} — ${content.month}`}
                    className="border-[2px] border-cvo-black px-2 py-1 text-[10px] font-archivo w-36 outline-none"
                  />
                  <button onClick={handleSave} className="bg-cvo-black text-cvo-cream px-2 py-1.5 font-archivo-black text-[10px] uppercase tracking-tight hover:bg-cvo-orange transition-colors">
                    OK
                  </button>
                  <button onClick={() => setShowSaveInput(false)} className="p-1.5 border-[2px] border-gray-200 hover:bg-gray-100">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="flex items-center gap-1 bg-cvo-orange text-cvo-cream px-2 py-1.5 font-archivo-black text-[10px] uppercase tracking-tight hover:bg-cvo-black transition-colors border-[2px] border-cvo-black"
                >
                  <Save size={12} /> Opslaan
                </button>
              )}
              {/* Print */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 bg-cvo-black text-cvo-cream px-2 py-1.5 font-archivo-black text-[10px] uppercase tracking-tight hover:bg-cvo-orange transition-colors border-[2px] border-cvo-black"
              >
                <Printer size={12} /> Print
              </button>
            </div>
          </div>

          {/* Bottom row: zoom controls */}
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-[9px] uppercase font-archivo-black text-gray-400 tracking-widest">Zoom</span>
            <div className="flex items-center border-[2px] border-gray-300 overflow-hidden">
              <button
                onClick={() => setZoom(z => Math.max(40, z - 10))}
                className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600 border-r border-gray-300"
                title="Uitzoomen (−10%)"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="px-3 py-1 font-archivo-black text-[11px] text-gray-700 hover:bg-gray-100 transition-colors min-w-[46px] text-center border-r border-gray-300"
                title="Klik om terug naar 100%"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom(z => Math.min(150, z + 10))}
                className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                title="Inzoomen (+10%)"
              >
                <ZoomIn size={14} />
              </button>
            </div>
            {/* Quick zoom presets */}
            {[60, 80, 100].map(p => (
              <button
                key={p}
                onClick={() => setZoom(p)}
                className={`px-2 py-0.5 text-[9px] font-archivo-black uppercase tracking-tight border-[2px] transition-colors ${zoom === p ? "bg-cvo-black text-cvo-cream border-cvo-black" : "border-gray-300 text-gray-400 hover:bg-gray-100"}`}
              >
                {p}%
              </button>
            ))}
            {/* AI chat toggle in toolbar too */}
            <div className="ml-auto">
              <button
                onClick={() => setChatOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-archivo-black text-[10px] uppercase tracking-tight border-[2px] transition-colors ${chatOpen ? "bg-cvo-orange text-white border-cvo-orange" : "border-cvo-orange text-cvo-orange hover:bg-cvo-orange hover:text-white"}`}
              >
                <MessageCircle size={12} />
                {chatOpen ? "AI Sluiten" : "AI Editor"}
              </button>
            </div>
          </div>
        </div>

        {/* Magazine — CSS zoom affects layout (unlike transform: scale) */}
        <div
          className="print:max-w-none print:mx-0 print:zoom-none"
          style={{
            maxWidth: 820,
            margin: "0 auto",
            // CSS zoom: actually shrinks layout space, no clipping
            zoom: zoom / 100,
          }}
        >
          <MagazinePreview
            content={content}
            onEdit={(patch) => setContent(prev => ({ ...prev, ...patch }))}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
          />
        </div>
        <div className="h-16 print:hidden" />
      </div>

      {/* Right: AI Chat — flex sibling, NOT position fixed, so it naturally pushes preview left */}
      {chatOpen && (
        <MinimaxChat
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          content={content}
          onEdit={(patch) => setContent((prev) => applyAiPatch(prev, patch))}
          onUndo={(snapshot) => setContent((prev) => applyAiPatch(prev, snapshot))}
        />
      )}

      {/* Floating chat toggle button (only shown when chat is closed) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed", bottom: 24, right: 24,
            width: 52, height: 52, borderRadius: "50%",
            background: "var(--color-cvo-orange, #f97316)",
            border: "none", cursor: "pointer", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
            zIndex: 10000,
          }}
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Edities Manager Modal */}
      {showManager && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-cvo-cream border-[3px] border-cvo-black w-full max-w-[500px] max-h-[80vh] flex flex-col" style={{ boxShadow: "6px 6px 0 #1a1a1a" }}>
            <div className="bg-cvo-black text-cvo-cream px-5 py-3 flex justify-between items-center shrink-0">
              <span className="font-archivo-black text-[16px] uppercase tracking-tight">Mijn Edities</span>
              <button onClick={() => setShowManager(false)} className="p-1 hover:text-cvo-orange transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-3 border-b-[2px] border-cvo-black shrink-0">
              <button
                onClick={handleNew}
                className="w-full flex items-center justify-center gap-2 bg-cvo-orange text-cvo-cream py-2 font-archivo-black text-[12px] uppercase tracking-tight hover:bg-cvo-black transition-colors border-[2px] border-cvo-black"
              >
                <Plus size={14} /> Nieuwe lege editie starten
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {editions.length === 0 ? (
                <p className="text-[11px] text-gray-400 font-archivo text-center py-6">
                  Nog geen opgeslagen edities.<br />Klik op &quot;Opslaan&quot; om de huidige editie op te slaan.
                </p>
              ) : (
                editions.map((ed) => (
                  <div key={ed.id} className="flex items-center gap-3 border-[2px] border-gray-200 p-3 hover:border-cvo-black transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-archivo-black text-[13px] text-cvo-black truncate">{ed.name}</p>
                      <p className="text-[9px] text-gray-400 font-archivo uppercase tracking-wider">{ed.savedAt} · Template: {ed.content.template}</p>
                    </div>
                    <button
                      onClick={() => handleLoad(ed)}
                      className="shrink-0 bg-cvo-black text-cvo-cream px-3 py-1.5 font-archivo-black text-[10px] uppercase tracking-tight hover:bg-cvo-orange transition-colors"
                    >
                      Laden
                    </button>
                    <button
                      onClick={() => handleDelete(ed.id)}
                      className="shrink-0 p-1.5 text-red-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
    </PasswordGate>
  );
}
