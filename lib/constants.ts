import { Category, Status, WebSubcategory } from "@/types";

export const CATEGORIES: Category[] = [
  "Automatización",
  "Integraciones",
  "Reportes",
  "UX/UI",
  "Seguridad",
  "Performance",
  "Web",
  "Mobile",
  "Otro",
];

export const WEB_SUBCATEGORIES: WebSubcategory[] = [
  "Tareas",
  "Dashboard",
  "Asignaciones",
  "Rutas",
  "Publicaciones",
  "Autoasignaciones",
  "Edición",
  "Reportes",
  "Formularios",
  "Vistas Personalizadas",
  "Campos Personalizados",
  "Filtros",
];

export const STATUSES: Status[] = ["En espera", "En progreso", "Completada"];

export const STATUS_STYLES: Record<Status, string> = {
  "En espera": "bg-amber-100 text-amber-800 border border-amber-200",
  "En progreso": "bg-blue-100 text-blue-800 border border-blue-200",
  Completada: "bg-green-100 text-green-800 border border-green-200",
};

export const CATEGORY_STYLES: Record<Category, string> = {
  Automatización: "bg-purple-100 text-purple-800",
  Integraciones: "bg-cyan-100 text-cyan-800",
  Reportes: "bg-indigo-100 text-indigo-800",
  "UX/UI": "bg-pink-100 text-pink-800",
  Seguridad: "bg-red-100 text-red-800",
  Performance: "bg-orange-100 text-orange-800",
  Web: "bg-blue-100 text-blue-800",
  Mobile: "bg-teal-100 text-teal-800",
  Otro: "bg-gray-100 text-gray-800",
};
