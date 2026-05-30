"use client";

import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { useFeatures } from "@/lib/context";
import { FeatureCard } from "@/components/FeatureCard";
import { Category, Status } from "@/types";
import { CATEGORIES, STATUSES } from "@/lib/constants";

export default function ExplorerPage() {
  const { features } = useFeatures();
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "Todas">("Todas");
  const [filterStatus, setFilterStatus] = useState<Status | "Todos">("Todos");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return features.filter((f) => {
      const matchesSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.customer.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = filterCategory === "Todas" || f.category === filterCategory;
      const matchesStatus = filterStatus === "Todos" || f.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [features, query, filterCategory, filterStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explorador de funcionalidades</h1>
        <p className="text-gray-500 text-sm mt-1">{features.length} funcionalidades registradas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, cliente o tag..."
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | "Todas")}
            className="input w-auto"
          >
            <option value="Todas">Todas las categorías</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | "Todos")}
            className="input w-auto"
          >
            <option value="Todos">Todos los estatus</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sin resultados</p>
          <p className="text-sm">Ajusta los filtros o agrega nuevas funcionalidades.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      )}
    </div>
  );
}
