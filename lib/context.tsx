"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Feature, Status, Vote, Category, WebSubcategory } from "@/types";
import { supabase } from "./supabase";

interface FeaturesContextValue {
  features: Feature[];
  loading: boolean;
  addFeature: (f: Omit<Feature, "id" | "createdAt" | "votes" | "status">) => Promise<void>;
  updateFeature: (id: string, data: Partial<Pick<Feature, "title" | "description" | "customer" | "category" | "subcategory" | "tags" | "status">>) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Status) => Promise<void>;
  addVote: (id: string, customer: string) => Promise<void>;
}

const FeaturesContext = createContext<FeaturesContextValue | null>(null);

type RawVote = { customer: string; voted_at: string };
type RawFeature = { id: string; title: string; description: string; customer: string; category: string; subcategory: string | null; tags: string[]; status: string; created_at: string; votes: RawVote[] };

function mapFeature(f: RawFeature): Feature {
  return {
    id: f.id,
    title: f.title,
    description: f.description ?? "",
    customer: f.customer ?? "",
    category: f.category as Category,
    subcategory: f.subcategory as WebSubcategory | undefined,
    tags: f.tags ?? [],
    status: f.status as Status,
    createdAt: f.created_at,
    votes: (f.votes ?? []).map((v): Vote => ({ customer: v.customer, votedAt: v.voted_at })),
  };
}

async function fetchFeatures(): Promise<Feature[]> {
  const { data, error } = await supabase
    .from("features")
    .select("*, votes(*)")
    .order("created_at", { ascending: true });
  if (error) { console.error(error); return []; }
  return (data as RawFeature[]).map(mapFeature);
}

export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures().then((data) => { setFeatures(data); setLoading(false); });

    const channel = supabase
      .channel("realtime-backlog")
      .on("postgres_changes", { event: "*", schema: "public", table: "features" }, () => {
        fetchFeatures().then(setFeatures);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, () => {
        fetchFeatures().then(setFeatures);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addFeature = useCallback(async (data: Omit<Feature, "id" | "createdAt" | "votes" | "status">) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await supabase.from("features").insert({
      id, title: data.title, description: data.description,
      customer: data.customer, category: data.category,
      subcategory: data.subcategory ?? null, tags: data.tags,
      status: "En espera", created_at: now,
    });
    await supabase.from("votes").insert({ feature_id: id, customer: data.customer, voted_at: now });
    // Optimistic refresh
    fetchFeatures().then(setFeatures);
  }, []);

  const updateFeature = useCallback(async (id: string, data: Partial<Pick<Feature, "title" | "description" | "customer" | "category" | "subcategory" | "tags" | "status">>) => {
    await supabase.from("features").update({
      title: data.title,
      description: data.description,
      customer: data.customer,
      category: data.category,
      subcategory: data.subcategory ?? null,
      tags: data.tags,
      status: data.status,
    }).eq("id", id);
    // Optimistic refresh — no espera real-time
    fetchFeatures().then(setFeatures);
  }, []);

  const deleteFeature = useCallback(async (id: string) => {
    // Optimistic: remove immediately from UI
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    await supabase.from("features").delete().eq("id", id);
  }, []);

  const updateStatus = useCallback(async (id: string, status: Status) => {
    // Optimistic update
    setFeatures((prev) => prev.map((f) => f.id === id ? { ...f, status } : f));
    await supabase.from("features").update({ status }).eq("id", id);
  }, []);

  const addVote = useCallback(async (id: string, customer: string) => {
    // Optimistic update
    const vote: Vote = { customer, votedAt: new Date().toISOString() };
    setFeatures((prev) => prev.map((f) => f.id === id ? { ...f, votes: [...f.votes, vote] } : f));
    await supabase.from("votes").insert({ feature_id: id, customer, voted_at: vote.votedAt });
  }, []);

  return (
    <FeaturesContext.Provider value={{ features, loading, addFeature, updateFeature, deleteFeature, updateStatus, addVote }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const ctx = useContext(FeaturesContext);
  if (!ctx) throw new Error("useFeatures must be used within FeaturesProvider");
  return ctx;
}
