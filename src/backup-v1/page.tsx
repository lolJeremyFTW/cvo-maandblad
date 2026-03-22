"use client";

import React, { useState, useEffect } from "react";
import MagazinePreview, { defaultContent, MagazineContent } from "@/components/MagazinePreview";
import EditorPanel from "@/components/EditorPanel";
import { Printer, Save, FolderOpen, Trash2, X, Plus } from "lucide-react";

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

  useEffect(() => {
    setEditions(loadEditions());
    // Herstel laatste sessie als aanwezig
    const last = localStorage.getItem("cvo_magazine_current");
    if (last) {
      try { setContent(JSON.parse(last)); } catch { /* ignore */ }
    }
  }, []);

  // Auto-save huidige sessie bij wijziging
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
    <main className="flex h-screen bg-gray-200 overflow-hidden">
      <EditorPanel content={content} onChange={setContent} />

      {/* Preview area */}
      <div className="flex-1 h-screen overflow-y-auto p-10 print:p-0 print:overflow-visible print:h-auto bg-gray-200 print:bg-white">

        {/* Toolbar */}
        <div className="print:hidden max-w-[820px] mx-auto mb-6 flex justify-between items-center bg-cvo-cream p-3 border-[3px] border-cvo-black" style={{ boxShadow: "4px 4px 0 #1a1a1a" }}>
          <div className="flex items-center gap-3">
            <div className="bg-cvo-black text-cvo-cream px-3 py-1 font-archivo-black text-[14px] uppercase tracking-tight">
              Preview
            </div>
            <p className="text-[9px] font-bold uppercase text-gray-400 font-archivo tracking-widest">
              Editie {content.edition} — {content.month} {content.year}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Edities beheren */}
            <button
              onClick={() => setShowManager(true)}
              className="flex items-center gap-1.5 px-3 py-2 border-[2px] border-cvo-black font-archivo-black text-[11px] uppercase tracking-tight hover:bg-gray-100 transition-colors"
            >
              <FolderOpen size={14} /> Edities
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
                  className="border-[2px] border-cvo-black px-2 py-1 text-[11px] font-archivo w-44 outline-none"
                />
                <button onClick={handleSave} className="bg-cvo-black text-cvo-cream px-3 py-2 font-archivo-black text-[11px] uppercase tracking-tight hover:bg-cvo-orange transition-colors">
                  OK
                </button>
                <button onClick={() => setShowSaveInput(false)} className="p-2 border-[2px] border-gray-200 hover:bg-gray-100">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveInput(true)}
                className="flex items-center gap-1.5 bg-cvo-orange text-cvo-cream px-3 py-2 font-archivo-black text-[11px] uppercase tracking-tight hover:bg-cvo-black transition-colors border-[2px] border-cvo-black"
              >
                <Save size={14} /> Opslaan
              </button>
            )}
            {/* Print */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-cvo-black text-cvo-cream px-3 py-2 font-archivo-black text-[11px] uppercase tracking-tight hover:bg-cvo-orange transition-colors border-[2px] border-cvo-black"
            >
              <Printer size={14} /> Print PDF
            </button>
          </div>
        </div>

        {/* Magazine */}
        <div className="max-w-[820px] mx-auto print:max-w-none print:mx-0">
          <MagazinePreview content={content} onEdit={(patch) => setContent(prev => ({ ...prev, ...patch }))} />
        </div>
        <div className="h-16 print:hidden" />
      </div>

      {/* ── Edities Manager Modal ── */}
      {showManager && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-cvo-cream border-[3px] border-cvo-black w-full max-w-[500px] max-h-[80vh] flex flex-col" style={{ boxShadow: "6px 6px 0 #1a1a1a" }}>
            {/* Header */}
            <div className="bg-cvo-black text-cvo-cream px-5 py-3 flex justify-between items-center shrink-0">
              <span className="font-archivo-black text-[16px] uppercase tracking-tight">Mijn Edities</span>
              <button onClick={() => setShowManager(false)} className="p-1 hover:text-cvo-orange transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* New editie button */}
            <div className="px-5 py-3 border-b-[2px] border-cvo-black shrink-0">
              <button
                onClick={handleNew}
                className="w-full flex items-center justify-center gap-2 bg-cvo-orange text-cvo-cream py-2 font-archivo-black text-[12px] uppercase tracking-tight hover:bg-cvo-black transition-colors border-[2px] border-cvo-black"
              >
                <Plus size={14} /> Nieuwe lege editie starten
              </button>
            </div>

            {/* Saved editions list */}
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
  );
}
