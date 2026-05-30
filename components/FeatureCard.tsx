"use client";

import { useState } from "react";
import { Feature } from "@/types";
import { Calendar, User, Users, Pencil, Trash2 } from "lucide-react";
import { CategoryBadge, TagBadge } from "./Badge";
import { StatusSelector } from "./StatusSelector";
import { VoteButton } from "./VoteButton";
import { EditFeatureModal } from "./EditFeatureModal";
import { useFeatures } from "@/lib/context";

interface Props {
  feature: Feature;
  rank?: number;
}

export function FeatureCard({ feature, rank }: Props) {
  const { deleteFeature } = useFeatures();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const voters = feature.votes.map((v) => v.customer).join(", ");
  const createdDate = new Date(feature.createdAt).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {rank !== undefined && (
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                {rank}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-snug">{feature.title}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{feature.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <VoteButton featureId={feature.id} voteCount={feature.votes.length} />
            <button
              onClick={() => setEditing(true)}
              title="Editar"
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteFeature(feature.id)}
                  className="px-2 py-1 text-xs rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                title="Eliminar"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={feature.category} />
          {feature.subcategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {feature.subcategory}
            </span>
          )}
          <StatusSelector featureId={feature.id} current={feature.status} />
          {feature.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-gray-100">
          <span className="flex items-center gap-1 text-gray-700 font-medium">
            <User className="w-3.5 h-3.5 text-gray-500" />
            {feature.customer}
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {createdDate}
          </span>
          <span className="flex items-center gap-1 text-gray-500" title={voters}>
            <Users className="w-3.5 h-3.5" />
            {feature.votes.length} voto{feature.votes.length !== 1 ? "s" : ""}
            {feature.votes.length > 0 && (
              <span className="ml-1 text-gray-400">· {voters}</span>
            )}
          </span>
        </div>
      </div>

      {editing && <EditFeatureModal feature={feature} onClose={() => setEditing(false)} />}
    </>
  );
}
