"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { MagazineContent, TemplateType, CustomBlock } from "./MagazinePreview";
import {
  Trash2, Plus, Type, Users, Calendar, Newspaper,
  MapPin, Info, Layout, Image as ImageIcon, Mic,
  HeartHandshake, ChevronDown, Building2, Shuffle, Layers
} from "lucide-react";

interface EditorPanelProps {
  content: MagazineContent;
  onChange: (content: MagazineContent) => void;
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

export default function EditorPanel({ content, onChange }: EditorPanelProps) {
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
              <select {...register("logoColor")} className={inputCls} style={{ padding: "7px 8px" }}>
                <option value="Orange">Oranje (default)</option>
                <option value="Black">Monochroom</option>
                <option value="Green">Groen</option>
                <option value="Gold">Goud</option>
              </select>
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
        <EditorSection icon={<Building2 size={15} />} title="Over Ons (onder logo)">
          <div>
            <Label>Beschrijving (2 zinnen)</Label>
            <textarea {...register("companyDescription")} rows={2} className={textareaCls} />
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
        const blocks = content.customBlocks ?? [];
        const styleDots: Record<string, string> = {
          black: "#1a1a1a", orange: "#F15B2B", mint: "#ACDCCE", cream: "#FEFDED",
        };
        const typeLabel: Record<string, string> = { poster: "Poster", text: "Tekst", image: "Foto", split: "Split" };

        const patchBlocks = (newBlocks: typeof blocks) =>
          onChange({ ...contentRef.current, ...(watch() as Partial<MagazineContent>), customBlocks: newBlocks });

        const updateBlock = (idx: number, patch: Partial<CustomBlock>) =>
          patchBlocks(blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b)));

        const addBlock = (type: CustomBlock["contentType"]) => {
          const styles: CustomBlock["style"][] = ["black", "orange", "mint", "cream"];
          const newBlock: CustomBlock = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
            widthPct: 50,
            heightPx: 180,
            style: styles[Math.floor(Math.random() * styles.length)],
            contentType: type,
            headline: type === "poster" ? "BIG TITLE" : "Nieuwe Sectie",
            body: "Jouw tekst hier...",
            image: "",
          };
          patchBlocks([...blocks, newBlock]);
        };

        return (
          <div className="sticky bottom-0 z-20 bg-white border-t-[3px] border-cvo-black shadow-[0_-4px_0_#1a1a1a]">
            {/* Header bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-cvo-black">
              <Layers size={13} className="text-cvo-orange" />
              <span className="font-archivo-black text-[12px] uppercase text-cvo-cream tracking-wide flex-1">Custom Builder</span>
              <span className="text-[9px] text-gray-500 font-archivo">{blocks.length} kaartje{blocks.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Add buttons — always on top, prominent */}
            <div className="grid grid-cols-4 divide-x-[2px] divide-gray-100 border-b-[2px] border-gray-100">
              {(["poster", "text", "image", "split"] as const).map((type) => {
                const icons: Record<string, string> = { poster: "🅰", text: "📝", image: "🖼", split: "▪" };
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="flex flex-col items-center justify-center gap-0.5 py-2.5 hover:bg-cvo-orange hover:text-white text-gray-500 transition-colors group"
                  >
                    <Plus size={13} className="group-hover:text-white text-cvo-orange" />
                    <span className="text-[9px] font-bold uppercase tracking-wide font-archivo">{typeLabel[type]}</span>
                  </button>
                );
              })}
            </div>

            {/* Block list (scrollable if many) */}
            {blocks.length > 0 && (
              <div className="max-h-[200px] overflow-y-auto divide-y divide-gray-100">
                {blocks.map((block, idx) => (
                  <div key={block.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                    <div
                      className="w-3.5 h-3.5 shrink-0 rounded-sm border border-gray-300"
                      style={{ background: styleDots[block.style] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-cvo-black font-archivo truncate">{block.headline || "—"}</div>
                      <div className="text-[9px] text-gray-400 font-archivo">{typeLabel[block.contentType]} · {Math.round(block.widthPct)}%</div>
                    </div>
                    {/* Height */}
                    <select
                      value={block.heightPx}
                      onChange={(e) => updateBlock(idx, { heightPx: Number(e.target.value) })}
                      className="text-[9px] border border-gray-200 py-0.5 px-0.5 font-archivo bg-white"
                    >
                      <option value={120}>S</option>
                      <option value={180}>M</option>
                      <option value={240}>L</option>
                      <option value={300}>XL</option>
                    </select>
                    {/* Style */}
                    <select
                      value={block.style}
                      onChange={(e) => updateBlock(idx, { style: e.target.value as CustomBlock["style"] })}
                      className="text-[9px] border border-gray-200 py-0.5 px-0.5 font-archivo bg-white"
                    >
                      <option value="black">Zwart</option>
                      <option value="orange">Accent</option>
                      <option value="mint">Mint</option>
                      <option value="cream">Licht</option>
                    </select>
                    {/* Shuffle */}
                    <button
                      type="button"
                      onClick={() => {
                        const s: CustomBlock["style"][] = ["black", "orange", "mint", "cream"];
                        updateBlock(idx, { style: s[Math.floor(Math.random() * s.length)] });
                      }}
                      className="p-1 text-gray-300 hover:text-cvo-orange transition-colors"
                      title="Shuffle stijl"
                    >
                      <Shuffle size={12} />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => patchBlocks(blocks.filter((_, i) => i !== idx))}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="px-3 py-1.5 text-[8.5px] text-gray-400 font-archivo text-center border-t border-gray-100">
              Sleep de rechterrand van een kaartje om de breedte te wijzigen
            </div>
          </div>
        );
      })()}
    </div>
  );
}
