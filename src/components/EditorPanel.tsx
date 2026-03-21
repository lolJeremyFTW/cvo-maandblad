"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { MagazineContent, TemplateType, CustomBlock, CustomRow } from "./MagazinePreview";
import {
  Trash2, Plus, Type, Users, Calendar, Newspaper,
  MapPin, Info, Layout, Image as ImageIcon, Mic,
  HeartHandshake, ChevronDown, Building2, Shuffle, Layers, ArrowLeft
} from "lucide-react";

interface EditorPanelProps {
  content: MagazineContent;
  onChange: (content: MagazineContent) => void;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
}

const templates: TemplateType[] = ["Standard", "Collage", "Brutalist", "Street", "Feature", "Minimalist", "Custom"];

// ── Reusable image upload field ──
function ImgUpload({
  label,
  src,
  onUpload,
  className,
  circle,
}: {
  label: string;
  src?: string;
  onUpload: (dataUrl: string) => void;
  className?: string;
  circle?: boolean;
}) {
  return (
    <div
      className={`relative border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-cvo-orange transition-colors group ${circle ? "rounded-full" : ""} ${className ?? ""}`}
    >
      {src ? (
        <img src={src} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-1 min-h-[40px]">
          <ImageIcon size={14} className="text-gray-300 group-hover:text-cvo-orange transition-colors" />
          <span className="text-[8px] uppercase font-bold text-gray-300 group-hover:text-cvo-orange transition-colors">{label}</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onUpload(reader.result as string);
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
}

// ── Collapsible section wrapper ──
function EditorSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <section className="border-2 border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 font-archivo-black text-[14px] uppercase tracking-tight text-cvo-black">
          {icon}
          {title}
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.12em] block mb-1 font-archivo">{children}</label>;
}

const inputCls = "w-full p-2 border-2 border-gray-200 focus:border-cvo-orange outline-none font-archivo text-[13px] transition-colors";
const textareaCls = `${inputCls} resize-none`;

// ── Block Editor Panel ──
function BlockEditor({
  block,
  onPatch,
  onClose,
}: {
  block: CustomBlock;
  onPatch: (patch: Partial<CustomBlock>) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<"inhoud" | "stijl" | "layout">("inhoud");

  const bgColorMap: Record<string, string> = {
    black: "#1a1a1a",
    orange: "#F15B2B",
    mint: "#ACDCCE",
    cream: "#FEFDED",
    transparent: "transparent",
  };

  const styleLabels: Record<string, string> = {
    black: "Zwart",
    orange: "Accent",
    mint: "Mint",
    cream: "Licht",
    transparent: "Doorz.",
  };

  const typeLabel: Record<string, string> = {
    poster: "Poster",
    text: "Tekst",
    image: "Foto",
    split: "Split",
    quote: "Quote",
    divider: "Divider",
    events: "Agenda",
    pakdemic: "Pak de Mic",
    crew: "Crew",
    buurtpost: "Buurtpost",
    terugblik: "Terugblik",
    joinus: "Join Ons",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-cvo-black flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-gray-400 hover:text-cvo-orange transition-colors text-[11px] font-bold uppercase tracking-wide font-archivo"
        >
          <ArrowLeft size={14} />
          Overzicht
        </button>
        <div className="flex-1" />
        <span className="text-cvo-cream font-archivo-black text-[13px] uppercase tracking-tight">
          {typeLabel[block.contentType] || block.contentType}
        </span>
        <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: block.customBg || bgColorMap[block.style] || "#FEFDED" }} />
      </div>

      {/* Tabs */}
      <div className="flex border-b-[2px] border-cvo-black shrink-0">
        {(["inhoud", "stijl", "layout"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] font-archivo transition-colors ${
              activeTab === tab
                ? "bg-cvo-orange text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── INHOUD TAB ── */}
        {activeTab === "inhoud" && (
          <>
            <div>
              <Label>Headline</Label>
              <input
                className={inputCls}
                value={block.headline}
                onChange={(e) => onPatch({ headline: e.target.value })}
              />
            </div>
            <div>
              <Label>Headline grootte: {block.headlineSize || 24}px</Label>
              <input
                type="range"
                min={12}
                max={72}
                value={block.headlineSize || 24}
                onChange={(e) => onPatch({ headlineSize: Number(e.target.value) })}
                className="w-full accent-cvo-orange"
              />
            </div>

            {block.contentType !== "divider" && block.contentType !== "poster" && (
              <>
                <div>
                  <Label>Body tekst</Label>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    value={block.body}
                    onChange={(e) => onPatch({ body: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Body grootte: {block.bodySize || 10}px</Label>
                  <input
                    type="range"
                    min={9}
                    max={18}
                    value={block.bodySize || 10}
                    onChange={(e) => onPatch({ bodySize: Number(e.target.value) })}
                    className="w-full accent-cvo-orange"
                  />
                </div>
              </>
            )}

            <div>
              <Label>Label / Tag</Label>
              <input
                className={inputCls}
                value={block.tag || ""}
                placeholder="bijv. NIEUW"
                onChange={(e) => onPatch({ tag: e.target.value })}
              />
            </div>

            {(block.contentType === "image" || block.contentType === "split" || block.contentType === "poster") && (
              <div>
                <Label>Afbeelding</Label>
                <ImgUpload
                  label="foto uploaden"
                  src={block.image}
                  onUpload={(v) => onPatch({ image: v })}
                  className="w-full aspect-video"
                />
              </div>
            )}

            {(block.contentType === "split" || block.contentType === "poster") && (
              <div>
                <Label>Afbeelding positie</Label>
                <div className="flex border-2 border-gray-200 overflow-hidden">
                  {(block.contentType === "split"
                    ? [["left", "Links"], ["right", "Rechts"]]
                    : [["bg", "Achtergrond"]]
                  ).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => onPatch({ imagePosition: val as CustomBlock["imagePosition"] })}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase font-archivo transition-colors ${
                        (block.imagePosition || "left") === val
                          ? "bg-cvo-black text-cvo-cream"
                          : "hover:bg-gray-50 text-gray-500"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(block.contentType === "image" || block.contentType === "split" || block.contentType === "poster" || block.contentType === "buurtpost") && (
              <>
                <div>
                  <Label>Afbeelding Grootte: {block.imageSize ?? 100}%</Label>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={block.imageSize ?? 100}
                    onChange={(e) => onPatch({ imageSize: Number(e.target.value) })}
                    className="w-full accent-cvo-orange"
                  />
                </div>
                <div>
                  <Label>Object Fit</Label>
                  <div className="flex border-2 border-gray-200 overflow-hidden">
                    {(["cover", "contain", "fill"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onPatch({ imageFit: val })}
                        className={`flex-1 py-2 text-[10px] font-bold uppercase font-archivo transition-colors ${
                          (block.imageFit ?? "cover") === val
                            ? "bg-cvo-black text-cvo-cream"
                            : "hover:bg-gray-50 text-gray-500"
                        }`}
                      >
                        {val === "cover" ? "Cover" : val === "contain" ? "Contain" : "Fill"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Transparantie: {block.imageOpacity ?? 100}%</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={block.imageOpacity ?? 100}
                    onChange={(e) => onPatch({ imageOpacity: Number(e.target.value) })}
                    className="w-full accent-cvo-orange"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* ── STIJL TAB ── */}
        {activeTab === "stijl" && (
          <>
            <div>
              <Label>Stijl preset</Label>
              <div className="flex gap-2 flex-wrap">
                {(["black", "orange", "mint", "cream", "transparent"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    title={styleLabels[s]}
                    onClick={() => onPatch({ style: s, customBg: undefined, customText: undefined })}
                    className="relative w-9 h-9 border-2 transition-all"
                    style={{
                      background: bgColorMap[s] === "transparent" ? "repeating-linear-gradient(45deg, #ccc, #ccc 3px, white 3px, white 8px)" : bgColorMap[s],
                      borderColor: block.style === s && !block.customBg ? "#F15B2B" : "rgba(0,0,0,0.15)",
                      boxShadow: block.style === s && !block.customBg ? "0 0 0 2px #F15B2B" : undefined,
                    }}
                  >
                    {block.style === s && !block.customBg && (
                      <span className="absolute inset-0 flex items-center justify-center text-[14px]">
                        {s === "black" || s === "orange" ? "✓" : <span className="text-cvo-black">✓</span>}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                {(["black", "orange", "mint", "cream", "transparent"] as const).map((s) => (
                  <span key={s} className="text-[8px] text-gray-400 font-archivo w-9 text-center">{styleLabels[s]}</span>
                ))}
              </div>
            </div>

            <div>
              <Label>Aangepaste achtergrondkleur</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={block.customBg || bgColorMap[block.style] || "#FEFDED"}
                  onChange={(e) => onPatch({ customBg: e.target.value })}
                  className="w-10 h-10 border-2 border-gray-200 cursor-pointer p-0.5"
                />
                <div className="flex-1">
                  <input
                    className={inputCls}
                    value={block.customBg || ""}
                    placeholder="bijv. #FF0000"
                    onChange={(e) => onPatch({ customBg: e.target.value || undefined })}
                  />
                </div>
                {block.customBg && (
                  <button type="button" onClick={() => onPatch({ customBg: undefined })}
                    className="text-[9px] text-gray-400 hover:text-red-500 font-bold font-archivo uppercase">
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label>Aangepaste tekstkleur</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={block.customText || "#1a1a1a"}
                  onChange={(e) => onPatch({ customText: e.target.value })}
                  className="w-10 h-10 border-2 border-gray-200 cursor-pointer p-0.5"
                />
                <div className="flex-1">
                  <input
                    className={inputCls}
                    value={block.customText || ""}
                    placeholder="bijv. #FFFFFF"
                    onChange={(e) => onPatch({ customText: e.target.value || undefined })}
                  />
                </div>
                {block.customText && (
                  <button type="button" onClick={() => onPatch({ customText: undefined })}
                    className="text-[9px] text-gray-400 hover:text-red-500 font-bold font-archivo uppercase">
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label>Typografie</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPatch({ uppercase: !block.uppercase })}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase font-archivo border-2 transition-colors ${
                    block.uppercase ? "bg-cvo-black text-cvo-cream border-cvo-black" : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  HOOFDLETTERS
                </button>
                <button
                  type="button"
                  onClick={() => onPatch({ italic: !block.italic })}
                  className={`flex-1 py-2 text-[10px] font-bold italic font-archivo border-2 transition-colors ${
                    block.italic ? "bg-cvo-black text-cvo-cream border-cvo-black" : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  Cursief
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── LAYOUT TAB ── */}
        {activeTab === "layout" && (
          <>
            <div>
              <Label>Breedte ({block.cols ?? 6} van 12 kolommen = {Math.round(((block.cols ?? 6) / 12) * 100)}%)</Label>
              <p className="text-[9px] text-gray-400 italic font-archivo mb-1">In rij-modus bepaalt het aantal kaarten de breedte.</p>
              {/* Quick presets */}
              <div className="grid grid-cols-5 gap-1 mb-2">
                {([["¼", 3], ["⅓", 4], ["½", 6], ["⅔", 8], ["1/1", 12]] as const).map(([lbl, val]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onPatch({ cols: val })}
                    className={`py-2 text-[11px] font-bold font-archivo transition-colors border-2 ${
                      (block.cols ?? 6) === val
                        ? "bg-cvo-orange text-white border-cvo-orange"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              {/* Fine control: 1–12 columns */}
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={block.cols ?? 6}
                onChange={(e) => onPatch({ cols: Number(e.target.value) })}
                className="w-full accent-cvo-orange"
              />
              <div className="flex justify-between text-[8px] text-gray-400 font-archivo mt-0.5">
                <span>1 kol</span><span>6 kol (½)</span><span>12 kol (vol)</span>
              </div>
            </div>

            <div>
              <Label>Hoogte: {block.heightPx ?? 180}px</Label>
              <input
                type="range"
                min={60}
                max={600}
                step={10}
                value={block.heightPx ?? 180}
                onChange={(e) => onPatch({ heightPx: Number(e.target.value) })}
                className="w-full accent-cvo-orange"
              />
              <div className="flex gap-1 mt-1">
                {([["S", 120], ["M", 180], ["L", 240], ["XL", 320]] as const).map(([lbl, val]) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => onPatch({ heightPx: val })}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase font-archivo transition-colors border border-gray-200 ${
                      (block.heightPx ?? 180) === val ? "bg-cvo-black text-cvo-cream border-cvo-black" : "hover:bg-gray-50 text-gray-400"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tekst uitlijning</Label>
              <div className="flex border-2 border-gray-200 overflow-hidden">
                {([["left", "←  Links"], ["center", "▪  Midden"], ["right", "Rechts  →"]] as const).map(([val, lbl]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onPatch({ textAlign: val })}
                    className={`flex-1 py-2 text-[10px] font-bold font-archivo transition-colors ${
                      (block.textAlign || "left") === val ? "bg-cvo-black text-cvo-cream" : "hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Padding</Label>
              <div className="flex border-2 border-gray-200 overflow-hidden">
                {([["none", "Geen"], ["sm", "Klein"], ["md", "Middel"], ["lg", "Groot"]] as const).map(([val, lbl]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onPatch({ padding: val })}
                    className={`flex-1 py-2 text-[9px] font-bold uppercase font-archivo transition-colors ${
                      (block.padding || "md") === val ? "bg-cvo-black text-cvo-cream" : "hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Rand boven</Label>
              <div className="flex border-2 border-gray-200 overflow-hidden">
                {([["aan", true], ["uit", false]] as const).map(([lbl, val]) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => onPatch({ borderTop: val })}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase font-archivo transition-colors ${
                      Boolean(block.borderTop) === val ? "bg-cvo-black text-cvo-cream" : "hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EditorPanel({ content, onChange, selectedBlockId, onSelectBlock }: EditorPanelProps) {
  const { register, control, watch, setValue, reset } = useForm<MagazineContent>({
    defaultValues: content,
  });

  const { fields: crewFields, append: appendCrew, remove: removeCrew } = useFieldArray({ control, name: "crew" });
  const { fields: eventFields, append: appendEvent, remove: removeEvent } = useFieldArray({ control, name: "events" });
  const { fields: sponsorFields, append: appendSponsor, remove: removeSponsor } = useFieldArray({ control, name: "sponsors" });

  // Prevent inline edits from being overwritten by the form's watch subscription
  const isResetting = React.useRef(false);
  const isFormDriven = React.useRef(false);
  // Live ref to content so the watch closure always merges with latest values
  // (logoX, logoSize, customBlocks are NOT registered in the form)
  const contentRef = React.useRef(content);
  contentRef.current = content;

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (isResetting.current) return;
      isFormDriven.current = true;
      // Preserve out-of-form fields by merging with latest content
      onChange({ ...contentRef.current, ...value } as MagazineContent);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // Sync form when content is changed from inline edits (not from this form)
  React.useEffect(() => {
    if (isFormDriven.current) {
      isFormDriven.current = false;
      return;
    }
    isResetting.current = true;
    reset(content);
    isResetting.current = false;
  }, [content, reset]);

  const setImg = (field: keyof MagazineContent, val: string) => {
    setValue(field as any, val);
    onChange({ ...(watch() as MagazineContent), [field]: val });
  };

  const setFlashImg = (i: number, val: string) => {
    const imgs = [...((watch("flashbackImages") as string[]) || ["", "", ""])];
    imgs[i] = val;
    setValue("flashbackImages", imgs);
    onChange({ ...(watch() as MagazineContent), flashbackImages: imgs });
  };

  const setCrewAvatar = (i: number, val: string) => {
    setValue(`crew.${i}.avatar` as any, val);
    const crew = (watch("crew") as MagazineContent["crew"]).map((m, idx) =>
      idx === i ? { ...m, avatar: val } : m
    );
    onChange({ ...(watch() as MagazineContent), crew });
  };

  const setSponsorLogo = (i: number, val: string) => {
    setValue(`sponsors.${i}.logo` as any, val);
    const sponsors = (watch("sponsors") as MagazineContent["sponsors"]).map((s, idx) =>
      idx === i ? { ...s, logo: val } : s
    );
    onChange({ ...(watch() as MagazineContent), sponsors });
  };

  // ── Block editor mode ──
  const selectedBlock = selectedBlockId
    ? (content.customRows ?? []).flatMap(r => r.cards).find((b) => b.id === selectedBlockId) ?? null
    : null;

  const patchSelectedBlock = (patch: Partial<CustomBlock>) => {
    if (!selectedBlockId) return;
    const newRows = (content.customRows ?? []).map(row => ({
      ...row,
      cards: row.cards.map(card => card.id === selectedBlockId ? { ...card, ...patch } : card),
    }));
    onChange({
      ...content,
      customRows: newRows,
    });
  };

  // ── Row expand/collapse state ──
  const [openRowIds, setOpenRowIds] = React.useState<Set<string>>(new Set());

  const rows = content.customRows ?? [];

  // Auto-open new rows
  React.useEffect(() => {
    setOpenRowIds(prev => {
      const next = new Set(prev);
      rows.forEach(r => next.add(r.id));
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map(r => r.id).join(",")]);

  const toggleRow = (id: string) => setOpenRowIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  if (selectedBlock) {
    return (
      <div className="print:hidden w-full max-w-[440px] shrink-0 h-screen overflow-hidden bg-white border-r-[3px] border-cvo-black flex flex-col font-archivo">
        {/* Header */}
        <div className="px-5 py-4 border-b-[3px] border-cvo-black bg-cvo-black sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cvo-orange flex items-center justify-center font-archivo-black text-xl text-cvo-black shrink-0">
              CVO
            </div>
            <div>
              <h2 className="font-archivo-black text-[18px] uppercase leading-none text-cvo-cream">Blok Bewerken</h2>
              <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest font-archivo">Custom Builder</p>
            </div>
          </div>
        </div>
        <BlockEditor
          block={selectedBlock}
          onPatch={patchSelectedBlock}
          onClose={() => onSelectBlock?.(null)}
        />
      </div>
    );
  }

  return (
    <div className="print:hidden w-full max-w-[440px] shrink-0 h-screen overflow-y-auto bg-white border-r-[3px] border-cvo-black flex flex-col font-archivo">
      {/* Header */}
      <div className="px-5 py-4 border-b-[3px] border-cvo-black bg-cvo-black sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cvo-orange flex items-center justify-center font-archivo-black text-xl text-cvo-black shrink-0">
            CVO
          </div>
          <div>
            <h2 className="font-archivo-black text-[18px] uppercase leading-none text-cvo-cream">Magazine Editor</h2>
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest font-archivo">Alles aanpasbaar</p>
          </div>
        </div>
      </div>

      <form className="flex-1 p-4 space-y-3">

        {/* ── STYLE & LAYOUT ── */}
        <EditorSection icon={<Layout size={15} />} title="Stijl & Layout">
          <div>
            <Label>Template</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {templates.map((t) => (
                <label key={t} className="relative cursor-pointer">
                  <input type="radio" value={t} {...register("template")} className="absolute opacity-0 w-0 h-0" />
                  <div className={`px-2 py-2 text-center border-2 text-[11px] font-bold uppercase tracking-tight transition-colors font-archivo ${watch("template") === t ? "border-cvo-orange bg-cvo-orange text-cvo-cream" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                    {t}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Logo positie</Label>
              <div className="flex border-2 border-gray-200 overflow-hidden">
                {["Top", "Bottom"].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => onChange({ ...(watch() as MagazineContent), logoPosition: pos as "Top" | "Bottom" })}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase font-archivo transition-colors ${watch("logoPosition") === pos ? "bg-cvo-black text-cvo-cream" : "hover:bg-gray-50 text-gray-500"}`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Kleurschema</Label>
              {/* Visual swatch picker — design.md brand colors */}
              <div className="flex gap-1.5 mt-1">
                {([
                  { value: "Orange", bg: "#F15B2B", border: "#1A1A1A", label: "Oranje" },
                  { value: "Black",  bg: "#1A1A1A", border: "#1A1A1A", label: "Zwart"  },
                  { value: "Mint",   bg: "#ACDCCE", border: "#1A1A1A", label: "Mint"   },
                  { value: "Cream",  bg: "#FEFDED", border: "#1A1A1A", label: "Cream"  },
                ] as const).map(({ value, bg, border, label }) => {
                  const active = watch("logoColor") === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      title={label}
                      onClick={() => onChange({ ...(watch() as MagazineContent), logoColor: value })}
                      className="flex flex-col items-center gap-1 flex-1 py-2 transition-all"
                      style={{
                        border: active ? `2px solid ${border}` : "2px solid #e5e7eb",
                        background: active ? "#f9f9f9" : "white",
                        cursor: "pointer",
                        outline: active ? "2px solid #F15B2B" : "none",
                        outlineOffset: -4,
                      }}
                    >
                      <div style={{ width: 22, height: 22, background: bg, border: "1px solid rgba(0,0,0,0.12)" }} />
                      <span className={`text-[8px] uppercase tracking-wide font-archivo ${active ? "font-bold text-cvo-black" : "text-gray-400"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </EditorSection>

        {/* ── BASIS INFO ── */}
        <EditorSection icon={<Info size={15} />} title="Basis Info">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Editie</Label><input {...register("edition")} className={inputCls} /></div>
            <div><Label>Stad</Label><input {...register("city")} className={inputCls} /></div>
            <div><Label>Maand</Label><input {...register("month")} className={inputCls} /></div>
            <div><Label>Jaar</Label><input {...register("year")} className={inputCls} /></div>
          </div>
          <div><Label>Banner onderwerpen (bv. Clubnights — Crew)</Label><input {...register("bannerText")} className={inputCls} /></div>
        </EditorSection>

        {/* ── OVER ONS ── */}
        <EditorSection icon={<Building2 size={15} />} title="Logo & Bedrijfstekst">

          {/* Logo grootte + padding — zij aan zij */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Logo grootte: {watch("logoSize") ?? 90}px</Label>
              <input
                type="range" min={30} max={200} step={5}
                {...register("logoSize", { valueAsNumber: true })}
                className="w-full accent-cvo-orange"
              />
              <div className="flex justify-between text-[8px] text-gray-400 font-archivo mt-0.5">
                <span>30</span><span>90</span><span>200</span>
              </div>
            </div>
            <div>
              <Label>Ruimte rondom: {watch("logoPadding") ?? 8}px</Label>
              <input
                type="range" min={-25} max={60} step={1}
                {...register("logoPadding", { valueAsNumber: true })}
                className="w-full accent-cvo-orange"
              />
              <div className="flex justify-between text-[8px] text-gray-400 font-archivo mt-0.5">
                <span>-25</span><span>0</span><span>60</span>
              </div>
            </div>
          </div>

          {/* Beschrijving */}
          <div>
            <Label>Tekst onder logo (max. 2 zinnen)</Label>
            <textarea
              {...register("companyDescription")}
              rows={3}
              placeholder="CLUBvanONS is een urban living lab in Breda..."
              className={textareaCls}
            />
          </div>
        </EditorSection>

        {/* ── CREW ── */}
        <EditorSection icon={<Users size={15} />} title="Meet the Crew">
          <div>
            <Label>Intro tekst</Label>
            <textarea {...register("crewTeaser")} rows={3} className={textareaCls} />
          </div>
          <div className="space-y-2">
            {crewFields.map((field, index) => (
              <div key={field.id} className="border-2 border-gray-100 p-3 space-y-2">
                <div className="flex gap-3 items-start">
                  <ImgUpload
                    label="foto"
                    src={watch(`crew.${index}.avatar` as any) as string}
                    onUpload={(v) => setCrewAvatar(index, v)}
                    className="w-14 h-14 shrink-0"
                    circle
                  />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <input {...register(`crew.${index}.name`)} placeholder="Naam" className={inputCls} />
                    <input {...register(`crew.${index}.role`)} placeholder="Rol" className={inputCls} />
                  </div>
                  <button type="button" onClick={() => removeCrew(index)} className="p-1.5 text-red-300 hover:text-red-500 shrink-0 mt-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendCrew({ name: "", role: "Crew" })}
            className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-cvo-black hover:text-cvo-black text-[10px] font-bold uppercase tracking-wider transition-colors font-archivo flex items-center justify-center gap-1"
          >
            <Plus size={12} /> Crew lid toevoegen
          </button>
        </EditorSection>

        {/* ── TERUGBLIK ── */}
        <EditorSection icon={<Newspaper size={15} />} title="Terugblik">
          <div><Label>Headline</Label><input {...register("flashbackHeadline")} className={inputCls} /></div>
          <div><Label>Tekst</Label><textarea {...register("flashbackBody")} rows={3} className={textareaCls} /></div>
          <div>
            <Label>Foto&apos;s (3 stuks)</Label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <ImgUpload
                  key={i}
                  label={`foto ${i + 1}`}
                  src={(watch("flashbackImages") as string[])?.[i] || ""}
                  onUpload={(v) => setFlashImg(i, v)}
                  className="aspect-[4/3]"
                />
              ))}
            </div>
          </div>
        </EditorSection>

        {/* ── HOOFDARTIKEL ── */}
        <EditorSection icon={<Type size={15} />} title="Hoofdartikel">
          <div><Label>Headline</Label><input {...register("mainFeatureHeadline")} className={inputCls} /></div>
          <div><Label>Tekst</Label><textarea {...register("mainFeatureBody")} rows={3} className={textareaCls} /></div>
          <div>
            <Label>Hoofdfoto</Label>
            <ImgUpload
              label="hoofdfoto uploaden"
              src={watch("mainFeatureImage") as string}
              onUpload={(v) => setImg("mainFeatureImage", v)}
              className="w-full aspect-[4/3]"
            />
          </div>
        </EditorSection>

        {/* ── BUURTPOST ── */}
        <EditorSection icon={<MapPin size={15} />} title="Buurtpost — Uit de Wijk">
          <div><Label>Headline</Label><input {...register("buurtpostHeadline")} className={inputCls} /></div>
          <div><Label>Tekst</Label><textarea {...register("buurtpostBody")} rows={3} className={textareaCls} /></div>
          <div>
            <Label>Foto</Label>
            <ImgUpload
              label="foto uploaden"
              src={watch("buurtpostImage") as string}
              onUpload={(v) => setImg("buurtpostImage", v)}
              className="w-full aspect-square"
            />
          </div>
        </EditorSection>

        {/* ── DE NIGHTS ── */}
        <EditorSection icon={<Calendar size={15} />} title="De Nights — Agenda">
          <div className="space-y-2">
            {eventFields.map((field, index) => (
              <div key={field.id} className="border-2 border-gray-100 p-3 space-y-2">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                  <div><Label>Dag</Label><input {...register(`events.${index}.day`)} placeholder="XX" className={inputCls} /></div>
                  <div><Label>Maand</Label><input {...register(`events.${index}.month`)} placeholder="MRT" className={inputCls} /></div>
                  <button type="button" onClick={() => removeEvent(index)} className="p-2 text-red-300 hover:text-red-500 mb-[2px]">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div><Label>Eventnaam</Label><input {...register(`events.${index}.title`)} placeholder="Clubnight #01" className={inputCls} /></div>
                <div><Label>Locatie & tijd</Label><input {...register(`events.${index}.detail`)} placeholder="locatie — aanvangstijd" className={inputCls} /></div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendEvent({ day: "XX", month: "MRT", title: "", detail: "" })}
            className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-cvo-black hover:text-cvo-black text-[10px] font-bold uppercase tracking-wider transition-colors font-archivo flex items-center justify-center gap-1"
          >
            <Plus size={12} /> Event toevoegen
          </button>
        </EditorSection>

        {/* ── PAK DE MIC ── */}
        <EditorSection icon={<Mic size={15} />} title="Pak de Mic">
          <div>
            <Label>Tekst</Label>
            <textarea {...register("pakDeMicText")} rows={4} className={textareaCls} />
          </div>
        </EditorSection>

        {/* ── STAKEHOLDERS ── */}
        <EditorSection icon={<HeartHandshake size={15} />} title="Stakeholders / Sponsors">
          <div className="space-y-2">
            {sponsorFields.map((field, index) => (
              <div key={field.id} className="border-2 border-gray-100 p-3">
                <div className="flex gap-3 items-center">
                  <ImgUpload
                    label="logo"
                    src={watch(`sponsors.${index}.logo` as any) as string}
                    onUpload={(v) => setSponsorLogo(index, v)}
                    className="w-16 h-10 shrink-0"
                  />
                  <input {...register(`sponsors.${index}.name`)} placeholder="Stakeholder naam" className={`${inputCls} flex-1`} />
                  <button type="button" onClick={() => removeSponsor(index)} className="p-1.5 text-red-300 hover:text-red-500 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendSponsor({ name: "" })}
            className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-cvo-black hover:text-cvo-black text-[10px] font-bold uppercase tracking-wider transition-colors font-archivo flex items-center justify-center gap-1"
          >
            <Plus size={12} /> Stakeholder toevoegen
          </button>
        </EditorSection>

        <div className="h-6" />
      </form>

      {/* ── STICKY CUSTOM BUILDER — always visible when Custom template is active ── */}
      {watch("template") === "Custom" && (() => {
        const styleDots: Record<string, string> = {
          black: "#1a1a1a", orange: "#F15B2B", mint: "#ACDCCE", cream: "#FEFDED", transparent: "transparent",
        };
        const typeLabel: Record<string, string> = {
          poster: "Poster", text: "Tekst", image: "Foto", split: "Split", quote: "Quote", divider: "Divider",
          events: "Agenda", pakdemic: "Pak de Mic", crew: "Crew", buurtpost: "Buurtpost", terugblik: "Terugblik", joinus: "Join Ons",
        };
        const styleLabel: Record<string, string> = {
          black: "Zwart", orange: "Accent", mint: "Mint", cream: "Licht", transparent: "Doorz.",
        };

        const patchRows = (newRows: CustomRow[]) =>
          onChange({
            ...contentRef.current,
            ...(watch() as Partial<MagazineContent>),
            customRows: newRows,
          });

        const addRow = (numCards: number) => {
          const styleOptions: CustomBlock["style"][] = ["black", "orange", "mint", "cream"];
          const cards: CustomBlock[] = Array.from({ length: numCards }, (_, i) => ({
            id: Date.now().toString() + i + Math.random().toString(36).slice(2, 5),
            cols: 6,
            heightPx: 180,
            style: styleOptions[Math.floor(Math.random() * styleOptions.length)],
            contentType: "poster" as const,
            headline: "BIG TITLE",
            headlineSize: 28,
            body: "Jouw tekst hier...",
            bodySize: 10,
            tag: "",
            image: "",
            imagePosition: "left" as const,
            imageSize: 100,
            imageFit: "cover" as const,
            imageOpacity: 100,
            textAlign: "left" as const,
            uppercase: true,
            italic: false,
            padding: "md" as const,
            borderTop: false,
          }));
          const newRow: CustomRow = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
            heightPx: 180,
            cards,
          };
          patchRows([...rows, newRow]);
        };

        const deleteRow = (rowIdx: number) =>
          patchRows(rows.filter((_, i) => i !== rowIdx));

        const updateRowHeight = (rowIdx: number, heightPx: number) =>
          patchRows(rows.map((r, i) => i === rowIdx ? { ...r, heightPx } : r));

        const addCardToRow = (rowIdx: number) => {
          if (rows[rowIdx].cards.length >= 4) return;
          const styleOptions: CustomBlock["style"][] = ["black", "orange", "mint", "cream"];
          const newCard: CustomBlock = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
            cols: 6,
            heightPx: 180,
            style: styleOptions[Math.floor(Math.random() * styleOptions.length)],
            contentType: "poster",
            headline: "BIG TITLE",
            headlineSize: 28,
            body: "Jouw tekst hier...",
            bodySize: 10,
            tag: "",
            image: "",
            imagePosition: "left",
            imageSize: 100,
            imageFit: "cover",
            imageOpacity: 100,
            textAlign: "left",
            uppercase: true,
            italic: false,
            padding: "md",
            borderTop: false,
          };
          patchRows(rows.map((r, i) => i === rowIdx ? { ...r, cards: [...r.cards, newCard] } : r));
        };

        const deleteCard = (rowIdx: number, cardIdx: number) => {
          const newRows = rows.map((r, i) => {
            if (i !== rowIdx) return r;
            const cards = r.cards.filter((_, ci) => ci !== cardIdx);
            return { ...r, cards };
          }).filter(r => r.cards.length > 0);
          patchRows(newRows);
        };

        const shuffleCard = (rowIdx: number, cardIdx: number) => {
          const styleOptions: CustomBlock["style"][] = ["black", "orange", "mint", "cream"];
          const newStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
          patchRows(rows.map((r, ri) =>
            ri !== rowIdx ? r : {
              ...r,
              cards: r.cards.map((c, ci) => ci !== cardIdx ? c : { ...c, style: newStyle }),
            }
          ));
        };

        return (
          <div className="sticky bottom-0 z-20 bg-white border-t-[3px] border-cvo-black shadow-[0_-4px_0_#1a1a1a]">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2 bg-cvo-black">
              <Layers size={13} className="text-cvo-orange shrink-0" />
              <span className="font-archivo-black text-[12px] uppercase text-cvo-cream tracking-wide flex-1">Custom Builder</span>
              <span className="text-[9px] text-gray-500 font-archivo">{rows.length} rij{rows.length !== 1 ? "en" : ""}</span>
            </div>

            {/* Add row buttons */}
            <div className="border-b-[2px] border-gray-100 px-3 py-2">
              <div className="text-[9px] text-gray-400 font-archivo uppercase tracking-widest mb-1.5">+ Rij toevoegen</div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => addRow(n)}
                    className="flex flex-col items-center justify-center gap-0.5 py-2.5 border-2 border-dashed border-gray-200 hover:border-cvo-orange hover:text-cvo-orange text-gray-400 transition-colors group"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: n }).map((_, i) => (
                        <div key={i} className="w-3 h-4 bg-current opacity-40 group-hover:opacity-100 rounded-sm" />
                      ))}
                    </div>
                    <span className="text-[8px] font-bold uppercase font-archivo">{n === 1 ? "Vol" : `${n}×`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row list */}
            <div className="max-h-[260px] overflow-y-auto divide-y divide-gray-100">
              {rows.length === 0 && (
                <p className="text-[10px] text-gray-400 font-archivo text-center py-3 italic">Nog geen rijen — voeg er een toe hierboven.</p>
              )}
              {rows.map((row, rowIdx) => {
                const isOpen = openRowIds.has(row.id);
                return (
                  <div key={row.id}>
                    {/* Row header */}
                    <div
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer select-none"
                      onClick={() => toggleRow(row.id)}
                    >
                      <ChevronDown size={12} className={`text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                      <span className="text-[10px] font-bold text-cvo-black font-archivo flex-1">
                        Rij {rowIdx + 1} — {row.cards.length} kaart{row.cards.length !== 1 ? "en" : ""}
                      </span>
                      {/* Height control */}
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <span className="text-[9px] text-gray-400 font-archivo">H:</span>
                        <input
                          type="number"
                          min={60}
                          max={600}
                          step={10}
                          value={row.heightPx}
                          onChange={e => updateRowHeight(rowIdx, Number(e.target.value))}
                          className="w-14 text-[10px] border border-gray-200 px-1 py-0.5 font-archivo text-center"
                          onClick={e => e.stopPropagation()}
                        />
                        <span className="text-[9px] text-gray-400 font-archivo">px</span>
                      </div>
                      {/* Add card */}
                      {row.cards.length < 4 && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); addCardToRow(rowIdx); }}
                          className="p-1 text-gray-400 hover:text-cvo-orange transition-colors"
                          title="Kaart toevoegen"
                        >
                          <Plus size={12} />
                        </button>
                      )}
                      {/* Delete row */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); deleteRow(rowIdx); }}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        title="Rij verwijderen"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Cards (expanded) */}
                    {isOpen && (
                      <div className="pl-4 bg-white divide-y divide-gray-50">
                        {row.cards.map((card, cardIdx) => (
                          <div key={card.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50">
                            <div
                              className="w-3 h-3 rounded-sm shrink-0 border border-gray-200"
                              style={{ background: styleDots[card.style] }}
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-cvo-black font-archivo truncate block">
                                {card.headline || typeLabel[card.contentType]}
                              </span>
                              <span className="text-[8px] text-gray-400 font-archivo">
                                {typeLabel[card.contentType]} · {styleLabel[card.style]}
                              </span>
                            </div>
                            {/* Content type selector */}
                            <select
                              value={card.contentType}
                              onChange={e => {
                                e.stopPropagation();
                                patchRows(rows.map((r, ri) =>
                                  ri !== rowIdx ? r : {
                                    ...r,
                                    cards: r.cards.map((c, ci) =>
                                      ci !== cardIdx ? c : { ...c, contentType: e.target.value as CustomBlock["contentType"] }
                                    ),
                                  }
                                ));
                              }}
                              onClick={e => e.stopPropagation()}
                              className="text-[9px] border border-gray-200 py-0.5 px-0.5 font-archivo bg-white"
                            >
                              {Object.entries(typeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                            {/* Shuffle style */}
                            <button
                              type="button"
                              onClick={() => shuffleCard(rowIdx, cardIdx)}
                              className="p-1 text-gray-300 hover:text-cvo-orange transition-colors"
                              title="Shuffle stijl"
                            >
                              <Shuffle size={11} />
                            </button>
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => onSelectBlock?.(card.id)}
                              className="p-1 text-gray-300 hover:text-cvo-orange transition-colors"
                              title="Bewerken"
                            >
                              <span className="text-[10px]">✎</span>
                            </button>
                            {/* Delete card */}
                            <button
                              type="button"
                              onClick={() => deleteCard(rowIdx, cardIdx)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Canvas settings */}
            <div className="px-3 py-2 border-t-[2px] border-gray-100 space-y-1.5 bg-gray-50">
              <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 font-archivo">Canvas</div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="text-[9px] text-gray-500 font-archivo mb-0.5">Marge: {content.customPadding ?? 0}px</div>
                  <input
                    type="range" min={0} max={40} step={2}
                    value={content.customPadding ?? 0}
                    onChange={(e) => onChange({ ...contentRef.current, ...(watch() as Partial<MagazineContent>), customPadding: Number(e.target.value) })}
                    className="w-full accent-cvo-orange h-1"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[9px] text-gray-500 font-archivo mb-0.5">Tussenruimte: {content.customGap ?? 0}px</div>
                  <input
                    type="range" min={0} max={16} step={1}
                    value={content.customGap ?? 0}
                    onChange={(e) => onChange({ ...contentRef.current, ...(watch() as Partial<MagazineContent>), customGap: Number(e.target.value) })}
                    className="w-full accent-cvo-orange h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
