"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, GripHorizontal, Trash2, UserPlus } from "lucide-react";
import { useFeatures } from "@/lib/context";
import { Category, Feature, Status, WebSubcategory } from "@/types";
import { CATEGORIES, STATUSES, WEB_SUBCATEGORIES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

interface Props { feature: Feature; onClose: () => void; }

export function EditFeatureModal({ feature, onClose }: Props) {
  const { updateFeature, refresh } = useFeatures();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(feature.title);
  const [description, setDescription] = useState(feature.description);
  const [customer, setCustomer] = useState(feature.customer);
  const [category, setCategory] = useState<Category>(feature.category);
  const [subcategory, setSubcategory] = useState<WebSubcategory | "">(feature.subcategory ?? "");
  const [status, setStatus] = useState<Status>(feature.status);
  const [tagsInput, setTagsInput] = useState(feature.tags.join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Voters state — editable list
  const [voters, setVoters] = useState<string[]>(feature.votes.map((v) => v.customer));
  const [newVoter, setNewVoter] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "El título es requerido.";
    if (!description.trim()) errs.description = "La descripción es requerida.";
    if (!customer.trim()) errs.customer = "El cliente es requerido.";
    if (category === "Web" && !subcategory) errs.subcategory = "Selecciona una subcategoría.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

    // 1. Update feature fields
    await updateFeature(feature.id, {
      title: title.trim(), description: description.trim(), customer: customer.trim(),
      category, subcategory: category === "Web" ? (subcategory as WebSubcategory) : undefined,
      status, tags,
    });

    // 2. Replace votes: delete all then insert new list
    await supabase.from("votes").delete().eq("feature_id", feature.id);
    if (voters.filter(v => v.trim()).length > 0) {
      await supabase.from("votes").insert(
        voters.filter(v => v.trim()).map((v) => ({
          feature_id: feature.id,
          customer: v.trim(),
          voted_at: new Date().toISOString(),
        }))
      );
    }

    // 3. Refresh once after everything is saved
    await refresh();
    onClose();
  }

  function addVoter() {
    const name = newVoter.trim();
    if (!name) return;
    setVoters((prev) => [...prev, name]);
    setNewVoter("");
  }

  function updateVoter(index: number, value: string) {
    setVoters((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function removeVoter(index: number) {
    setVoters((prev) => prev.filter((_, i) => i !== index));
  }

  const modalStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, transform: "none" }
    : { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

  if (!mounted) return null;

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
      <div ref={modalRef} style={{ position: "fixed", zIndex: 9999, width: "min(36rem, calc(100vw - 2rem))", maxHeight: "calc(100vh - 4rem)", background: "white", borderRadius: "1rem", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column", ...modalStyle }}>

        {/* Header */}
        <div onMouseDown={onMouseDown} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem 0.75rem", borderBottom: "1px solid #f0f0f0", cursor: "grab", userSelect: "none", flexShrink: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "#111" }}>Editar funcionalidad</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GripHorizontal style={{ width: 16, height: 16, color: "#ccc" }} />
            <button onClick={onClose} onMouseDown={(e) => e.stopPropagation()} style={{ color: "#999", cursor: "pointer", background: "none", border: "none", padding: 4 }}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem", overflowY: "auto", flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <Field label="Título" error={errors.title} required>
              <input value={title} onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }} className="input" />
            </Field>

            <Field label="Descripción" error={errors.description} required>
              <textarea rows={3} value={description} onChange={(e) => { setDescription(e.target.value); setErrors(p => ({ ...p, description: "" })); }} className="input" style={{ resize: "none" }} />
            </Field>

            <Field label="Cliente solicitante" error={errors.customer} required>
              <input value={customer} onChange={(e) => { setCustomer(e.target.value); setErrors(p => ({ ...p, customer: "" })); }} className="input" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Categoría">
                <select value={category} onChange={(e) => { setCategory(e.target.value as Category); setSubcategory(""); }} className="input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Estatus">
                <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="input">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            {category === "Web" && (
              <Field label="Subcategoría" error={errors.subcategory} required>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value as WebSubcategory)} className="input">
                  <option value="">Selecciona...</option>
                  {WEB_SUBCATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            )}

            <Field label="Tags" hint="Separados por coma">
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="api, mobile, prioridad-alta" className="input" />
            </Field>

            {/* Voters section */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "1rem" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Clientes que votaron ({voters.length})
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                {voters.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 6 }}>
                    <input
                      value={v}
                      onChange={(e) => updateVoter(i, e.target.value)}
                      className="input"
                      style={{ flex: 1 }}
                      placeholder={`Cliente ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeVoter(i)}
                      style={{ padding: "0 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add new voter */}
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={newVoter}
                  onChange={(e) => setNewVoter(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVoter(); } }}
                  placeholder="Agregar cliente..."
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addVoter}
                  style={{ padding: "0 12px", borderRadius: 8, border: "1px solid #dce8ff", background: "#f0f4ff", color: "#4f6ef7", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500 }}
                >
                  <UserPlus style={{ width: 14, height: 14 }} />
                  Agregar
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8 }}>
              <button type="button" onClick={onClose} style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 14 }}>Cancelar</button>
              <button type="submit" style={{ padding: "0.5rem 1.25rem", borderRadius: 8, background: "#4f6ef7", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Guardar cambios</button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
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
