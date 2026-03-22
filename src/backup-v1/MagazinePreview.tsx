"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TemplateType = "Standard" | "Collage" | "Brutalist" | "Street" | "Feature" | "Minimalist" | "Custom";

export interface CustomBlock {
  id: string;
  widthPct: number;        // 15–100, draggable
  heightPx: number;        // 120 | 180 | 240 | 300
  style: "black" | "orange" | "mint" | "cream";
  contentType: "poster" | "text" | "image" | "split";
  headline: string;
  body: string;
  image?: string;
}

export interface MagazineContent {
  template: TemplateType;
  logoPosition: "Top" | "Bottom";
  logoColor: "Orange" | "Black" | "Gold" | "Green";
  logoX: number;    // 0=left … 100=right
  logoSize: number; // height in px
  edition: string;
  month: string;
  year: string;
  city: string;
  bannerText: string;
  crew: { name: string; role: string; avatar?: string }[];
  crewTeaser: string;
  flashbackHeadline: string;
  flashbackBody: string;
  flashbackImages: string[];
  mainFeatureHeadline: string;
  mainFeatureBody: string;
  mainFeatureImage: string;
  events: { day: string; month: string; title: string; detail: string }[];
  buurtpostHeadline: string;
  buurtpostBody: string;
  buurtpostImage: string;
  pakDeMicText: string;
  sponsors: { name: string; logo?: string }[];
  companyDescription: string;
  customBlocks: CustomBlock[];
}

export const defaultContent: MagazineContent = {
  template: "Standard",
  logoPosition: "Bottom",
  logoColor: "Orange" as const,
  logoX: 50,
  logoSize: 44,
  edition: "01",
  month: "Maart",
  year: "2026",
  city: "Breda",
  bannerText: "Clubnights — Buurtpost — Crew — Suikerfeest",
  crew: [
    { name: "Stefanie", role: "Crew" },
    { name: "Lotta", role: "Crew" },
    { name: "Amy", role: "Crew" },
    { name: "Anne", role: "Crew" },
    { name: "Jaap", role: "Crew" },
  ],
  crewTeaser: "Wij zijn CLUBvanONS. Een club van mensen die geloven dat de wijk meer is dan een plek om te wonen. We brengen mensen samen, creëren momenten en laten de buurt zien van haar mooiste kant.",
  flashbackHeadline: "Wat Er Is Geweest",
  flashbackBody: "Het was een drukke en mooie periode. Van spontane sessies in de wijk tot grotere evenementen. We ontmoetten nieuwe gezichten en lieten zien wat CLUBvanONS in de kern is.",
  flashbackImages: ["", "", ""],
  mainFeatureHeadline: "We Waren Erbij",
  mainFeatureBody: "Afgelopen zondag waren we er weer. Het Ramadan Suikerfeest in de wijk — de eerste keer in lange tijd dat we samen op straat stonden. Een moment om nooit te vergeten.",
  mainFeatureImage: "",
  events: [
    { day: "XX", month: "MRT", title: "Clubnight #01", detail: "locatie — aanvangstijd" },
    { day: "XX", month: "APR", title: "Clubnight #02", detail: "locatie — aanvangstijd" },
    { day: "XX", month: "MEI", title: "Clubnight #03", detail: "locatie — aanvangstijd" },
  ],
  buurtpostHeadline: "Uit De Wijk",
  buurtpostBody: "Een plek, persoon of initiatief uit de buurt. Dichtbij, concreet en van ons allemaal.",
  buurtpostImage: "",
  pakDeMicText: "Heb jij iets te zeggen? Een vraag, een verhaal of een mening? Stuur ons een berichtje via WhatsApp of reply op deze mail. De beste reacties verschijnen in de volgende editie.",
  sponsors: [
    { name: "Stakeholder 1" },
    { name: "Stakeholder 2" },
    { name: "Stakeholder 3" },
    { name: "Stakeholder 4" },
  ],
  companyDescription: "CLUBvanONS is een urban living lab in Breda. Wij verbinden mensen, culturen en wijken door middel van kunst, muziek en community.",
  customBlocks: [],
};

function CvoLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#ACDCCE" points="133.15,538.96 448.08,634.5 531.01,634.5 839.64,558.18 839.64,436.05 529.96,356.88 444.79,356.88 133.15,438.01"/>
      <path fill="#1a1a1a" d="M161.65,528.94l-1.13-76.25c5.2-1.03,15.43-2.93,23.51-5.03l0.79,18.14l-13.5,1.21l0.36,32l12.71,1.29l0.7,35.48L161.65,528.94z"/>
      <path fill="#1a1a1a" d="M189.84,537.43c-0.2-24.07-0.9-63.12-1.27-90.75c2.09-0.46,8.51-2.24,12.08-3.28l0.2,64.69c6.22,0.18,17.51,0.52,23.9,0.09l0.65,37.2L189.84,537.43z"/>
      <path fill="#1a1a1a" d="M229.97,546.07c0.06-28.69-0.11-83.44-0.37-108.35l27.9-6.91l2.59,85.32l15.41,1.91l-2-91.12l20.33-3.41c0.59,35.01,1.47,104.62,2.05,139.4C269.07,555.69,235.25,547.34,229.97,546.07z"/>
      <path fill="#1a1a1a" d="M302.55,565.1c1.44-45.64,2.2-98.25,2.59-143.3l124.38-29.09l1.04,72.91l-25.29,13.23l41.67,8.96l-0.7,110.53L302.55,565.1z M374.54,438.39l-39.05,7.32l0.61,28.58l38.62-3.54L374.54,438.39z M388.61,495.24l-51.32,0.88l0.09,38.1l52.47,6.66L388.61,495.24z"/>
      <path fill="#1a1a1a" d="M531.61,601.85c2.16-68.92,1.85-144.61,0-211.29l142.34,28.89l5.78,147.83L531.61,601.85z M639.46,447.49l-63.97-9.12c1.8,47.02,3.08,67.99,4.09,102.45l64.78-7.76L639.46,447.49z"/>
      <path fill="#1a1a1a" d="M730.22,559.87l-5.99-48.73l-4.89-7.41l-6.43,0.17l1.76,58.22l-22.31,5.81l-5.52-144.58l18.19,2.54l30.63,44.95l-1.31-38.53l23.38,5.89l1.48,115.21L730.22,559.87z"/>
      <path fill="#1a1a1a" d="M807.87,542.23l-41.66,10.13l-1.23-33.17l24.85-2.46l4.92-4.92l-0.49-7.64l-29.54-17.53l0.35-32.81l7.64-12.22l37.26,6.77l-0.18,27.78c-6.43-0.69-14.48-1.66-22.97-1.74c0.22,2.88,0,10.1,0,10.1l24.31,16.96l0.66,27.92L807.87,542.23z"/>
      <path fill="#1a1a1a" d="M520.83,551.38c0.15,9.2,1,41,1.06,51.62c0,0-51.03,0.28-65.2,0.61l0.52-36.72l42.98,3.48l-0.27-7.36l-42.78-11.81l0.9-21.5C472.98,534.97,503.25,545.32,520.83,551.38z"/>
      <path fill="#1a1a1a" d="M521.61,495.35l-30.68,0.3l0.23,12.05l28.88,4.46l0.69,22.79l-63.01-11.88l0.24-60.83l62.62,0.58L521.61,495.35z M468.08,479.65l0.24,30.76l8.49,1.99l-0.07-32.39L468.08,479.65z"/>
      <path fill="#1a1a1a" d="M520.87,420.07l-25.42,5.01l-3.67,4.31l-0.01,5.64l28.64-0.13l0.66,19.11l-62.65-0.97l-0.38-13.45l17.94-25.75l-17.62,0.93l0.68-23.32l61.46-3.14L520.87,420.07z"/>
    </svg>
  );
}

// ── Inline editable text ──
export type OnEdit = (patch: Partial<MagazineContent>) => void;

function E({
  value,
  onEdit,
  className,
  as: Tag = "span",
  style,
  multiLine = false,
}: {
  value: string;
  onEdit?: (v: string) => void;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  multiLine?: boolean;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const focused = React.useRef(false);

  React.useEffect(() => {
    if (ref.current && !focused.current) {
      ref.current.textContent = value;
    }
  }, [value]);

  if (!onEdit) return React.createElement(Tag, { className, style }, value);

  return React.createElement(Tag as any, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    className: `${className ?? ""} outline-none cursor-text hover:ring-1 hover:ring-cvo-orange/50 focus:ring-2 focus:ring-cvo-orange`,
    style,
    onFocus: () => { focused.current = true; },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      focused.current = false;
      const v = e.currentTarget.textContent ?? "";
      if (v !== value) onEdit(v);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!multiLine && e.key === "Enter") { e.preventDefault(); (e.currentTarget as HTMLElement).blur(); }
      if (e.key === "Escape") { (e.currentTarget as HTMLElement).blur(); }
    },
  });
}

// ── Helpers for array field updates ──
function h(c: MagazineContent, ed?: OnEdit) {
  const $ = (field: keyof MagazineContent) =>
    ed ? (v: string) => ed({ [field]: v } as any) : undefined;
  const $fi = (i: number) =>
    ed ? (v: string) => { const imgs = [...c.flashbackImages]; imgs[i] = v; ed({ flashbackImages: imgs }); } : undefined;
  const $cr = (i: number) => ({
    name: ed ? (v: string) => ed({ crew: c.crew.map((m, j) => j === i ? { ...m, name: v } : m) }) : undefined,
    avatar: ed ? (v: string) => ed({ crew: c.crew.map((m, j) => j === i ? { ...m, avatar: v } : m) }) : undefined,
  });
  const $ev = (i: number) => ({
    day: ed ? (v: string) => ed({ events: c.events.map((e, j) => j === i ? { ...e, day: v } : e) }) : undefined,
    month: ed ? (v: string) => ed({ events: c.events.map((e, j) => j === i ? { ...e, month: v } : e) }) : undefined,
    title: ed ? (v: string) => ed({ events: c.events.map((e, j) => j === i ? { ...e, title: v } : e) }) : undefined,
    detail: ed ? (v: string) => ed({ events: c.events.map((e, j) => j === i ? { ...e, detail: v } : e) }) : undefined,
  });
  const $sp = (i: number) => ({
    name: ed ? (v: string) => ed({ sponsors: c.sponsors.map((s, j) => j === i ? { ...s, name: v } : s) }) : undefined,
    logo: ed ? (v: string) => ed({ sponsors: c.sponsors.map((s, j) => j === i ? { ...s, logo: v } : s) }) : undefined,
  });
  return { $, $fi, $cr, $ev, $sp };
}

// ── Foto slot with optional click-to-upload ──
function FotoSlot({ label = "foto", className, src, onUpload, contain }: { label?: string; className?: string; src?: string; onUpload?: (v: string) => void; contain?: boolean }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inner = src
    ? <img src={src} alt={label} className={`w-full h-full ${contain ? "object-contain p-1" : "object-cover"}`} />
    : <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-[8px] font-bold uppercase tracking-widest text-gray-400 font-archivo">{label}</div>;

  if (!onUpload) {
    return <div className={cn("overflow-hidden", className)}>{inner}</div>;
  }
  return (
    <div className={cn("relative group cursor-pointer overflow-hidden", className)} onClick={() => inputRef.current?.click()}>
      {inner}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
        <span className="opacity-0 group-hover:opacity-100 bg-cvo-orange text-white text-[8px] font-bold uppercase px-2 py-1 font-archivo transition-opacity">{src ? "Wijzigen" : "Upload"}</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader(); r.onload = () => onUpload(r.result as string); r.readAsDataURL(f); e.target.value = "";
      }} />
    </div>
  );
}

// ── Crew avatar with optional upload ──
function CrewAvatar({ src, onUpload, bg = "bg-gray-100", border = "border-cvo-black" }: { src?: string; onUpload?: (v: string) => void; bg?: string; border?: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cn("relative group w-full aspect-square rounded-full overflow-hidden border-[2px] flex items-center justify-center", border, bg, onUpload ? "cursor-pointer" : "")}>
      {src ? <img src={src} className="w-full h-full object-cover" /> : <span className="text-[6px] text-gray-400 font-bold uppercase">foto</span>}
      {onUpload && (
        <>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center" onClick={() => inputRef.current?.click()}>
            <span className="opacity-0 group-hover:opacity-100 text-white text-[9px] font-bold transition-opacity">↑</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return;
            const r = new FileReader(); r.onload = () => onUpload(r.result as string); r.readAsDataURL(f); e.target.value = "";
          }} />
        </>
      )}
    </div>
  );
}

// ── Draggable + resizable CVO logo ──
function DraggableLogo({ content, onEdit }: { content: MagazineContent; onEdit?: OnEdit }) {
  const x    = content.logoX    ?? 50;
  const size = content.logoSize ?? 44;

  const startDrag = (e: React.MouseEvent) => {
    if (!onEdit) return;
    e.preventDefault();
    const mag = document.getElementById("magazine");
    const magWidth = mag?.getBoundingClientRect().width ?? 794;
    const startClientX = e.clientX;
    const startX = x;
    const onMove = (ev: MouseEvent) => {
      const deltaPct = ((ev.clientX - startClientX) / magWidth) * 100;
      onEdit({ logoX: Math.round(Math.min(95, Math.max(5, startX + deltaPct))) });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const startResize = (e: React.MouseEvent) => {
    if (!onEdit) return;
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startSize = size;
    const onMove = (ev: MouseEvent) => {
      // drag up = bigger, drag down = smaller
      const newSize = Math.round(Math.min(180, Math.max(20, startSize - (ev.clientY - startY) * 0.6)));
      onEdit({ logoSize: newSize });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div className="relative w-full select-none" style={{ height: size + 20 }}>
      <div
        className={onEdit ? "absolute top-2 cursor-grab active:cursor-grabbing" : "absolute top-2"}
        style={{ left: `${x}%`, transform: "translateX(-50%)" }}
        onMouseDown={startDrag}
        title={onEdit ? "Sleep om te verplaatsen" : undefined}
      >
        <div style={{ height: size }}>
          <CvoLogo className="h-full w-auto" />
        </div>
        {/* Resize handle — orange dot bottom-right of logo */}
        {onEdit && (
          <div
            onMouseDown={startResize}
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-cvo-orange rounded-full border-2 border-white cursor-ns-resize z-10 flex items-center justify-center"
            title="Sleep omhoog/omlaag om groter/kleiner te maken"
          >
            <span className="text-white text-[7px] leading-none font-bold select-none">↕</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Color schemes: maps logoColor option → CSS variable overrides for accent + secondary
const COLOR_SCHEMES: Record<string, Record<string, string>> = {
  Orange: { "--color-cvo-orange": "#F15B2B", "--color-cvo-mint": "#ACDCCE" },
  Black:  { "--color-cvo-orange": "#1a1a1a", "--color-cvo-mint": "#d4d4d4" },
  Green:  { "--color-cvo-orange": "#2a7d5a", "--color-cvo-mint": "#b8e0ca" },
  Gold:   { "--color-cvo-orange": "#b08030", "--color-cvo-mint": "#f5e0a0" },
};

const BLOCK_STYLES: Record<CustomBlock["style"], { bg: string; text: string; label: string }> = {
  black:  { bg: "bg-cvo-black",  text: "text-cvo-cream",  label: "Zwart" },
  orange: { bg: "bg-cvo-orange", text: "text-white",       label: "Accent" },
  mint:   { bg: "bg-cvo-mint",   text: "text-cvo-black",   label: "Mint" },
  cream:  { bg: "bg-cvo-cream",  text: "text-cvo-black",   label: "Licht" },
};

function CustomBlockView({
  block,
  onPatch,
  onEdit,
}: {
  block: CustomBlock;
  onPatch: (patch: Partial<CustomBlock>) => void;
  onEdit?: OnEdit;
}) {
  const [dragging, setDragging] = React.useState(false);
  const s = BLOCK_STYLES[block.style];

  const startResize = (e: React.MouseEvent) => {
    if (!onEdit) return;
    e.preventDefault();
    e.stopPropagation();
    const magazine = document.getElementById("magazine");
    const magWidth = magazine?.getBoundingClientRect().width ?? 794;
    const startX = e.clientX;
    const startPct = block.widthPct;
    setDragging(true);
    const onMove = (ev: MouseEvent) => {
      const deltaPct = ((ev.clientX - startX) / magWidth) * 100;
      const newPct = Math.min(100, Math.max(15, startPct + deltaPct));
      onPatch({ widthPct: Math.round(newPct * 2) / 2 }); // snap to 0.5%
    };
    const onUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className={`relative shrink-0 ${s.bg} ${s.text} overflow-hidden`}
      style={{ width: `${block.widthPct}%`, height: block.heightPx, borderRight: "1px solid rgba(0,0,0,0.08)" }}
    >
      {/* CONTENT BY TYPE */}
      {block.contentType === "image" && (
        <FotoSlot
          src={block.image}
          label="foto"
          onUpload={onEdit ? (v) => onPatch({ image: v }) : undefined}
          className="absolute inset-0 w-full h-full"
        />
      )}
      {block.contentType === "poster" && (
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <E
            value={block.headline}
            onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
            className="font-archivo-black uppercase leading-[0.88] text-[28px] break-words"
          />
        </div>
      )}
      {block.contentType === "text" && (
        <div className="absolute inset-0 flex flex-col justify-end p-3 gap-1.5">
          <E
            value={block.headline}
            onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
            className="font-archivo-black uppercase text-[15px] leading-[1.0]"
          />
          <E
            as="p"
            value={block.body}
            onEdit={onEdit ? (v) => onPatch({ body: v }) : undefined}
            className="font-archivo text-[8.5px] leading-[1.55] opacity-80"
            multiLine
          />
        </div>
      )}
      {block.contentType === "split" && (
        <div className="absolute inset-0 flex">
          <div className="w-[55%] h-full flex flex-col justify-end p-3 gap-1.5">
            <E
              value={block.headline}
              onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
              className="font-archivo-black uppercase text-[13px] leading-[1.0]"
            />
            <E
              as="p"
              value={block.body}
              onEdit={onEdit ? (v) => onPatch({ body: v }) : undefined}
              className="font-archivo text-[8px] leading-[1.55] opacity-80"
              multiLine
            />
          </div>
          <div className="w-[45%] h-full">
            <FotoSlot
              src={block.image}
              label="foto"
              onUpload={onEdit ? (v) => onPatch({ image: v }) : undefined}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* DRAG HANDLE — right edge, only in edit mode */}
      {onEdit && (
        <div
          onMouseDown={startResize}
          className="absolute right-0 top-0 bottom-0 w-2.5 z-20 cursor-ew-resize flex items-center justify-center select-none group"
          style={{ background: dragging ? "rgba(241,91,43,0.55)" : "transparent" }}
          title="Sleep om breedte aan te passen"
        >
          <div
            className="w-[2px] h-10 rounded-full transition-colors"
            style={{ background: dragging ? "white" : "rgba(241,91,43,0)" }}
          />
          {/* Hover glow */}
          <style>{`.group:hover > div { background: rgba(241,91,43,0.9) !important; }`}</style>
        </div>
      )}
    </div>
  );
}

function renderCustom(content: MagazineContent, onEdit?: OnEdit) {
  const patchBlock = (idx: number, patch: Partial<CustomBlock>) => {
    if (!onEdit) return;
    const newBlocks = content.customBlocks.map((b, i) => i === idx ? { ...b, ...patch } : b);
    onEdit({ customBlocks: newBlocks });
  };

  if (!content.customBlocks || content.customBlocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-300 select-none">
        <div className="text-6xl font-archivo-black leading-none">+</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-archivo">Voeg kaartjes toe in de editor</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      {content.customBlocks.map((block, idx) => (
        <CustomBlockView
          key={block.id}
          block={block}
          onPatch={(patch) => patchBlock(idx, patch)}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default function MagazinePreview({ content, onEdit }: { content: MagazineContent; onEdit?: OnEdit }) {
  const scheme = COLOR_SCHEMES[content.logoColor] ?? COLOR_SCHEMES.Orange;
  const atTop = content.logoPosition === "Top";

  return (
    <div
      id="magazine"
      className="w-full max-w-[794px] mx-auto bg-cvo-cream border-[3px] border-cvo-black flex flex-col font-archivo overflow-hidden"
      style={{ boxShadow: "6px 6px 0 #1a1a1a", ...scheme } as React.CSSProperties}
    >
      {/* ── LOGO TOP (optional) ── */}
      {atTop && (
        <div className="border-b-[3px] border-cvo-black overflow-hidden">
          <DraggableLogo content={content} onEdit={onEdit} />
        </div>
      )}

      {/* ── MASTHEAD ── */}
      <header className="border-b-[3px] border-cvo-black">
        <div className="px-5 pt-3 pb-2">
          <div className="flex justify-between items-end gap-2">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.1em] leading-[1.9] text-cvo-black font-archivo shrink-0">
              Editie <E value={content.edition} onEdit={onEdit ? v => onEdit({ edition: v }) : undefined} /><br />
              <E value={content.month} onEdit={onEdit ? v => onEdit({ month: v }) : undefined} />{" "}
              <E value={content.year} onEdit={onEdit ? v => onEdit({ year: v }) : undefined} />
            </div>
            <div className="text-[66px] leading-[0.85] font-archivo-black tracking-[-0.02em] text-cvo-black text-center flex-1 px-2 uppercase">
              CLUB<span style={{ color: "var(--color-cvo-orange)", WebkitTextStroke: "1.5px #1a1a1a", textTransform: "none" }}>van</span>ONS
            </div>
            <div className="text-right text-[9.5px] font-bold uppercase tracking-[0.1em] leading-[1.9] text-cvo-black font-archivo shrink-0">
              Gratis<br /><E value={content.city} onEdit={onEdit ? v => onEdit({ city: v }) : undefined} />
            </div>
          </div>
        </div>
        <div className="bg-cvo-black text-cvo-cream px-5 py-[5px] flex justify-between items-center text-[8.5px] font-bold uppercase tracking-[0.2em] font-archivo">
          <span>Het blad van de buurt</span>
          <E value={content.bannerText} onEdit={onEdit ? v => onEdit({ bannerText: v }) : undefined} className="opacity-55" />
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="flex-1">
        {content.template === "Standard" && renderStandard(content, onEdit)}
        {content.template === "Collage" && renderCollage(content, onEdit)}
        {content.template === "Brutalist" && renderBrutalist(content, onEdit)}
        {content.template === "Street" && renderStreet(content, onEdit)}
        {content.template === "Feature" && renderFeature(content, onEdit)}
        {content.template === "Minimalist" && renderMinimalist(content, onEdit)}
        {content.template === "Custom" && renderCustom(content, onEdit)}
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t-[3px] border-cvo-black">
        {!atTop && (
          <div className="overflow-hidden">
            <DraggableLogo content={content} onEdit={onEdit} />
          </div>
        )}
        {(content.companyDescription || onEdit) && (
          <div className="px-6 pb-3 pt-0 text-center border-b-[2px] border-cvo-black">
            <E
              as="p"
              value={content.companyDescription}
              onEdit={onEdit ? v => onEdit({ companyDescription: v }) : undefined}
              className="text-[10px] font-archivo text-gray-500 leading-[1.7] max-w-[460px] mx-auto"
              multiLine
            />
          </div>
        )}
        <div className="flex border-b-[2px] border-cvo-black overflow-hidden">
          <div className="bg-cvo-black text-cvo-cream px-3 flex items-center justify-center shrink-0">
            <span
              className="text-[7.5px] font-bold uppercase tracking-[0.2em] font-archivo"
              style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
            >
              Supported by
            </span>
          </div>
          <div className="flex-1 grid grid-cols-4 divide-x-[2px] divide-cvo-black">
            {Array.from({ length: 4 }).map((_, i) => {
              const s = content.sponsors[i];
              const sp = h(content, onEdit).$sp(i);
              return (
                <div key={i} className="flex flex-col items-center justify-center gap-1 py-3 px-2">
                  <div className="w-full h-9 bg-white rounded flex items-center justify-center">
                    <FotoSlot
                      src={s?.logo}
                      label="logo"
                      onUpload={sp.logo}
                      className="w-full h-full"
                      contain
                    />
                  </div>
                  <E
                    value={s?.name || `Stakeholder ${i + 1}`}
                    onEdit={sp.name}
                    className="text-[7.5px] font-bold uppercase tracking-[0.08em] text-gray-500 text-center font-archivo leading-tight"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between items-center px-5 py-2 text-[8.5px] font-bold uppercase tracking-[0.1em] text-gray-400 font-archivo">
          <span>
            CLUB<span style={{ color: "var(--color-cvo-orange)", textTransform: "none" }}>van</span>ONS
            {" — Urban Living Lab Breda"}
          </span>
          <span>Editie {content.edition} — {content.year}</span>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════
//  STANDARD TEMPLATE
// ════════════════════════════════════════
function renderStandard(content: MagazineContent, ed?: OnEdit) {
  const { $, $fi, $cr, $ev } = h(content, ed);
  return (
    <>
      {/* ── ROW 1: Meet the Crew | Terugblik ── */}
      <div className="flex border-b-[2px] border-cvo-black">

        {/* Meet the Crew */}
        <section className="w-[41%] shrink-0 border-r-[2px] border-cvo-black px-4 py-4">
          <span className="text-[7.5px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-2 block font-archivo">Wie zijn wij</span>
          <h2 className="font-archivo-black text-[34px] leading-[0.88] uppercase text-cvo-black mb-3">
            Meet The<br /><span className="bg-cvo-orange text-cvo-cream px-[6px]">Crew</span>
          </h2>
          <div className="flex gap-[6px] mb-3">
            {content.crew.slice(0, 5).map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-[4px] flex-1 min-w-0">
                <CrewAvatar src={m.avatar} onUpload={$cr(i).avatar} />
                <E value={m.name} onEdit={$cr(i).name} className="text-[7px] font-bold uppercase tracking-tight text-cvo-black text-center font-archivo leading-[1.2] w-full truncate" />
              </div>
            ))}
          </div>
          <E value={content.crewTeaser} onEdit={$("crewTeaser")} as="p" className="text-[10px] leading-[1.65] font-archivo text-gray-700" multiLine />
        </section>

        {/* Terugblik */}
        <section className="flex-1 min-w-0 px-4 py-4">
          <span className="text-[7.5px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-2 block font-archivo">Terugblik</span>
          <E value={content.flashbackHeadline} onEdit={$("flashbackHeadline")} as="h2" className="font-archivo-black text-[34px] leading-[0.88] uppercase text-cvo-black mb-3" />
          <div className="grid grid-cols-3 gap-[6px] mb-2">
            {[0, 1, 2].map((i) => (
              <FotoSlot key={i} src={content.flashbackImages[i]} label={`foto ${i + 1}`} className="aspect-[4/3]" onUpload={$fi(i)} />
            ))}
          </div>
          <p className="text-[9px] italic text-gray-400 mb-2 font-archivo">Interventies uit de afgelopen maanden</p>
          <E value={content.flashbackBody} onEdit={$("flashbackBody")} as="p" className="text-[10px] leading-[1.65] font-archivo text-gray-700" multiLine />
        </section>
      </div>

      {/* ── ROW 2: Main Feature ── */}
      <section className="border-b-[2px] border-cvo-black">
        <div className="grid grid-cols-[3fr_2fr]">
          <div className="px-4 py-4 border-r-[2px] border-cvo-black">
            <span className="text-[7.5px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-2 block font-archivo">Op straat</span>
            <E value={content.mainFeatureHeadline} onEdit={$("mainFeatureHeadline")} as="h2" className="font-archivo-black text-[44px] leading-[0.88] uppercase text-cvo-black mb-3" />
            <E value={content.mainFeatureBody} onEdit={$("mainFeatureBody")} as="p" className="text-[10.5px] leading-[1.7] font-archivo text-gray-700" multiLine />
          </div>
          <FotoSlot src={content.mainFeatureImage} label="hoofdfoto" className="w-full min-h-[180px]" onUpload={$("mainFeatureImage")} />
        </div>
      </section>

      {/* ── ROW 3: Buurtpost | Join Ons | Pak de Mic ── */}
      <div className="grid grid-cols-[1fr_2fr_1.5fr]">
        {/* Buurtpost */}
        <section className="bg-cvo-mint border-r-[2px] border-cvo-black px-3 py-4 flex flex-col">
          <span className="inline-block bg-cvo-black text-cvo-mint text-[7px] font-bold uppercase tracking-[0.2em] px-2 py-[2px] mb-2 font-archivo self-start">Buurtpost</span>
          <E value={content.buurtpostHeadline} onEdit={$("buurtpostHeadline")} as="h3" className="font-archivo-black text-[24px] leading-[0.9] uppercase text-cvo-black mb-3" />
          <FotoSlot src={content.buurtpostImage} label="foto wijk" className="w-full aspect-square mb-3 flex-shrink-0" onUpload={$("buurtpostImage")} />
          <E value={content.buurtpostBody} onEdit={$("buurtpostBody")} as="p" className="text-[9.5px] leading-[1.6] font-archivo text-cvo-black flex-1" multiLine />
        </section>

        {/* Join Ons */}
        <section className="bg-cvo-orange border-r-[2px] border-cvo-black flex flex-col">
          <div className="bg-cvo-black px-4 py-[6px] flex justify-between items-center">
            <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-cvo-orange font-archivo">De Nights — Agenda</span>
            <span className="text-cvo-cream text-[11px] font-archivo-black tracking-tight">↓ See you there</span>
          </div>
          <div className="px-4 py-3 flex-1 flex flex-col">
            <h2 className="font-archivo-black text-[80px] leading-[0.82] uppercase text-cvo-black mb-4 tracking-[-0.02em]">
              Join<br /><span className="text-cvo-cream" style={{ WebkitTextStroke: "2px #1a1a1a" }}>Ons</span>
            </h2>
            <div className="flex flex-col gap-2 flex-1">
              {content.events.map((ev, i) => (
                <div key={i} className="flex items-stretch bg-cvo-cream border-[2px] border-cvo-black" style={{ boxShadow: "3px 3px 0 #1a1a1a" }}>
                  <div className="bg-cvo-black text-cvo-orange flex flex-col items-center justify-center px-3 py-2 min-w-[50px] shrink-0">
                    <E value={ev.day} onEdit={$ev(i).day} className="font-archivo-black text-[20px] leading-none" />
                    <E value={ev.month} onEdit={$ev(i).month} className="text-[7px] font-bold uppercase tracking-[0.08em] text-cvo-cream font-archivo" />
                  </div>
                  <div className="flex-1 px-3 py-2 min-w-0">
                    <E value={ev.title} onEdit={$ev(i).title} className="text-[11px] font-bold uppercase tracking-[0.03em] text-cvo-black font-archivo block truncate" />
                    <E value={ev.detail} onEdit={$ev(i).detail} className="text-[9px] text-gray-600 font-archivo truncate block" />
                  </div>
                  <div className="flex items-center pr-3 shrink-0">
                    <span className="bg-cvo-orange text-cvo-black text-[7.5px] font-bold uppercase tracking-[0.1em] px-2 py-[4px] border-[2px] border-cvo-black font-archivo">Free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pak de Mic */}
        <section className="bg-cvo-black px-4 py-4 flex flex-col">
          <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-2 block font-archivo">Jij aan het woord</span>
          <h2 className="font-archivo-black text-[46px] leading-[0.88] uppercase text-cvo-cream mb-1">Pak<br />De<br /><span className="text-cvo-orange">Mic</span></h2>
          <span className="block mb-3 text-cvo-orange text-[13px] font-archivo" style={{ fontStyle: "italic" }}>Jij bent de wijk.</span>
          <E value={content.pakDeMicText} onEdit={$("pakDeMicText")} as="p" className="text-[9.5px] leading-[1.65] text-gray-400 font-archivo flex-1" multiLine />
          <span className="inline-block mt-3 bg-cvo-orange text-cvo-black text-[8px] font-bold uppercase tracking-[0.14em] px-3 py-[5px] border-[2px] border-cvo-orange font-archivo self-start">→ Stuur je bericht in</span>
        </section>
      </div>
    </>
  );
}

// ════════════════════════════════════════
//  SHARED BOTTOM ROW (used by multiple templates)
// ════════════════════════════════════════
function BottomRow({ content, buurtBg = "bg-cvo-mint", onEdit }: { content: MagazineContent; buurtBg?: string; onEdit?: OnEdit }) {
  const { $, $ev } = h(content, onEdit);
  return (
    <div className="grid grid-cols-[1fr_2fr_1.5fr]">
      {/* Buurtpost */}
      <section className={`${buurtBg} border-r-[2px] border-cvo-black px-3 py-4 flex flex-col`}>
        <span className="inline-block bg-cvo-black text-cvo-mint text-[7px] font-bold uppercase tracking-[0.2em] px-2 py-[2px] mb-2 font-archivo self-start">Buurtpost</span>
        <E value={content.buurtpostHeadline} onEdit={$("buurtpostHeadline")} as="h3" className="font-archivo-black text-[22px] leading-[0.9] uppercase text-cvo-black mb-3" />
        <FotoSlot src={content.buurtpostImage} label="foto wijk" className="w-full aspect-square mb-2 flex-shrink-0" onUpload={$("buurtpostImage")} />
        <E value={content.buurtpostBody} onEdit={$("buurtpostBody")} as="p" className="text-[9px] leading-[1.6] font-archivo text-cvo-black flex-1" multiLine />
      </section>
      {/* Join Ons */}
      <section className="bg-cvo-orange border-r-[2px] border-cvo-black flex flex-col">
        <div className="bg-cvo-black px-4 py-[6px] flex justify-between items-center">
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-cvo-orange font-archivo">De Nights — Agenda</span>
          <span className="text-cvo-cream text-[11px] font-archivo-black tracking-tight">↓ See you there</span>
        </div>
        <div className="px-4 py-3 flex-1 flex flex-col">
          <h2 className="font-archivo-black text-[80px] leading-[0.82] uppercase text-cvo-black mb-4 tracking-[-0.02em]">
            Join<br /><span className="text-cvo-cream" style={{ WebkitTextStroke: "2px #1a1a1a" }}>Ons</span>
          </h2>
          <div className="flex flex-col gap-2 flex-1">
            {content.events.map((ev, i) => (
              <div key={i} className="flex items-stretch bg-cvo-cream border-[2px] border-cvo-black" style={{ boxShadow: "3px 3px 0 #1a1a1a" }}>
                <div className="bg-cvo-black text-cvo-orange flex flex-col items-center justify-center px-3 py-2 min-w-[50px] shrink-0">
                  <E value={ev.day} onEdit={$ev(i).day} className="font-archivo-black text-[20px] leading-none" />
                  <E value={ev.month} onEdit={$ev(i).month} className="text-[7px] font-bold uppercase text-cvo-cream font-archivo" />
                </div>
                <div className="flex-1 px-3 py-2 min-w-0">
                  <E value={ev.title} onEdit={$ev(i).title} className="text-[11px] font-bold uppercase text-cvo-black font-archivo block truncate" />
                  <E value={ev.detail} onEdit={$ev(i).detail} className="text-[9px] text-gray-500 font-archivo truncate block" />
                </div>
                <div className="flex items-center pr-3 shrink-0">
                  <span className="bg-cvo-orange text-cvo-black text-[7.5px] font-bold uppercase tracking-[0.1em] px-2 py-[4px] border-[2px] border-cvo-black font-archivo">Free</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pak de Mic */}
      <section className="bg-cvo-black px-4 py-4 flex flex-col">
        <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-2 block font-archivo">Jij aan het woord</span>
        <h2 className="font-archivo-black text-[46px] leading-[0.88] uppercase text-cvo-cream mb-1">Pak<br />De<br /><span className="text-cvo-orange">Mic</span></h2>
        <span className="block mb-3 text-cvo-orange text-[13px] font-archivo" style={{ fontStyle: "italic" }}>Jij bent de wijk.</span>
        <E value={content.pakDeMicText} onEdit={$("pakDeMicText")} as="p" className="text-[9.5px] leading-[1.65] text-gray-400 font-archivo flex-1" multiLine />
        <span className="inline-block mt-3 bg-cvo-orange text-cvo-black text-[8px] font-bold uppercase tracking-[0.14em] px-3 py-[5px] border-[2px] border-cvo-orange font-archivo self-start">→ Stuur je bericht in</span>
      </section>
    </div>
  );
}

// ════════════════════════════════════════
//  COLLAGE — overlappende kaarten op zwart canvas
// ════════════════════════════════════════
function renderCollage(content: MagazineContent, ed?: OnEdit) {
  const { $, $fi, $cr, $ev } = h(content, ed);
  return (
    <div className="bg-cvo-black">
      <div className="relative overflow-hidden" style={{ height: 370 }}>
        {/* Card 1: Crew */}
        <div className="absolute top-5 left-5 w-[250px] bg-cvo-orange border-[3px] border-cvo-black p-4 z-20" style={{ transform: "rotate(-2.5deg)", boxShadow: "6px 6px 0 rgba(255,255,255,0.15)" }}>
          <span className="text-[7px] font-bold uppercase tracking-widest text-cvo-black mb-1 block font-archivo">Wie zijn wij</span>
          <h2 className="font-archivo-black text-[26px] leading-[0.88] uppercase text-cvo-black mb-2">Meet The Crew</h2>
          <div className="flex gap-1 mb-2">
            {content.crew.slice(0, 5).map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-[3px]">
                <CrewAvatar src={m.avatar} onUpload={$cr(i).avatar} bg="bg-orange-100" border="border-cvo-black" />
                <E value={m.name} onEdit={$cr(i).name} className="text-[5.5px] font-bold uppercase text-cvo-black truncate w-full text-center font-archivo" />
              </div>
            ))}
          </div>
          <E value={content.crewTeaser} onEdit={$("crewTeaser")} as="p" className="text-[8.5px] leading-[1.5] font-archivo text-cvo-black" multiLine />
        </div>
        {/* Card 2: Terugblik */}
        <div className="absolute top-8 right-5 w-[310px] bg-cvo-cream border-[3px] border-cvo-black p-4 z-10" style={{ transform: "rotate(2deg)", boxShadow: "6px 6px 0 #1a1a1a" }}>
          <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400 mb-1 block font-archivo">Terugblik</span>
          <E value={content.flashbackHeadline} onEdit={$("flashbackHeadline")} as="h2" className="font-archivo-black text-[22px] leading-[0.88] uppercase text-cvo-black mb-2" />
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[0, 1, 2].map((i) => <FotoSlot key={i} src={content.flashbackImages[i]} label={`foto ${i + 1}`} className="aspect-[4/3]" onUpload={$fi(i)} />)}
          </div>
          <E value={content.flashbackBody} onEdit={$("flashbackBody")} as="p" className="text-[8.5px] leading-[1.5] font-archivo text-gray-700" multiLine />
        </div>
        {/* Card 3: Hoofdartikel */}
        <div className="absolute bottom-4 left-[22%] w-[340px] bg-cvo-black text-cvo-cream border-[3px] border-cvo-orange p-4 z-30" style={{ transform: "rotate(-1deg)", boxShadow: "6px 6px 0 var(--cvo-orange)" }}>
          <span className="text-[7px] font-bold uppercase tracking-widest text-cvo-orange mb-1 block font-archivo">Op straat</span>
          <E value={content.mainFeatureHeadline} onEdit={$("mainFeatureHeadline")} as="h2" className="font-archivo-black text-[32px] leading-[0.88] uppercase text-cvo-cream mb-2" />
          <E value={content.mainFeatureBody} onEdit={$("mainFeatureBody")} as="p" className="text-[9px] leading-[1.5] font-archivo text-gray-400" multiLine />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1.8fr_1.3fr] border-t-[3px] border-cvo-orange">
        <div className="border-r-[2px] border-gray-800 px-4 py-4 flex flex-col">
          <span className="text-[7px] font-bold uppercase tracking-widest text-cvo-orange mb-1 block font-archivo">Buurtpost</span>
          <E value={content.buurtpostHeadline} onEdit={$("buurtpostHeadline")} as="h3" className="font-archivo-black text-[22px] leading-[0.9] uppercase text-cvo-cream mb-2" />
          <FotoSlot src={content.buurtpostImage} label="foto wijk" className="w-full aspect-square mb-2" onUpload={$("buurtpostImage")} />
          <E value={content.buurtpostBody} onEdit={$("buurtpostBody")} as="p" className="text-[8.5px] leading-[1.5] font-archivo text-gray-400 flex-1" multiLine />
        </div>
        <div className="border-r-[2px] border-gray-800 px-4 py-4 flex flex-col">
          <h2 className="font-archivo-black text-[64px] leading-[0.82] uppercase text-cvo-orange mb-3 tracking-[-0.02em]">
            Join<br /><span className="text-cvo-cream" style={{ WebkitTextStroke: "1.5px var(--cvo-orange)" }}>Ons</span>
          </h2>
          <div className="space-y-2 flex-1">
            {content.events.map((ev, i) => (
              <div key={i} className="flex items-center gap-2 border-[1.5px] border-gray-700 py-2 px-3">
                <div className="shrink-0">
                  <E value={ev.day} onEdit={$ev(i).day} className="font-archivo-black text-[20px] leading-none text-cvo-orange block" />
                  <E value={ev.month} onEdit={$ev(i).month} className="text-[7px] font-bold uppercase text-gray-500 font-archivo" />
                </div>
                <div className="flex-1 min-w-0">
                  <E value={ev.title} onEdit={$ev(i).title} className="text-[10px] font-bold text-cvo-cream block truncate font-archivo" />
                  <E value={ev.detail} onEdit={$ev(i).detail} className="text-[8px] text-gray-500 truncate block font-archivo" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-4 flex flex-col">
          <span className="text-[7px] font-bold uppercase tracking-widest text-gray-600 mb-2 block font-archivo">Jij aan het woord</span>
          <h2 className="font-archivo-black text-[32px] leading-[0.88] uppercase text-cvo-cream mb-1">Pak De<br /><span className="text-cvo-orange">Mic</span></h2>
          <span className="text-cvo-orange text-[11px] italic font-archivo block mb-2">Jij bent de wijk.</span>
          <E value={content.pakDeMicText} onEdit={$("pakDeMicText")} as="p" className="text-[8.5px] leading-[1.5] font-archivo text-gray-400 flex-1" multiLine />
          <span className="inline-block mt-2 border-[2px] border-cvo-orange text-cvo-orange text-[8px] font-bold uppercase tracking-[0.12em] px-3 py-[5px] font-archivo self-start">→ Stuur in</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
//  BRUTALIST — rauw, maximale typografie, stark contrast
// ════════════════════════════════════════
function renderBrutalist(content: MagazineContent, ed?: OnEdit) {
  const { $, $fi, $cr } = h(content, ed);
  return (
    <div>
      <div className="bg-cvo-black px-5 py-5 border-b-[4px] border-cvo-orange">
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-cvo-orange block mb-1 font-archivo">Op straat</span>
        <E value={content.mainFeatureHeadline} onEdit={$("mainFeatureHeadline")} as="h1" className="font-archivo-black text-[76px] leading-[0.8] uppercase text-cvo-cream tracking-[-0.02em]" />
      </div>
      <div className="grid grid-cols-[1fr_2fr] border-b-[4px] border-cvo-black">
        <div className="bg-cvo-orange px-5 py-4 border-r-[4px] border-cvo-black">
          <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-cvo-black block mb-3 font-archivo">Wie zijn wij</span>
          <div className="space-y-2 mb-3">
            {content.crew.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 shrink-0"><CrewAvatar src={m.avatar} onUpload={$cr(i).avatar} bg="bg-orange-100" border="border-cvo-black" /></div>
                <E value={m.name} onEdit={$cr(i).name} className="font-archivo-black text-[22px] leading-none uppercase text-cvo-black tracking-tight" />
              </div>
            ))}
          </div>
          <div className="h-[2px] bg-cvo-black mb-3" />
          <E value={content.crewTeaser} onEdit={$("crewTeaser")} as="p" className="text-[9px] leading-[1.5] font-archivo text-cvo-black" multiLine />
        </div>
        <div className="px-5 py-4 bg-cvo-cream">
          <E value={content.mainFeatureBody} onEdit={$("mainFeatureBody")} as="p" className="text-[14px] font-bold leading-[1.4] font-archivo text-cvo-black border-l-[6px] border-cvo-black pl-4 mb-4" multiLine />
          <div className="border-t-[2px] border-cvo-black pt-4">
            <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-1 font-archivo">Terugblik</span>
            <E value={content.flashbackHeadline} onEdit={$("flashbackHeadline")} as="h3" className="font-archivo-black text-[26px] leading-[0.88] uppercase text-cvo-black mb-3" />
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[0, 1, 2].map((i) => <FotoSlot key={i} src={content.flashbackImages[i]} label={`foto ${i + 1}`} className="aspect-[4/3]" onUpload={$fi(i)} />)}
            </div>
            <E value={content.flashbackBody} onEdit={$("flashbackBody")} as="p" className="text-[9.5px] leading-[1.6] font-archivo text-gray-600" multiLine />
          </div>
        </div>
      </div>
      <BottomRow content={content} onEdit={ed} />
    </div>
  );
}

// ════════════════════════════════════════
//  STREET — urban energie, diagonalen, beweging
// ════════════════════════════════════════
function renderStreet(content: MagazineContent, ed?: OnEdit) {
  const { $, $fi, $cr } = h(content, ed);
  return (
    <div>
      <div className="bg-cvo-orange border-b-[3px] border-cvo-black px-5 py-4 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-cvo-black opacity-10 rounded-full" />
        <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-cvo-black block mb-2 font-archivo">Wie zijn wij</span>
        <div className="flex gap-4 items-start">
          <h2 className="font-archivo-black text-[38px] leading-[0.88] uppercase text-cvo-black shrink-0">Meet<br />The<br />Crew</h2>
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-2">
              {content.crew.slice(0, 5).map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <CrewAvatar src={m.avatar} onUpload={$cr(i).avatar} bg="bg-orange-100" border="border-cvo-black" />
                  <E value={m.name} onEdit={$cr(i).name} className="text-[6.5px] font-bold uppercase text-cvo-black truncate w-full text-center font-archivo" />
                </div>
              ))}
            </div>
            <E value={content.crewTeaser} onEdit={$("crewTeaser")} as="p" className="text-[10px] leading-[1.6] font-archivo text-cvo-black" multiLine />
          </div>
        </div>
      </div>
      <div className="bg-cvo-black border-b-[3px] border-cvo-black px-5 py-4">
        <div className="flex gap-5 items-start">
          <div className="shrink-0">
            <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-500 block mb-1 font-archivo">Terugblik</span>
            <E value={content.flashbackHeadline} onEdit={$("flashbackHeadline")} as="h2" className="font-archivo-black text-[30px] leading-[0.88] uppercase text-cvo-cream" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[0, 1, 2].map((i) => <FotoSlot key={i} src={content.flashbackImages[i]} label={`foto ${i + 1}`} className="aspect-[4/3]" onUpload={$fi(i)} />)}
            </div>
            <E value={content.flashbackBody} onEdit={$("flashbackBody")} as="p" className="text-[9.5px] leading-[1.5] font-archivo text-gray-400" multiLine />
          </div>
        </div>
      </div>
      <div className="border-b-[3px] border-cvo-black">
        <div className="grid grid-cols-[3fr_2fr]">
          <div className="px-5 py-4 border-r-[2px] border-cvo-black">
            <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-2 font-archivo">Op straat</span>
            <div className="inline-block bg-cvo-orange px-3 py-1 mb-3" style={{ transform: "skew(-6deg)" }}>
              <E value={content.mainFeatureHeadline} onEdit={$("mainFeatureHeadline")} as="h2" className="font-archivo-black text-[38px] leading-[0.88] uppercase text-cvo-black" style={{ transform: "skew(6deg)", display: "block" }} />
            </div>
            <E value={content.mainFeatureBody} onEdit={$("mainFeatureBody")} as="p" className="text-[10.5px] leading-[1.7] font-archivo text-gray-700 mt-1" multiLine />
          </div>
          <FotoSlot src={content.mainFeatureImage} label="hoofdfoto" className="w-full min-h-[160px]" onUpload={$("mainFeatureImage")} />
        </div>
      </div>
      <BottomRow content={content} onEdit={ed} />
    </div>
  );
}

// ════════════════════════════════════════
//  FEATURE — editorial magazine spread
// ════════════════════════════════════════
function renderFeature(content: MagazineContent, ed?: OnEdit) {
  const { $, $fi, $cr } = h(content, ed);
  return (
    <div>
      <div className="grid grid-cols-[1.6fr_1fr] border-b-[3px] border-cvo-black">
        <div className="relative overflow-hidden cursor-pointer" style={{ minHeight: 240 }} onClick={() => ed && document.getElementById("feature-hero-upload")?.click()}>
          {content.mainFeatureImage
            ? <img src={content.mainFeatureImage} className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold uppercase font-archivo">hoofdfoto</div>
          }
          {ed && (
            <>
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="opacity-0 hover:opacity-100 bg-cvo-orange text-white text-[9px] font-bold uppercase px-2 py-1 font-archivo transition-opacity">{content.mainFeatureImage ? "Foto wijzigen" : "Foto uploaden"}</span>
              </div>
              <input id="feature-hero-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader(); r.onload = () => ed({ mainFeatureImage: r.result as string }); r.readAsDataURL(f); e.target.value = "";
              }} />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
            <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-cvo-orange block mb-1 font-archivo">Op straat</span>
            <E value={content.mainFeatureHeadline} onEdit={$("mainFeatureHeadline")} as="h2" className="font-archivo-black text-[42px] leading-[0.88] uppercase text-cvo-cream pointer-events-auto" />
          </div>
        </div>
        <div className="border-l-[3px] border-cvo-black px-4 py-4 bg-cvo-cream flex flex-col">
          <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-2 font-archivo">Wie zijn wij</span>
          <h3 className="font-archivo-black text-[20px] leading-[0.88] uppercase text-cvo-black mb-3">Meet The Crew</h3>
          <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
            {content.crew.slice(0, 4).map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-9 h-9 shrink-0"><CrewAvatar src={m.avatar} onUpload={$cr(i).avatar} /></div>
                <E value={m.name} onEdit={$cr(i).name} className="text-[9px] font-bold uppercase text-cvo-black font-archivo leading-tight" />
              </div>
            ))}
            {content.crew[4] && (
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-9 h-9 shrink-0"><CrewAvatar src={content.crew[4].avatar} onUpload={$cr(4).avatar} /></div>
                <E value={content.crew[4].name} onEdit={$cr(4).name} className="text-[9px] font-bold uppercase text-cvo-black font-archivo" />
              </div>
            )}
          </div>
          <E value={content.crewTeaser} onEdit={$("crewTeaser")} as="p" className="text-[9px] leading-[1.55] font-archivo text-gray-600" multiLine />
        </div>
      </div>
      <div className="grid grid-cols-[3fr_2fr] border-b-[3px] border-cvo-black">
        <div className="px-5 py-4 border-r-[2px] border-cvo-black">
          <E value={content.mainFeatureBody} onEdit={$("mainFeatureBody")} as="p" className="text-[13px] font-bold leading-[1.5] font-archivo text-cvo-black border-l-[4px] border-cvo-orange pl-4" multiLine />
        </div>
        <div className="px-4 py-4">
          <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-1 font-archivo">Terugblik</span>
          <E value={content.flashbackHeadline} onEdit={$("flashbackHeadline")} as="h3" className="font-archivo-black text-[20px] leading-[0.88] uppercase text-cvo-black mb-2" />
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[0, 1, 2].map((i) => <FotoSlot key={i} src={content.flashbackImages[i]} label={`foto ${i + 1}`} className="aspect-[4/3]" onUpload={$fi(i)} />)}
          </div>
          <E value={content.flashbackBody} onEdit={$("flashbackBody")} as="p" className="text-[9px] leading-[1.5] font-archivo text-gray-600" multiLine />
        </div>
      </div>
      <BottomRow content={content} onEdit={ed} />
    </div>
  );
}

// ════════════════════════════════════════
//  MINIMALIST — clean, refined, Japans-geïnspireerd
// ════════════════════════════════════════
function renderMinimalist(content: MagazineContent, ed?: OnEdit) {
  const { $, $fi, $cr, $ev } = h(content, ed);
  return (
    <div className="px-8 py-5 bg-cvo-cream">
      <div className="mb-4">
        <span className="text-[7.5px] font-bold uppercase tracking-[0.3em] text-cvo-orange block mb-1 font-archivo">Op straat</span>
        <div className="h-[2px] bg-cvo-black mb-3" />
        <E value={content.mainFeatureHeadline} onEdit={$("mainFeatureHeadline")} as="h1" className="font-archivo-black text-[54px] leading-[0.85] uppercase text-cvo-black tracking-[-0.01em]" />
      </div>
      <div className="h-[1px] bg-gray-200 my-4" />
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <span className="text-[7px] uppercase font-bold text-gray-400 block mb-2 tracking-[0.2em] font-archivo pb-1 border-b border-gray-200">Wie zijn wij</span>
          <div className="space-y-1.5 mb-2">
            {content.crew.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 shrink-0"><CrewAvatar src={m.avatar} onUpload={$cr(i).avatar} bg="bg-gray-50" border="border-gray-200" /></div>
                <E value={m.name} onEdit={$cr(i).name} className="text-[10px] font-bold uppercase font-archivo text-cvo-black" />
              </div>
            ))}
          </div>
          <E value={content.crewTeaser} onEdit={$("crewTeaser")} as="p" className="text-[9px] leading-[1.6] font-archivo text-gray-500" multiLine />
        </div>
        <div>
          <span className="text-[7px] uppercase font-bold text-gray-400 block mb-2 tracking-[0.2em] font-archivo pb-1 border-b border-gray-200">Verhaal</span>
          <E value={content.mainFeatureBody} onEdit={$("mainFeatureBody")} as="p" className="text-[12px] font-bold leading-[1.4] font-archivo text-cvo-black" multiLine />
        </div>
        <div>
          <span className="text-[7px] uppercase font-bold text-gray-400 block mb-2 tracking-[0.2em] font-archivo pb-1 border-b border-gray-200">Terugblik</span>
          <E value={content.flashbackHeadline} onEdit={$("flashbackHeadline")} className="font-archivo-black text-[16px] leading-[0.9] uppercase text-cvo-black mb-2 block" />
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[0, 1, 2].map((i) => <FotoSlot key={i} src={content.flashbackImages[i]} label="" className="aspect-square" onUpload={$fi(i)} />)}
          </div>
          <E value={content.flashbackBody} onEdit={$("flashbackBody")} as="p" className="text-[9px] leading-[1.6] font-archivo text-gray-500" multiLine />
        </div>
      </div>
      <div className="h-[1px] bg-gray-200 mb-4" />
      <div className="grid grid-cols-3 gap-6">
        <div>
          <span className="text-[7px] uppercase font-bold text-gray-400 block mb-2 tracking-[0.2em] font-archivo pb-1 border-b border-gray-200">Buurtpost</span>
          <E value={content.buurtpostHeadline} onEdit={$("buurtpostHeadline")} className="font-archivo-black text-[16px] leading-[0.9] uppercase text-cvo-black mb-2 block" />
          <FotoSlot src={content.buurtpostImage} label="foto wijk" className="w-full aspect-square mb-2" onUpload={$("buurtpostImage")} />
          <E value={content.buurtpostBody} onEdit={$("buurtpostBody")} as="p" className="text-[9px] leading-[1.6] font-archivo text-gray-500" multiLine />
        </div>
        <div>
          <span className="text-[7px] uppercase font-bold text-gray-400 block mb-2 tracking-[0.2em] font-archivo pb-1 border-b border-gray-200">De Nights</span>
          <div className="font-archivo-black text-[34px] leading-[0.85] uppercase text-cvo-orange mb-3">Join<br />Ons</div>
          <div className="space-y-2">
            {content.events.map((ev, i) => (
              <div key={i} className="border-b border-gray-100 pb-2">
                <div className="flex items-baseline gap-2">
                  <E value={ev.day} onEdit={$ev(i).day} className="font-archivo-black text-[13px] text-cvo-orange" />
                  <E value={ev.month} onEdit={$ev(i).month} className="font-archivo-black text-[13px] text-cvo-orange" />
                  <E value={ev.title} onEdit={$ev(i).title} className="text-[10px] font-bold uppercase text-cvo-black font-archivo truncate" />
                </div>
                <E value={ev.detail} onEdit={$ev(i).detail} className="text-[8.5px] text-gray-400 font-archivo block" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[7px] uppercase font-bold text-gray-400 block mb-2 tracking-[0.2em] font-archivo pb-1 border-b border-gray-200">Jij aan het woord</span>
          <div className="font-archivo-black text-[28px] leading-[0.88] uppercase text-cvo-black mb-1">Pak De<br /><span className="text-cvo-orange">Mic</span></div>
          <span className="block mb-2 text-cvo-orange text-[11px] italic font-archivo">Jij bent de wijk.</span>
          <E value={content.pakDeMicText} onEdit={$("pakDeMicText")} as="p" className="text-[9px] leading-[1.6] font-archivo text-gray-500" multiLine />
          <span className="inline-block mt-2 border border-cvo-orange text-cvo-orange text-[8px] font-bold uppercase tracking-[0.1em] px-3 py-1 font-archivo">→ Stuur in</span>
        </div>
      </div>
    </div>
  );
}
