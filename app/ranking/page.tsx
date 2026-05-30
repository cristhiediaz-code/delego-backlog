"use client";

import { useMemo } from "react";
import { Trophy, CheckCircle2, Download } from "lucide-react";
import { useFeatures } from "@/lib/context";
import { FeatureCard } from "@/components/FeatureCard";
import { VotesChart } from "@/components/VotesChart";
import { Feature } from "@/types";

function exportCSV(features: Feature[]) {
  const header = ["Título", "Descripción", "Cliente", "Categoría", "Estatus", "Votos", "Clientes que votaron", "Fecha de creación"];
  const rows = features.map((f) => [
    `"${f.title.replace(/"/g, '""')}"`,
    `"${f.description.replace(/"/g, '""')}"`,
    `"${f.customer}"`,
    `"${f.category}"`,
    `"${f.status}"`,
    f.votes.length,
    `"${f.votes.map((v) => v.customer).join(", ")}"`,
    `"${new Date(f.createdAt).toLocaleDateString("es-MX")}"`,
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `delego-backlog-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RankingPage() {
  const { features } = useFeatures();

  const ranked = useMemo(
    () => features.filter((f) => f.status !== "Completada").sort((a, b) => b.votes.length - a.votes.length),
    [features]
  );

  const completed = features.filter((f) => f.status === "Completada").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Ranking de prioridad
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ordenado por votos · {ranked.length} funcionalidades activas
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {completed > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-4 h-4" />
              {completed} completada{completed !== 1 ? "s" : ""} excluida{completed !== 1 ? "s" : ""}
            </div>
          )}
          <button
            onClick={() => exportCSV(features)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {ranked.length > 0 && <VotesChart features={ranked} />}

      {ranked.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hay funcionalidades pendientes</p>
          <p className="text-sm">Agrega nuevas funcionalidades para verlas en el ranking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ranked.map((f, i) => (
            <div key={f.id} className="relative">
              {i === 0 && <div className="absolute -top-1 -right-1 z-10 text-lg">🥇</div>}
              {i === 1 && <div className="absolute -top-1 -right-1 z-10 text-lg">🥈</div>}
              {i === 2 && <div className="absolute -top-1 -right-1 z-10 text-lg">🥉</div>}
              <FeatureCard feature={f} rank={i + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
