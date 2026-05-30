"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { saveFeatures } from "@/lib/storage";
import { Feature } from "@/types";

export default function ImportPage() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  async function handleImport() {
    setState("loading");
    try {
      const res = await fetch("/canny_import.json");
      const data: Feature[] = await res.json();
      saveFeatures(data);
      setCount(data.length);
      setState("done");
      setTimeout(() => { window.location.href = "/ranking"; }, 2000);
    } catch {
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
          Se cargarán <strong>109 funcionalidades</strong> exportadas de Canny con sus votos y estatus originales.
          <br /><br />
          <span className="text-amber-600 font-medium">⚠️ Esto reemplazará los datos actuales.</span>
        </p>

        {state === "idle" && (
          <button onClick={handleImport}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
            Importar 109 funcionalidades
          </button>
        )}

        {state === "loading" && (
          <div className="flex items-center justify-center gap-2 text-brand-600 font-medium">
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Importando...
          </div>
        )}

        {state === "done" && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            ✅ {count} funcionalidades importadas. Redirigiendo...
          </div>
        )}

        {state === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
            <AlertCircle className="w-5 h-5" />
            Error al importar. Intenta de nuevo.
          </div>
        )}
      </div>
    </div>
  );
}
