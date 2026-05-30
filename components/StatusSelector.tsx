"use client";

import { Status } from "@/types";
import { STATUSES, STATUS_STYLES } from "@/lib/constants";
import { useFeatures } from "@/lib/context";

export function StatusSelector({ featureId, current }: { featureId: string; current: Status }) {
  const { updateStatus } = useFeatures();
  return (
    <select
      value={current}
      onChange={(e) => updateStatus(featureId, e.target.value as Status)}
      className={`text-xs font-medium rounded-full px-2.5 py-0.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${STATUS_STYLES[current]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-gray-900">
          {s}
        </option>
      ))}
    </select>
  );
}
