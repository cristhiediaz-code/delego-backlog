"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, GripHorizontal } from "lucide-react";
import { useFeatures } from "@/lib/context";
import { Category, WebSubcategory } from "@/types";
import { CATEGORIES, WEB_SUBCATEGORIES } from "@/lib/constants";

export function NewFeatureModal() {
  const { addFeature } = useFeatures();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customer, setCustomer] = useState("");
  const [category, setCategory] = useState<Category>("Otro");
  const [subcategory, setSubcategory] = useState<WebSubcategory | "">("");
  const [tagsInput, setTagsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const rect = modalRef.current!.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y });
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "El título es requerido.";
    if (!description.trim()) e.description = "La descripción es requerida.";
    if (!customer.trim()) e.customer = "El cliente es requerido.";
    if (category === "Web" && !subcategory) e.subcategory = "Selecciona una subcategoría.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    addFeature({
      title: title.trim(), description: description.trim(), customer: customer.trim(),
      category, subcategory: category === "Web" ? (subcategory as WebSubcategory) : undefined, tags,
    });
    reset();
  }

  function reset() {
    setTitle(""); setDescription(""); setCustomer(""); setCategory("Otro");
    setSubcategory(""); setTagsInput(""); setErrors({}); setPos(null); setOpen(false);
  }

  const modalStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, transform: "none" }
    : { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors shadow-sm">
        <Plus className="w-4 h-4" />
        Nueva funcionalidad
      </button>

      {mounted && open && createPortal(
        <>
          <div onClick={reset} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
          <div ref={modalRef} style={{ position: "fixed", zIndex: 9999, width: "min(32rem, calc(100vw - 2rem))", maxHeight: "calc(100vh - 4rem)", background: "white", borderRadius: "1rem", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column", ...modalStyle }}>
            <div onMouseDown={onMouseDown} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem 0.75rem", borderBottom: "1px solid #f0f0f0", cursor: "grab", userSelect: "none", flexShrink: 0 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "#111" }}>Nueva funcionalidad</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GripHorizontal style={{ width: 16, height: 16, color: "#ccc" }} />
                <button onClick={reset} onMouseDown={(e) => e.stopPropagation()} style={{ color: "#999", cursor: "pointer", background: "none", border: "none", padding: 4 }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>

            <div style={{ padding: "1.25rem 1.5rem 1.5rem", overflowY: "auto", flex: 1 }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Field label="Título" error={errors.title} required>
                  <input value={title} onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
                    placeholder="Ej: Integración con Salesforce" className="input" />
                </Field>

                <Field label="Descripción" error={errors.description} required>
                  <textarea rows={3} value={description} onChange={(e) => { setDescription(e.target.value); setErrors(p => ({ ...p, description: "" })); }}
                    placeholder="Describe qué problema resuelve..." className="input" style={{ resize: "none" }} />
                </Field>

                <Field label="Cliente solicitante" error={errors.customer} required>
                  <input value={customer} onChange={(e) => { setCustomer(e.target.value); setErrors(p => ({ ...p, customer: "" })); }}
                    placeholder="Ej: Acme Corp" className="input" />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: category === "Web" ? "1fr 1fr" : "1fr", gap: "1rem" }}>
                  <Field label="Categoría">
                    <select value={category} onChange={(e) => { setCategory(e.target.value as Category); setSubcategory(""); setErrors(p => ({ ...p, subcategory: "" })); }} className="input">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>

                  {category === "Web" && (
                    <Field label="Subcategoría" error={errors.subcategory} required>
                      <select value={subcategory} onChange={(e) => { setSubcategory(e.target.value as WebSubcategory); setErrors(p => ({ ...p, subcategory: "" })); }} className="input">
                        <option value="">Selecciona...</option>
                        {WEB_SUBCATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  )}
                </div>

                <Field label="Tags" hint="Separados por coma">
                  <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="api, mobile, prioridad-alta" className="input" />
                </Field>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8 }}>
                  <button type="button" onClick={reset} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 14 }}>Cancelar</button>
                  <button type="submit" style={{ padding: "0.5rem 1.25rem", borderRadius: 8, background: "#4f6ef7", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Crear funcionalidad</button>
                </div>
              </form>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function Field({ label, error, hint, required, children }: { label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
        {hint && <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>({hint})</span>}
      </label>
      {children}
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
