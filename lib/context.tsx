"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Feature, Status, Vote } from "@/types";
import { loadFeatures, saveFeatures } from "./storage";

interface FeaturesContextValue {
  features: Feature[];
  addFeature: (f: Omit<Feature, "id" | "createdAt" | "votes" | "status">) => void;
  updateFeature: (id: string, data: Partial<Pick<Feature, "title" | "description" | "customer" | "category" | "subcategory" | "tags" | "status">>) => void;
  deleteFeature: (id: string) => void;
  updateStatus: (id: string, status: Status) => void;
  addVote: (id: string, customer: string) => void;
}

const FeaturesContext = createContext<FeaturesContextValue | null>(null);

export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => { setFeatures(loadFeatures()); }, []);

  const persist = useCallback((next: Feature[]) => {
    setFeatures(next);
    saveFeatures(next);
  }, []);

  const addFeature = useCallback(
    (data: Omit<Feature, "id" | "createdAt" | "votes" | "status">) => {
      const newFeature: Feature = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: "En espera",
        votes: [{ customer: data.customer, votedAt: new Date().toISOString() }],
      };
      persist([...features, newFeature]);
    },
    [features, persist]
  );

  const updateFeature = useCallback(
    (id: string, data: Partial<Pick<Feature, "title" | "description" | "customer" | "category" | "subcategory" | "tags" | "status">>) => {
      persist(features.map((f) => (f.id === id ? { ...f, ...data } : f)));
    },
    [features, persist]
  );

  const deleteFeature = useCallback(
    (id: string) => { persist(features.filter((f) => f.id !== id)); },
    [features, persist]
  );

  const updateStatus = useCallback(
    (id: string, status: Status) => {
      persist(features.map((f) => (f.id === id ? { ...f, status } : f)));
    },
    [features, persist]
  );

  const addVote = useCallback(
    (id: string, customer: string) => {
      persist(features.map((f) => {
        if (f.id !== id) return f;
        const vote: Vote = { customer, votedAt: new Date().toISOString() };
        return { ...f, votes: [...f.votes, vote] };
      }));
    },
    [features, persist]
  );

  return (
    <FeaturesContext.Provider value={{ features, addFeature, updateFeature, deleteFeature, updateStatus, addVote }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const ctx = useContext(FeaturesContext);
  if (!ctx) throw new Error("useFeatures must be used within FeaturesProvider");
  return ctx;
}
