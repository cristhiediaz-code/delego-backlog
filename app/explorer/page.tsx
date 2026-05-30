"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Loader2, ArrowUpDown } from "lucide-react";
import { useFeatures } from "@/lib/context";
import { FeatureCard } from "@/components/FeatureCard";
import { Category, Status } from "@/types";
import { CATEGORIES, STATUSES } from "@/lib/constants";

type SortOption = "fecha" | "votos-desc" | "votos-asc";

export default function ExplorerPage() {
  const { features, loading } = useFeatures();
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "Todas">("Todas");
  const [filterStatus, setFilterStatus] = useState<Status | "Todos">("Todos");
  const [sort, setSort] = useState<SortOption>("fecha");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const result = features.filter((f) => {
      const matchesSearch = !q || f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.customer.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = filterCategory === "Todas" || f.category === filterCategory;
      const matchesStatus = filterStatus === "Todos" || f.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sort === "votos-desc") return [...result].sort((a, b) => b.votes.length - a.votes.length);
    if (sort === "votos-asc") return [...result].sort((a, b) => a.votes.length - b.votes.length);
    return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [features, query, filterCategory, filterStatus, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explorador de funcionalidades</h1>
        <p className="text-gray-500 text-sm mt-1">{features.length} funcionalidades registradas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por título, cliente o tag..." className="input pl-9" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "Todas")} className="input w-auto">
            <option value="Todas">Todas las categorías</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | "Todos")} className="input w-auto">
            <option value="Todos">Todos los estatus</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="input w-auto">
              <option value="fecha">Más recientes</option>
              <option value="votos-desc">Mayor votos</option>
              <option value="votos-asc">Menor votos</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Cargando funcionalidades...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sin resultados</p>
          <p className="text-sm">Ajusta los filtros o agrega nuevas funcionalidades.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => <FeatureCard key={f.id} feature={f} />)}
        </div>
      )}
    </div>
  );
}
