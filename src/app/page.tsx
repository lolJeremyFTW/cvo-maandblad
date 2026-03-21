"use client";

import React, { useState, useEffect } from "react";
import MagazinePreview, { defaultContent, MagazineContent, CustomBlock, CustomRow } from "@/components/MagazinePreview";
import EditorPanel from "@/components/EditorPanel";
import MinimaxChat from "@/components/MinimaxChat";
import PasswordGate from "@/components/PasswordGate";
import { Printer, Save, FolderOpen, Trash2, X, Plus, MessageCircle, ZoomIn, ZoomOut, Crosshair } from "lucide-react";

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

// Marker the AI sends when it wants to KEEP an existing image but can't include the raw base64
const IMAGE_KEEP_MARKER = "[AFBEELDING AANWEZIG ✓]";
// Legacy marker used by slimForStorage
const IMAGE_LEGACY_MARKER = "[base64-image]";

function isImageMarker(s?: string): boolean {
  return s === IMAGE_KEEP_MARKER || s === IMAGE_LEGACY_MARKER;
}

/** Apply an AI patch safely — sanitize customRows and auto-set template.
 *
 *  Image handling:
 *  - Card image = "" or missing  → clear the image (user asked to remove it)
 *  - Card image = "[AFBEELDING AANWEZIG ✓]" or "[base64-image]" → keep the
 *    original base64 from prev state (AI can't include raw base64, uses marker)
 *  - Card image = real URL/base64 → use new value as-is
 */
function applyAiPatch(
  prev: MagazineContent,
  patch: Partial<MagazineContent>
): MagazineContent {
  const next = { ...prev, ...patch };

  // Sanitize customRows if present
  if (patch.customRows !== undefined) {
    const sanitized = sanitizeCustomRows(patch.customRows as unknown[]);

    // Restore images the AI marked as "keep" — look them up from prev state
    next.customRows = sanitized.map((row) => ({
      ...row,
      cards: row.cards.map((card) => {
        if (isImageMarker(card.image)) {
          const origRow  = prev.customRows.find(r => r.id === row.id);
          const origCard = origRow?.cards.find(c => c.id === card.id);
          return { ...card, image: origCard?.image ?? "" };
        }
        return card;
      }),
    }));

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

/** Slim magazine content for localStorage.
 *  Images uploaded through the editor are compressed to ~60-90 KB on upload,
 *  so they normally survive localStorage fine.
 *  This function is a safety-net: only strips images that are STILL large
 *  (> ~150 KB actual = > 200 000 base64 chars) — e.g. pasted raw files.
 *  Also covers all image fields including standard-template slots. */
function slimForStorage(content: MagazineContent): MagazineContent {
  // Only drop if it's base64 AND unexpectedly large (wasn't compressed)
  const stripLarge = (s?: string): string | undefined =>
    s && s.startsWith("data:") && s.length > 200_000 ? "[base64-image]" : s;

  return {
    ...content,
    // Standard template images
    mainFeatureImage: stripLarge(content.mainFeatureImage) ?? "",
    buurtpostImage:   stripLarge(content.buurtpostImage)   ?? "",
    flashbackImages:  (content.flashbackImages ?? []).map(img => stripLarge(img) ?? ""),
    // Crew member photos
    crew: content.crew.map((c) => ({
      ...c,
      photo: stripLarge((c as Record<string, unknown>).photo as string | undefined),
    })) as MagazineContent["crew"],
    // Custom block images
    customRows: content.customRows.map((row) => ({
      ...row,
      cards: row.cards.map((card) => ({
        ...card,
        image: stripLarge(card.image),
      })),
    })),
  };
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // QuotaExceededError or similar — silently ignore, don't crash
    return false;
  }
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
  safeSetItem(STORAGE_KEY, JSON.stringify(editions));
}

// ── Region Selector overlay ────────────────────────────────────────────────
function RegionSelector({
  onCapture,
  onCancel,
}: {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [start, setStart]       = useState({ x: 0, y: 0 });
  const [current, setCurrent]   = useState({ x: 0, y: 0 });
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(false);

  // Cancel on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const selRect = {
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    w: Math.abs(current.x - start.x),
    h: Math.abs(current.y - start.y),
  };

  async function handleMouseUp(e: React.MouseEvent) {
    if (!dragging) return;
    setDragging(false);
    const endX = e.clientX, endY = e.clientY;
    const rect = {
      x: Math.min(start.x, endX), y: Math.min(start.y, endY),
      w: Math.abs(endX - start.x),  h: Math.abs(endY - start.y),
    };
    if (rect.w < 20 || rect.h < 20) { onCancel(); return; }

    const mag     = document.getElementById("magazine");
    const wrapper = document.getElementById("magazine-zoom-wrapper") as HTMLElement | null;
    if (!mag) { onCancel(); return; }

    // Compute selection as a fraction of the magazine's SCREEN bounding rect
    const magRect = mag.getBoundingClientRect();
    const fx = Math.max(0, (rect.x - magRect.left) / magRect.width);
    const fy = Math.max(0, (rect.y - magRect.top)  / magRect.height);
    const fw = Math.min((rect.x + rect.w - magRect.left) / magRect.width, 1) - fx;
    const fh = Math.min((rect.y + rect.h - magRect.top)  / magRect.height, 1) - fy;
    if (fw <= 0 || fh <= 0) { onCancel(); return; }

    setCapturing(true);

    // ── Critical fix: html2canvas is confused by CSS zoom on the parent wrapper.
    // Temporarily reset zoom → 1 so it renders the magazine at its native pixel
    // dimensions, then restore the original zoom after capture. ──────────────────
    const prevZoom = wrapper?.style.zoom ?? "";
    if (wrapper) wrapper.style.zoom = "1";

    // Give the browser one paint cycle to apply the zoom reset
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(mag, {
        scale: 1.5,          // 1.5× for crisp text in the AI response
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#FEFDED",  // cream fallback so canvas isn't transparent
      });

      // Restore wrapper zoom immediately after capture
      if (wrapper) wrapper.style.zoom = prevZoom;

      // Crop to the selected fraction
      const cx = Math.max(0, Math.round(fx * canvas.width));
      const cy = Math.max(0, Math.round(fy * canvas.height));
      const cw = Math.max(1, Math.round(fw * canvas.width));
      const ch = Math.max(1, Math.round(fh * canvas.height));

      const cropped = document.createElement("canvas");
      cropped.width = cw; cropped.height = ch;
      const ctx = cropped.getContext("2d");
      if (!ctx) { onCancel(); return; }
      ctx.drawImage(canvas, cx, cy, cw, ch, 0, 0, cw, ch);

      onCapture(cropped.toDataURL("image/png"));
    } catch {
      if (wrapper) wrapper.style.zoom = prevZoom;
      setCapturing(false);
      setCaptureError(true);
      // Auto-dismiss error and close after 3 s
      setTimeout(onCancel, 3000);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        cursor: capturing ? "wait" : "crosshair",
        userSelect: "none",
      }}
      onMouseDown={(e) => {
        setCaptureError(false);
        setDragging(true);
        setStart({ x: e.clientX, y: e.clientY });
        setCurrent({ x: e.clientX, y: e.clientY });
      }}
      onMouseMove={(e) => { if (dragging) setCurrent({ x: e.clientX, y: e.clientY }); }}
      onMouseUp={handleMouseUp}
    >
      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", pointerEvents: "none" }} />

      {/* Status banner */}
      <div style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
        padding: "10px 20px", fontSize: 13, fontWeight: 700, fontFamily: "sans-serif",
        zIndex: 10001, pointerEvents: "none", whiteSpace: "nowrap",
        ...(captureError
          ? { background: "#ef4444", color: "white" }
          : capturing
            ? { background: "#F15B2B", color: "white" }
            : { background: "#1A1A1A", color: "white", border: "2px solid #F15B2B" }),
      }}>
        {captureError
          ? "❌ Screenshot mislukt — probeer opnieuw of verklein de selectie"
          : capturing
            ? "⏳ Screenshot maken..."
            : "🎯 Teken een selectie op het magazine · Esc = annuleren"}
      </div>

      {/* Selection rectangle */}
      {selRect.w > 4 && selRect.h > 4 && (
        <div style={{
          position: "fixed",
          left: selRect.x, top: selRect.y, width: selRect.w, height: selRect.h,
          border: "2px solid #F15B2B",
          background: "rgba(241,91,43,0.08)",
          boxShadow: "0 0 0 1px rgba(241,91,43,0.4)",
          pointerEvents: "none", zIndex: 10000,
        }} />
      )}
    </div>
  );
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
  const [regionSelectMode, setRegionSelectMode] = useState(false);
  const [chatPendingImage, setChatPendingImage] = useState<{ dataUrl: string; mimeType: string } | null>(null);
  const [chatInputHint, setChatInputHint] = useState<string | null>(null);

  useEffect(() => {
    setEditions(loadEditions());
    const last = localStorage.getItem("cvo_magazine_current");
    if (last) {
      try { setContent(JSON.parse(last)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    // Strip base64 images before storing — prevents QuotaExceededError
    safeSetItem("cvo_magazine_current", JSON.stringify(slimForStorage(content)));
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

      {/* Center: Preview area — flex-1, scrolls both axes so magazine never wraps */}
      <div className="flex-1 h-screen overflow-y-auto overflow-x-auto p-8 print:p-0 print:overflow-visible print:h-auto bg-gray-200 print:bg-white min-w-0">

        {/* Toolbar — same 794px width as magazine so they align */}
        <div className="print:hidden mx-auto mb-5 bg-cvo-cream border-[3px] border-cvo-black" style={{ width: 794, boxShadow: "4px 4px 0 #1a1a1a" }}>
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
              {/* Selecteer gebied voor AI analyse */}
              <button
                onClick={() => setRegionSelectMode(true)}
                className={`flex items-center gap-1 px-2 py-1.5 font-archivo-black text-[10px] uppercase tracking-tight border-[2px] transition-colors ${regionSelectMode ? "bg-cvo-orange text-white border-cvo-orange" : "border-cvo-black text-cvo-black hover:bg-cvo-black hover:text-cvo-cream"}`}
                title="Selecteer een gebied op het magazine voor AI-analyse"
              >
                <Crosshair size={12} /> Selecteer
              </button>
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

        {/* Magazine — fixed A4 width (794px), CSS zoom scales it for screen.
            Never shrinks — center area scrolls horizontally if needed. */}
        <div
          id="magazine-zoom-wrapper"
          className="print:mx-0"
          style={{
            width: 794,      // Fixed A4 pixel width — never squishes or wraps
            margin: "0 auto",
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
          externalPendingImage={chatPendingImage}
          externalInputHint={chatInputHint}
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

      {/* Region selector overlay */}
      {regionSelectMode && (
        <RegionSelector
          onCapture={(dataUrl) => {
            setChatPendingImage({ dataUrl, mimeType: "image/png" });
            setChatInputHint("Analyseer dit geselecteerde deel van het magazine:");
            setRegionSelectMode(false);
            setChatOpen(true);
            // Reset after a tick so MinimaxChat's useEffect picks it up once
            setTimeout(() => { setChatPendingImage(null); setChatInputHint(null); }, 200);
          }}
          onCancel={() => setRegionSelectMode(false)}
        />
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
