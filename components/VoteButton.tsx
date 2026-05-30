"use client";

import { useState } from "react";
import { ThumbsUp, X } from "lucide-react";
import { useFeatures } from "@/lib/context";

export function VoteButton({ featureId, voteCount }: { featureId: string; voteCount: number }) {
  const { addVote } = useFeatures();
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = customer.trim();
    if (!name) {
      setError("El nombre del cliente es requerido.");
      return;
    }
    addVote(featureId, name);
    setCustomer("");
    setError("");
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 font-semibold text-sm transition-colors border border-brand-100"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{voteCount}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Agregar voto</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del cliente
                </label>
                <input
                  autoFocus
                  value={customer}
                  onChange={(e) => { setCustomer(e.target.value); setError(""); }}
                  placeholder="Ej: Acme Corp"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium"
                >
                  Votar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
