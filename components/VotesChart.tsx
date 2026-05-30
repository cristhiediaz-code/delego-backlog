"use client";

import { Feature } from "@/types";

interface Props { features: Feature[] }

export function VotesChart({ features }: Props) {
  const top10 = features.slice(0, 10);
  if (top10.length === 0) return null;
  const max = Math.max(...top10.map((f) => f.votes.length), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Top 10 — Distribución de votos</h2>
        <span className="text-xs text-gray-400">{top10.length} funcionalidades</span>
      </div>
      <div className="space-y-3">
        {top10.map((f, i) => {
          const pct = Math.round((f.votes.length / max) * 100);
          const label = f.subcategory ? `${f.title} · ${f.subcategory}` : f.title;
          return (
            <div key={f.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
              <span className="text-xs text-gray-700 font-medium w-44 truncate flex-shrink-0" title={label}>
                {label}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, 4)}%`,
                    background: "linear-gradient(90deg, #4f6ef7, #7c91fa)",
                  }}
                >
                  {pct > 15 && <span className="text-white text-xs font-semibold">{f.votes.length}</span>}
                </div>
              </div>
              {pct <= 15 && <span className="text-xs font-semibold text-gray-600 w-4">{f.votes.length}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
