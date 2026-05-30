"use client";

import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Feature } from "@/types";

export default function ImportPage() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);
  const [log, setLog] = useState("");

  async function handleImport() {
    setState("loading");
    setLog("Cargando datos...");
    try {
      const res = await fetch("/canny_import.json");
      const data: Feature[] = await res.json();

      // Clear existing data
      setLog("Limpiando datos anteriores...");
      await supabase.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("features").delete().neq("id", "");

      // Insert features in batches of 20
      const features = data.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        customer: f.customer,
        category: f.category,
        subcategory: f.subcategory ?? null,
        tags: f.tags,
        status: f.status,
        created_at: f.createdAt,
      }));

      setLog(`Insertando ${features.length} funcionalidades...`);
      for (let i = 0; i < features.length; i += 20) {
        await supabase.from("features").insert(features.slice(i, i + 20));
      }

      // Insert votes
      const votes = data.flatMap((f) =>
        f.votes.map((v) => ({ feature_id: f.id, customer: v.customer, voted_at: v.votedAt }))
      );

      setLog(`Insertando ${votes.length} votos...`);
      for (let i = 0; i < votes.length; i += 50) {
        await supabase.from("votes").insert(votes.slice(i, i + 50));
      }

      setCount(data.length);
      setState("done");
      setLog("");
      setTimeout(() => { window.location.href = "/ranking"; }, 2000);
    } catch (e) {
      console.error(e);
      setState("error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 text-center space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-4">
        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto">
          <Upload className="w-7 h-7 text-brand-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Importar desde Canny</h1>
        <p className="text-gray-500 text-sm">
          Se cargarán <strong>109 funcionalidades</strong> a la base de datos compartida.
          Todos los usuarios verán los mismos datos.
          <br /><br />
          <span className="text-amber-600 font-medium">⚠️ Esto reemplazará los datos actuales en la base de datos.</span>
        </p>

        {state === "idle" && (
          <button onClick={handleImport} className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
            Importar 109 funcionalidades
          </button>
        )}

        {state === "loading" && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-brand-600 font-medium">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              Importando...
            </div>
            {log && <p className="text-xs text-gray-400">{log}</p>}
          </div>
        )}

        {state === "done" && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            ✅ {count} funcionalidades importadas. Redirigiendo...
          </div>
        )}

        {state === "error" && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
              <AlertCircle className="w-5 h-5" />
              Error al importar.
            </div>
            <button onClick={() => setState("idle")} className="text-sm text-brand-500 underline">Intentar de nuevo</button>
          </div>
        )}
      </div>
    </div>
  );
}
