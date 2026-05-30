import { Status, Category } from "@/types";
import { STATUS_STYLES, CATEGORY_STYLES } from "@/lib/constants";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[category]}`}>
      {category}
    </span>
  );
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      #{tag}
    </span>
  );
}
