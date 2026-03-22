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
  cols: number;                // 1–12 (in a 12-column grid) — 12=full, 6=half, 4=third, 3=quarter
  widthPct?: number;           // legacy — only used as fallback if cols undefined
  heightPx: number;            // px, freely adjustable

  // Preset style + custom overrides
  style: "black" | "orange" | "mint" | "cream" | "transparent";
  customBg?: string;           // hex override (e.g. "#ff0000")
  customText?: string;         // hex override

  // Content
  contentType: "poster" | "text" | "image" | "split" | "quote" | "divider" | "events" | "pakdemic" | "crew" | "buurtpost" | "terugblik" | "joinus";
  headline: string;
  headlineSize: number;        // 12–72 (px)
  body: string;
  bodySize: number;            // 9–18 (px)
  tag?: string;                // small label badge

  // Image
  image?: string;
  imagePosition: "left" | "right" | "bg";  // for split (left/right) and poster (bg)
  imageSize?: number;          // 10–200 (percentage of available space, default 100)
  imageFit?: "cover" | "contain" | "fill";  // object-fit, default "cover"
  imageOpacity?: number;       // 0–100 opacity percentage, default 100

  // Typography
  textAlign: "left" | "center" | "right";
  uppercase: boolean;
  italic: boolean;

  // Layout
  padding: "none" | "sm" | "md" | "lg";
  borderTop: boolean;

  // Per-block content overrides (so multiple blocks can have independent data)
  blockEvents?: { day: string; month: string; title: string; detail: string }[];
  blockPakText?: string;

  // Design variant (1–5) for supported content types
  designVariant?: number;
}

export interface CustomRow {
  id: string;
  heightPx: number;    // height of the entire row (all cards same height)
  cards: CustomBlock[]; // 1–4 cards, each gets flex:1 width
}

export interface MagazineContent {
  template: TemplateType;
  logoPosition: "Top" | "Bottom";
  logoColor: "Orange" | "Black" | "Mint" | "Cream";
  logoX: number;    // 0=left … 100=right
  logoSize: number;    // height in px
  logoPadding: number; // px padding above + below logo (each side)
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
  customRows: CustomRow[];
  customPadding: number;   // px padding around the custom template canvas (0–40)
  customGap: number;       // px gap between blocks (0–16)
}

export const defaultContent: MagazineContent = {
  template: "Standard",
  logoPosition: "Bottom",
  logoColor: "Orange" as const,
  logoX: 50,
  logoSize: 90,
  logoPadding: 8,
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
  customRows: [],
  customPadding: 0,
  customGap: 0,
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

// ── Image compression — resize to maxPx on longest side, encode as JPEG ──
// Typical result: 3 MB photo → 50–90 KB, small enough to survive localStorage.
function compressImage(dataUrl: string, maxPx = 960, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxPx || h > maxPx) {
        if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
        else        { w = Math.round(w * maxPx / h); h = maxPx; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
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
        const r = new FileReader();
        r.onload = async () => { onUpload(await compressImage(r.result as string)); };
        r.readAsDataURL(f); e.target.value = "";
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
            const r = new FileReader();
            r.onload = async () => { onUpload(await compressImage(r.result as string)); };
            r.readAsDataURL(f); e.target.value = "";
          }} />
        </>
      )}
    </div>
  );
}

// ── Footer / Top logo — clean centered, size controlled via sidebar ──
function LogoArea({ content }: { content: MagazineContent }) {
  const size = Math.max(30, content.logoSize ?? 90);
  const pad = content.logoPadding ?? 8;
  // Use margin so negative values work (padding can't go below 0)
  return (
    <div className="flex justify-center items-center" style={{ marginTop: pad, marginBottom: pad }}>
      <div style={{ height: size }}>
        <CvoLogo className="h-full w-auto" />
      </div>
    </div>
  );
}

// Color schemes — all 4 design.md brand colors, override both var layers so cascade works
// with both @theme (var references) and any inline var() usages
const COLOR_SCHEMES: Record<string, Record<string, string>> = {
  // Default: Oranje hoofdkleur, Mint accent
  Orange: {
    "--cvo-orange":       "#F15B2B",
    "--color-cvo-orange": "#F15B2B",
    "--cvo-mint":         "#ACDCCE",
    "--color-cvo-mint":   "#ACDCCE",
    "--cvo-cream":        "#FEFDED",
    "--color-cvo-cream":  "#FEFDED",
  },
  // Monochroom: alles zwart als accent
  Black: {
    "--cvo-orange":       "#1A1A1A",
    "--color-cvo-orange": "#1A1A1A",
    "--cvo-mint":         "#4a4a4a",
    "--color-cvo-mint":   "#4a4a4a",
    "--cvo-cream":        "#f0f0f0",
    "--color-cvo-cream":  "#f0f0f0",
  },
  // Mint: de blauwe/groene merkkleur als hoofdaccent
  Mint: {
    "--cvo-orange":       "#ACDCCE",
    "--color-cvo-orange": "#ACDCCE",
    "--cvo-mint":         "#F15B2B",
    "--color-cvo-mint":   "#F15B2B",
    "--cvo-cream":        "#FEFDED",
    "--color-cvo-cream":  "#FEFDED",
  },
  // Cream: licht/warm schema, oranje blijft maar cream als accentvlak
  Cream: {
    "--cvo-orange":       "#F15B2B",
    "--color-cvo-orange": "#F15B2B",
    "--cvo-mint":         "#FEFDED",
    "--color-cvo-mint":   "#FEFDED",
    "--cvo-cream":        "#ACDCCE",
    "--color-cvo-cream":  "#ACDCCE",
  },
};

const BLOCK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  black:       { bg: "bg-cvo-black",    text: "text-cvo-cream",  label: "Zwart" },
  orange:      { bg: "bg-cvo-orange",   text: "text-white",       label: "Accent" },
  mint:        { bg: "bg-cvo-mint",     text: "text-cvo-black",   label: "Mint" },
  cream:       { bg: "bg-cvo-cream",    text: "text-cvo-black",   label: "Licht" },
  transparent: { bg: "bg-transparent",  text: "text-cvo-black",   label: "Doorz." },
};

function CustomBlockView({
  block,
  idx,
  total,
  onPatch,
  onEdit,
  isSelected,
  onSelect,
  onMoveLeft,
  onMoveRight,
  onDelete,
  flexMode,
  content,
}: {
  block: CustomBlock;
  idx: number;
  total: number;
  onPatch: (patch: Partial<CustomBlock>) => void;
  onEdit?: OnEdit;
  isSelected?: boolean;
  onSelect?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onDelete?: () => void;
  flexMode?: boolean;
  content?: MagazineContent;
}) {
  const [dragging, setDragging] = React.useState(false);

  // Resolve colors
  const bgColorMap: Record<string, string> = {
    black: "#1a1a1a",
    orange: "var(--color-cvo-orange, #F15B2B)",
    mint: "#ACDCCE",
    cream: "#FEFDED",
    transparent: "transparent",
  };
  const textColorMap: Record<string, string> = {
    black: "#FEFDED",
    orange: "#FEFDED",
    mint: "#1a1a1a",
    cream: "#1a1a1a",
    transparent: "#1a1a1a",
  };
  const bg = block.customBg || bgColorMap[block.style] || "#FEFDED";
  const textColor = block.customText || textColorMap[block.style] || "#1a1a1a";

  const paddingMap: Record<string, string> = { none: "0", sm: "10px", md: "18px", lg: "28px" };
  const padVal = paddingMap[block.padding] || "18px";

  // Derive cols (backward compat: old blocks may have widthPct instead of cols)
  const blockCols = block.cols ?? (Math.round(((block.widthPct ?? 50) / 100) * 12) || 6);

  // Drag resize — snaps to column grid
  const startResize = (e: React.MouseEvent) => {
    if (!onEdit) return;
    e.preventDefault();
    e.stopPropagation();
    const magazine = document.getElementById("magazine");
    const magWidth = magazine?.getBoundingClientRect().width ?? 794;
    const startX = e.clientX;
    const startCols = blockCols;
    setDragging(true);
    const onMove = (ev: MouseEvent) => {
      const deltaCols = ((ev.clientX - startX) / magWidth) * 12;
      const newCols = Math.min(12, Math.max(1, Math.round(startCols + deltaCols)));
      onPatch({ cols: newCols });
    };
    const onUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const hs = block.headlineSize || 24;
  const bs = block.bodySize || 10;
  const align = block.textAlign || "left";
  const transform = block.uppercase ? "uppercase" : "none";
  const fontStyle = block.italic ? "italic" : "normal";

  const headlineCls = `font-archivo-black leading-tight`;
  const bodyCls = `font-archivo leading-relaxed opacity-80`;

  const renderContent = () => {
    switch (block.contentType) {
      case "poster":
        return (
          <div className="absolute inset-0 overflow-hidden">
            {block.image && block.imagePosition === "bg" && (
              <img src={block.image} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: block.imageFit ?? "cover", opacity: ((block.imageOpacity ?? 100) / 100) * 0.4, width: `${block.imageSize ?? 100}%`, height: `${block.imageSize ?? 100}%`, maxWidth: "100%", maxHeight: "100%" }} />
            )}
            <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: padVal, textAlign: align as React.CSSProperties["textAlign"] }}>
              {block.tag && (
                <span className="text-[8px] font-bold uppercase tracking-[0.25em] mb-2 opacity-70 font-archivo" style={{ color: textColor }}>
                  {block.tag}
                </span>
              )}
              <E
                value={block.headline}
                onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
                className={headlineCls}
                style={{ fontSize: `${hs}px`, color: textColor, textTransform: transform as React.CSSProperties["textTransform"], fontStyle }}
              />
            </div>
          </div>
        );
      case "text":
        return (
          <div className="absolute inset-0 flex flex-col justify-end gap-2" style={{ padding: padVal, textAlign: align as React.CSSProperties["textAlign"] }}>
            {block.tag && (
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] opacity-60 font-archivo" style={{ color: textColor }}>{block.tag}</span>
            )}
            <E
              value={block.headline}
              onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
              className={headlineCls}
              style={{ fontSize: `${hs}px`, color: textColor, textTransform: transform as React.CSSProperties["textTransform"], fontStyle }}
            />
            <E
              as="p"
              value={block.body}
              onEdit={onEdit ? (v) => onPatch({ body: v }) : undefined}
              className={bodyCls}
              style={{ fontSize: `${bs}px`, color: textColor }}
              multiLine
            />
          </div>
        );
      case "image":
        return (
          <div className="absolute inset-0" style={{ opacity: (block.imageOpacity ?? 100) / 100 }}>
            {block.image ? (
              <img
                src={block.image}
                alt="foto"
                className="absolute inset-0"
                style={{
                  width: `${block.imageSize ?? 100}%`,
                  height: `${block.imageSize ?? 100}%`,
                  objectFit: block.imageFit ?? "cover",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            ) : (
              <FotoSlot src={block.image} label="foto" onUpload={onEdit ? (v) => onPatch({ image: v }) : undefined} className="absolute inset-0 w-full h-full" />
            )}
            {block.headline && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70">
                <E value={block.headline} onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
                  className="text-white font-archivo-black text-[11px]" />
              </div>
            )}
          </div>
        );
      case "split": {
        const imgLeft = block.imagePosition !== "right";
        return (
          <div className="absolute inset-0 flex">
            {imgLeft && (
              <div className="w-[45%] h-full relative shrink-0">
                <FotoSlot src={block.image} label="foto" onUpload={onEdit ? (v) => onPatch({ image: v }) : undefined} className="absolute inset-0 w-full h-full" />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-end gap-1.5" style={{ padding: padVal, textAlign: align as React.CSSProperties["textAlign"] }}>
              {block.tag && <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-60 font-archivo" style={{ color: textColor }}>{block.tag}</span>}
              <E value={block.headline} onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
                className={headlineCls} style={{ fontSize: `${hs}px`, color: textColor, textTransform: transform as React.CSSProperties["textTransform"] }} />
              <E as="p" value={block.body} onEdit={onEdit ? (v) => onPatch({ body: v }) : undefined}
                className={bodyCls} style={{ fontSize: `${bs}px`, color: textColor }} multiLine />
            </div>
            {!imgLeft && (
              <div className="w-[45%] h-full relative shrink-0">
                <FotoSlot src={block.image} label="foto" onUpload={onEdit ? (v) => onPatch({ image: v }) : undefined} className="absolute inset-0 w-full h-full" />
              </div>
            )}
          </div>
        );
      }
      case "quote":
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center" style={{ padding: padVal }}>
            <div className="text-[48px] font-archivo-black leading-none opacity-20" style={{ color: textColor }}>&ldquo;</div>
            <E value={block.headline} onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
              className={`${headlineCls} text-center`}
              style={{ fontSize: `${hs}px`, color: textColor, fontStyle }} />
            {block.body && (
              <E as="p" value={block.body} onEdit={onEdit ? (v) => onPatch({ body: v }) : undefined}
                className="font-archivo opacity-50 text-center" style={{ fontSize: `${bs}px`, color: textColor }} />
            )}
          </div>
        );
      case "divider":
        return (
          <div className="absolute inset-0 flex items-center justify-center gap-3" style={{ padding: padVal }}>
            <div className="flex-1 h-[2px] opacity-30" style={{ background: textColor }} />
            {block.headline && (
              <E value={block.headline} onEdit={onEdit ? (v) => onPatch({ headline: v }) : undefined}
                className="font-archivo-black text-[9px] uppercase tracking-[0.3em] opacity-60 shrink-0" style={{ color: textColor }} />
            )}
            <div className="flex-1 h-[2px] opacity-30" style={{ background: textColor }} />
          </div>
        );
      case "events": {
        const eventsData = block.blockEvents ?? content?.events ?? [];
        return (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header bar */}
            <div style={{
              background: textColor, color: bg,
              padding: `6px ${padVal}`,
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1 }}>
                {block.headline || "Agenda"}
              </span>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6 }}>
                {content?.month ?? ""} {content?.year ?? ""}
              </span>
            </div>
            {/* Events list */}
            <div style={{ flex: 1, overflowY: "hidden", display: "flex", flexDirection: "column", gap: 0, padding: `${padVal} 0 ${padVal} 0` }}>
              {eventsData.map((ev, i) => (
                <div key={i} style={{
                  display: "flex", gap: 0, alignItems: "stretch",
                  borderBottom: `1px solid ${textColor}20`,
                  minHeight: 0, flex: "1 1 0",
                }}>
                  {/* Date block */}
                  <div style={{
                    background: i % 2 === 0 ? `${textColor}15` : "transparent",
                    minWidth: 46, maxWidth: 46,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "4px 0", flexShrink: 0,
                    borderRight: `2px solid ${textColor}`,
                  }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", lineHeight: 1 }}>{ev.day}</span>
                    <span style={{ fontSize: 7, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.12em", color: textColor, fontWeight: 700 }}>{ev.month}</span>
                  </div>
                  {/* Event info */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "4px 10px", minWidth: 0, overflow: "hidden" }}>
                    <div style={{ fontSize: 9.5, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", textTransform: "uppercase", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                    <div style={{ fontSize: 7.5, color: textColor, opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{ev.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "pakdemic": {
        const pakText = block.blockPakText ?? content?.pakDeMicText ?? "";
        const pdVariant = block.designVariant ?? 1;

        // Variant 2 — centered bold layout
        if (pdVariant === 2) {
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: padVal, gap: 8, textAlign: "center" }}>
              <div style={{ fontSize: 60, fontFamily: "var(--font-archivo-black)", fontWeight: 900, color: "var(--color-cvo-orange,#F15B2B)", lineHeight: 0.8, opacity: 0.15, position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", userSelect: "none", pointerEvents: "none" }}>&ldquo;</div>
              <span style={{ display: "inline-block", background: "var(--color-cvo-orange,#F15B2B)", color: "#fff", fontSize: 6.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", padding: "2px 10px", fontFamily: "var(--font-archivo-black)" }}>🎤 Pak de Mic</span>
              <div style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, color: textColor, textTransform: "uppercase", lineHeight: 1.0 }}>{block.headline || "Jij aan het woord"}</div>
              <p style={{ fontFamily: "var(--font-archivo)", fontSize: `${bs}px`, color: textColor, opacity: 0.7, lineHeight: 1.6, margin: 0, maxWidth: 260 }}>{pakText}</p>
            </div>
          );
        }

        // Variant 3 — left accent stripe
        if (pdVariant === 3) {
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex" }}>
              <div style={{ width: 6, background: "var(--color-cvo-orange,#F15B2B)", flexShrink: 0 }} />
              <div style={{ flex: 1, padding: padVal, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, overflow: "hidden" }}>
                <span style={{ fontSize: 6.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-cvo-orange,#F15B2B)", fontFamily: "var(--font-archivo-black)" }}>🎤 Pak de Mic</span>
                <div style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, color: textColor, textTransform: "uppercase", lineHeight: 1.05 }}>{block.headline || "Jij aan het woord"}</div>
                <p style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.75, lineHeight: 1.6, margin: 0, fontFamily: "var(--font-archivo)" }}>{pakText}</p>
              </div>
            </div>
          );
        }

        // Variant 4 — minimal speech-bubble style
        if (pdVariant === 4) {
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", padding: padVal, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 6 }}>
              <div style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, color: textColor, textTransform: "uppercase", lineHeight: 1.05 }}>{block.headline || "Jij aan het woord"}</div>
              <div style={{ flex: 1, border: `2px solid ${textColor}20`, borderRadius: 2, padding: 8, display: "flex", alignItems: "center", overflow: "hidden" }}>
                <p style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.75, lineHeight: 1.6, margin: 0, fontFamily: "var(--font-archivo)" }}>{pakText}</p>
              </div>
              <span style={{ display: "inline-block", background: textColor, color: bg, fontSize: 6.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", padding: "2px 8px", fontFamily: "var(--font-archivo-black)", alignSelf: "flex-start" }}>🎤 Jij bent de wijk</span>
            </div>
          );
        }

        // Variant 5 — dark feature with huge MIC type
        if (pdVariant === 5) {
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", bottom: -8, right: -4, fontFamily: "var(--font-archivo-black)", fontWeight: 900, fontSize: 72, color: textColor, opacity: 0.05, lineHeight: 1, userSelect: "none", pointerEvents: "none", textTransform: "uppercase" }}>MIC</div>
              <div style={{ position: "absolute", inset: 0, padding: padVal, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 3, background: "var(--color-cvo-orange,#F15B2B)" }} />
                  <span style={{ fontSize: 6.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: textColor, opacity: 0.5, fontFamily: "var(--font-archivo-black)" }}>Pak de Mic</span>
                </div>
                <div style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, color: textColor, textTransform: "uppercase", lineHeight: 1.0 }}>{block.headline || "Jij aan het woord"}</div>
                <p style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.7, lineHeight: 1.6, margin: 0, fontFamily: "var(--font-archivo)", flex: 1, overflow: "hidden" }}>{pakText}</p>
                <span style={{ display: "inline-block", background: "var(--color-cvo-orange,#F15B2B)", color: "#fff", fontSize: 7, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", padding: "3px 10px", fontFamily: "var(--font-archivo-black)", alignSelf: "flex-start" }}>→ Stuur in</span>
              </div>
            </div>
          );
        }

        // Variant 1 (default) — big decorative quote mark
        return (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            {/* Big decorative quote mark */}
            <div style={{
              position: "absolute", top: -10, left: 8,
              fontSize: 120, fontFamily: "var(--font-archivo-black)", fontWeight: 900,
              color: textColor, opacity: 0.07, lineHeight: 1, userSelect: "none",
              pointerEvents: "none",
            }}>&ldquo;</div>
            <div style={{ position: "absolute", inset: 0, padding: padVal, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
              {/* Label */}
              <span style={{
                display: "inline-block", background: textColor, color: bg,
                fontSize: 7, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em",
                padding: "2px 8px", fontFamily: "var(--font-archivo-black)", alignSelf: "flex-start",
              }}>Pak de Mic 🎤</span>
              {/* Headline */}
              <div className="font-archivo-black" style={{ fontSize: `${hs}px`, color: textColor, textTransform: "uppercase", lineHeight: 1.05 }}>
                {block.headline || "Jij aan het woord"}
              </div>
              {/* Body */}
              <p className="font-archivo" style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.75, lineHeight: 1.6, margin: 0 }}>
                {pakText}
              </p>
            </div>
          </div>
        );
      }
      case "crew": {
        const crewData = content?.crew ?? [];
        const crewVariant = block.designVariant ?? 1;
        const nameSize = Math.max(6, Math.round(36 / Math.max(crewData.length, 1)));
        const roleSize = Math.max(5, Math.round(28 / Math.max(crewData.length, 1)));
        const initSize = Math.max(7, Math.round(40 / Math.max(crewData.length, 1)));

        // Variant 2 — horizontal list with name+role next to avatar
        if (crewVariant === 2) {
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ background: textColor, color: bg, padding: `5px ${padVal}`, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, fontWeight: 900, textTransform: "uppercase" }}>{block.headline || "Meet The Crew"}</span>
              </div>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
                {crewData.map((member, i) => (
                  <div key={i} style={{ flex: "1 1 0", display: "flex", alignItems: "center", gap: 8, padding: `3px ${padVal}`, borderBottom: i < crewData.length - 1 ? `1px solid ${textColor}15` : "none", minHeight: 0, overflow: "hidden" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", background: `${textColor}20`, border: `1.5px solid ${textColor}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {member.avatar ? <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 8, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)" }}>{member.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                      <div style={{ fontSize: 7, color: textColor, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Variant 3 — square photo cards (no circular clips)
        if (crewVariant === 3) {
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ background: textColor, color: bg, padding: `5px ${padVal}`, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, fontWeight: 900, textTransform: "uppercase" }}>{block.headline || "Meet The Crew"}</span>
              </div>
              <div style={{ flex: 1, padding: padVal, overflow: "hidden", display: "flex", flexDirection: "row", gap: 4, alignItems: "stretch" }}>
                {crewData.map((member, i) => (
                  <div key={i} style={{ flex: "1 1 0%", minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Square photo */}
                    <div style={{ flex: 1, background: `${textColor}20`, overflow: "hidden", position: "relative", minHeight: 0 }}>
                      {member.avatar ? <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: initSize, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", opacity: 0.4 }}>{member.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      {/* Name overlay */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65),transparent)", padding: "8px 4px 3px" }}>
                        <div style={{ fontSize: nameSize, fontWeight: 900, color: "#fff", fontFamily: "var(--font-archivo-black)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                        <div style={{ fontSize: Math.max(5, roleSize - 1), color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Variant 4 — grid (2 rows × n cols)
        if (crewVariant === 4) {
          const cols = Math.ceil(crewData.length / 2);
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ background: textColor, color: bg, padding: `5px ${padVal}`, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, fontWeight: 900, textTransform: "uppercase" }}>{block.headline || "Meet The Crew"}</span>
              </div>
              <div style={{ flex: 1, padding: "6px", overflow: "hidden", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: "1fr 1fr", gap: 4 }}>
                {crewData.map((member, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden", minWidth: 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", background: `${textColor}20`, border: `1.5px solid ${textColor}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {member.avatar ? <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 7, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)" }}>{member.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div style={{ minWidth: 0, overflow: "hidden" }}>
                      <div style={{ fontSize: 8, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                      <div style={{ fontSize: 6, color: textColor, opacity: 0.5, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Variant 5 — feature: first member large, rest in strip
        if (crewVariant === 5) {
          const [featured, ...rest] = crewData;
          return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ background: textColor, color: bg, padding: `5px ${padVal}`, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, fontWeight: 900, textTransform: "uppercase" }}>{block.headline || "Meet The Crew"}</span>
              </div>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", gap: 0 }}>
                {/* Featured member */}
                {featured && (
                  <div style={{ flex: "0 0 42%", position: "relative", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: `${textColor}20` }}>
                      {featured.avatar ? <img src={featured.avatar} alt={featured.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 20, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", opacity: 0.3 }}>{featured.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)", padding: "16px 6px 4px" }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: "#fff", fontFamily: "var(--font-archivo-black)" }}>{featured.name}</div>
                      <div style={{ fontSize: 6.5, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{featured.role}</div>
                    </div>
                  </div>
                )}
                {/* Rest in vertical stack */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {rest.map((member, i) => (
                    <div key={i} style={{ flex: "1 1 0", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderBottom: i < rest.length - 1 ? `1px solid ${textColor}15` : "none", overflow: "hidden" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", background: `${textColor}20`, border: `1px solid ${textColor}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {member.avatar ? <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 6, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)" }}>{member.name.slice(0, 2).toUpperCase()}</span>}
                      </div>
                      <div style={{ minWidth: 0, overflow: "hidden" }}>
                        <div style={{ fontSize: 8, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                        <div style={{ fontSize: 6, color: textColor, opacity: 0.5, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // Variant 1 (default) — circular avatars in one row
        return (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{
              background: textColor, color: bg,
              padding: `5px ${padVal}`,
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: `${hs}px`, fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1 }}>
                {block.headline || "Meet The Crew"}
              </span>
            </div>
            {/* Crew grid — always one row, all members equal width */}
            <div style={{
              flex: 1, padding: padVal, overflow: "hidden",
              display: "flex", flexDirection: "row",
              gap: 6, alignItems: "center", justifyContent: "center",
            }}>
              {crewData.map((member, i) => (
                <div key={i} style={{ flex: "1 1 0%", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  {/* Avatar — square that fills flex cell, then circular */}
                  <div style={{
                    width: "100%", aspectRatio: "1 / 1", borderRadius: "50%", overflow: "hidden",
                    background: `${textColor}25`, position: "relative",
                    border: `2px solid ${textColor}`, flexShrink: 0,
                  }}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: `${initSize}px`, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)" }}>
                          {member.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ fontSize: `${nameSize}px`, fontWeight: 900, color: textColor, fontFamily: "var(--font-archivo-black)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
                    <div style={{ fontSize: `${roleSize}px`, color: textColor, opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.06em" }}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "buurtpost": {
        const bpHeadline = block.headline || (content?.buurtpostHeadline ?? "");
        const bpBody = block.body || (content?.buurtpostBody ?? "");
        const bpImage = block.image || (content?.buurtpostImage ?? "");
        return (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Image top */}
            {bpImage ? (
              <div style={{ flex: "0 0 50%", overflow: "hidden", position: "relative" }}>
                <img src={bpImage} alt="buurtpost" style={{
                  width: `${block.imageSize ?? 100}%`, height: `${block.imageSize ?? 100}%`,
                  maxWidth: "100%", maxHeight: "100%",
                  objectFit: block.imageFit ?? "cover", opacity: (block.imageOpacity ?? 100) / 100,
                }} />
                {/* Location badge */}
                <div style={{
                  position: "absolute", bottom: 6, left: 6,
                  background: "var(--color-cvo-orange, #F15B2B)", color: "#fff",
                  fontSize: 6.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em",
                  padding: "2px 6px", fontFamily: "var(--font-archivo-black)",
                }}>📍 Uit de wijk</div>
              </div>
            ) : (
              <div style={{ flex: "0 0 50%", background: `${textColor}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: textColor, opacity: 0.3, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" }}>foto</span>
              </div>
            )}
            {/* Text */}
            <div style={{ flex: 1, padding: padVal, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 4, overflow: "hidden" }}>
              <div className="font-archivo-black" style={{ fontSize: `${hs}px`, color: textColor, lineHeight: 1.05, textTransform: transform as React.CSSProperties["textTransform"] }}>{bpHeadline}</div>
              <p className="font-archivo" style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.75, lineHeight: 1.5, margin: 0, overflow: "hidden" }}>{bpBody}</p>
            </div>
          </div>
        );
      }
      case "terugblik": {
        const fbHeadline = content?.flashbackHeadline ?? "";
        const fbBody = content?.flashbackBody ?? "";
        const fbImages = (content?.flashbackImages ?? []).filter(Boolean);
        return (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Photo grid first */}
            {fbImages.length > 0 && (
              <div style={{
                flex: "0 0 55%", overflow: "hidden",
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(fbImages.length, 3)}, 1fr)`,
                gap: 2,
              }}>
                {fbImages.map((img, i) => (
                  <div key={i} style={{ overflow: "hidden", position: "relative" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                ))}
              </div>
            )}
            {/* Text below */}
            <div style={{ flex: 1, padding: padVal, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 4, overflow: "hidden" }}>
              {/* Label */}
              <span style={{
                fontSize: 7, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em",
                color: textColor, opacity: 0.5, fontFamily: "var(--font-archivo-black)",
              }}>▶ Terugblik</span>
              <div className="font-archivo-black" style={{ fontSize: `${hs}px`, color: textColor, lineHeight: 1.05, textTransform: transform as React.CSSProperties["textTransform"] }}>{fbHeadline}</div>
              <p className="font-archivo" style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.75, lineHeight: 1.5, margin: 0 }}>{fbBody}</p>
            </div>
          </div>
        );
      }
      case "joinus": {
        return (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            {/* Background decoration */}
            <div style={{
              position: "absolute", bottom: -20, right: -20,
              width: 100, height: 100, borderRadius: "50%",
              background: textColor, opacity: 0.06,
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", inset: 0, padding: padVal,
              display: "flex", flexDirection: "column", justifyContent: "center", gap: 10,
            }}>
              {/* Small badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: textColor, color: bg, padding: "2px 8px",
                fontSize: 6.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em",
                fontFamily: "var(--font-archivo-black)", alignSelf: "flex-start",
              }}>★ Community</div>
              {/* Headline */}
              <div className="font-archivo-black uppercase" style={{ fontSize: `${hs}px`, color: textColor, lineHeight: 1.0 }}>
                {block.headline || "Join Ons"}
              </div>
              {/* Body */}
              <p className="font-archivo" style={{ fontSize: `${bs}px`, color: textColor, opacity: 0.75, lineHeight: 1.55, margin: 0, maxWidth: 240 }}>
                {block.body || "Word lid van de CLUBvanONS community en maak deel uit van iets bijzonders."}
              </p>
              {/* CTA button */}
              <div style={{
                display: "inline-block",
                background: "var(--color-cvo-orange, #F15B2B)", color: "#fff",
                fontFamily: "var(--font-archivo-black)", fontSize: 10, fontWeight: 900,
                textTransform: "uppercase", letterSpacing: "0.12em",
                padding: "7px 18px", alignSelf: "flex-start",
              }}>Doe mee →</div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className="relative group overflow-hidden"
      style={{
        // flexMode: gebruik cols als proportionele flex-basis zodat slepen werkt
      ...(flexMode
        ? { flex: `${blockCols} ${blockCols} 0%`, minWidth: 0 }
        : { gridColumn: `span ${blockCols}` }),
        height: block.heightPx,
        background: bg,
        borderTop: block.borderTop ? `3px solid ${textColor}` : undefined,
        borderRight: "1px solid rgba(0,0,0,0.07)",
        outline: isSelected ? "2.5px solid #F15B2B" : undefined,
        outlineOffset: isSelected ? "-2.5px" : undefined,
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={onSelect}
    >
      {/* Universal background image — works for ALL content types */}
      {block.image && block.contentType !== "image" && block.contentType !== "split" && block.contentType !== "poster" && block.contentType !== "buurtpost" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={block.image}
            alt=""
            style={{
              width: `${block.imageSize ?? 100}%`,
              height: `${block.imageSize ?? 100}%`,
              maxWidth: "100%", maxHeight: "100%",
              objectFit: block.imageFit ?? "cover",
              opacity: (block.imageOpacity ?? 40) / 100,
            }}
          />
        </div>
      )}
      <div className="relative z-10" style={{ width: "100%", height: "100%" }}>
        {renderContent()}
      </div>

      {/* Hover overlay toolbar */}
      {onEdit && (
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          {/* Left: move controls */}
          <div className="flex gap-px bg-black/75 backdrop-blur-sm">
            {idx > 0 && (
              <button type="button" title="Verplaats links" onClick={(e) => { e.stopPropagation(); onMoveLeft?.(); }}
                className="px-2 py-1 text-white hover:bg-cvo-orange transition-colors text-[10px] font-bold">&#9664;</button>
            )}
            {idx < total - 1 && (
              <button type="button" title="Verplaats rechts" onClick={(e) => { e.stopPropagation(); onMoveRight?.(); }}
                className="px-2 py-1 text-white hover:bg-cvo-orange transition-colors text-[10px] font-bold">&#9654;</button>
            )}
            {onSelect && (
              <button type="button" title="Bewerken" onClick={(e) => { e.stopPropagation(); onSelect(); }}
                className="px-2 py-1 text-white hover:bg-cvo-orange transition-colors text-[10px] font-bold">&#9998;</button>
            )}
          </div>
          {/* Right: delete */}
          <button type="button" title="Verwijderen" onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="bg-black/75 backdrop-blur-sm px-2 py-1 text-white hover:bg-red-500 transition-colors text-[10px] font-bold">&#10005;</button>
        </div>
      )}

      {/* Selection badge */}
      {isSelected && (
        <div className="absolute bottom-1 right-1 bg-cvo-orange text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-wide z-20 pointer-events-none">
          ACTIEF
        </div>
      )}

      {/* Drag resize handle */}
      {onEdit && (
        <div
          onMouseDown={startResize}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 bottom-0 w-2.5 z-20 cursor-ew-resize select-none"
          style={{ background: dragging ? "rgba(241,91,43,0.6)" : "transparent" }}
          title="Sleep om breedte aan te passen"
        >
          <div className="absolute inset-y-0 right-0 w-[3px] transition-colors"
            style={{ background: dragging ? "white" : "rgba(241,91,43,0.4)" }} />
        </div>
      )}
    </div>
  );
}

function renderCustom(
  content: MagazineContent,
  onEdit?: OnEdit,
  selectedBlockId?: string | null,
  onSelectBlock?: (id: string | null) => void,
) {
  const rows = content.customRows ?? [];

  const patchRows = (newRows: CustomRow[]) => {
    if (!onEdit) return;
    onEdit({ customRows: newRows });
  };

  const patchCard = (rowIdx: number, cardIdx: number, patch: Partial<CustomBlock>) => {
    if (!onEdit) return;
    const newRows = rows.map((row, ri) =>
      ri !== rowIdx ? row : {
        ...row,
        cards: row.cards.map((card, ci) => ci !== cardIdx ? card : { ...card, ...patch }),
      }
    );
    patchRows(newRows);
  };

  const deleteCard = (rowIdx: number, cardIdx: number) => {
    if (!onEdit) return;
    const newRows = rows.map((row, ri) =>
      ri !== rowIdx ? row : { ...row, cards: row.cards.filter((_, ci) => ci !== cardIdx) }
    ).filter(row => row.cards.length > 0);
    patchRows(newRows);
  };

  const pad = content.customPadding ?? 0;
  const gap = content.customGap ?? 0;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-300 select-none">
        <div className="text-6xl font-archivo-black leading-none">+</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-archivo">Voeg rijen toe in de editor</p>
      </div>
    );
  }

  return (
    <div style={{ padding: pad, display: "flex", flexDirection: "column", gap }}>
      {rows.map((row, rowIdx) => (
        <div key={row.id} style={{ display: "flex", height: row.heightPx, gap, overflow: "hidden" }}>
          {row.cards.map((card, cardIdx) => (
            <CustomBlockView
              key={card.id}
              block={card}
              idx={cardIdx}
              total={row.cards.length}
              onPatch={(patch) => patchCard(rowIdx, cardIdx, patch)}
              onEdit={onEdit}
              isSelected={selectedBlockId === card.id}
              onSelect={onEdit ? () => onSelectBlock?.(card.id) : undefined}
              content={content}
              onMoveLeft={cardIdx > 0 ? () => {
                const newRows = rows.map((r, ri) => {
                  if (ri !== rowIdx) return r;
                  const cards = [...r.cards];
                  [cards[cardIdx - 1], cards[cardIdx]] = [cards[cardIdx], cards[cardIdx - 1]];
                  return { ...r, cards };
                });
                patchRows(newRows);
              } : undefined}
              onMoveRight={cardIdx < row.cards.length - 1 ? () => {
                const newRows = rows.map((r, ri) => {
                  if (ri !== rowIdx) return r;
                  const cards = [...r.cards];
                  [cards[cardIdx], cards[cardIdx + 1]] = [cards[cardIdx + 1], cards[cardIdx]];
                  return { ...r, cards };
                });
                patchRows(newRows);
              } : undefined}
              onDelete={() => deleteCard(rowIdx, cardIdx)}
              flexMode
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MagazinePreview({ content, onEdit, selectedBlockId, onSelectBlock }: {
  content: MagazineContent;
  onEdit?: OnEdit;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
}) {
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
          <LogoArea content={content} />
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
              CLUB<span style={{ color: "var(--color-cvo-orange)" }}>VAN</span>ONS
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
        {content.template === "Custom" && renderCustom(content, onEdit, selectedBlockId, onSelectBlock)}
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t-[3px] border-cvo-black">
        {!atTop && (
          <div className="overflow-hidden">
            <LogoArea content={content} />
          </div>
        )}
        {(content.companyDescription || onEdit) && (
          <div className="px-6 py-2 text-center border-b-[2px] border-cvo-black">
            <E
              as="p"
              value={content.companyDescription || (onEdit ? "Klik hier om beschrijving toe te voegen..." : "")}
              onEdit={onEdit ? v => onEdit({ companyDescription: v }) : undefined}
              className={`text-[10px] font-archivo leading-[1.7] max-w-[460px] mx-auto ${content.companyDescription ? "text-gray-500" : "text-gray-300 italic"}`}
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
