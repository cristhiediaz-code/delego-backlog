export type Status = "En espera" | "En progreso" | "Completada";

export type Category =
  | "Automatización"
  | "Integraciones"
  | "Reportes"
  | "UX/UI"
  | "Seguridad"
  | "Performance"
  | "Web"
  | "Mobile"
  | "Otro";

export type WebSubcategory =
  | "Tareas"
  | "Dashboard"
  | "Asignaciones"
  | "Rutas"
  | "Publicaciones"
  | "Autoasignaciones"
  | "Edición"
  | "Reportes"
  | "Formularios"
  | "Vistas Personalizadas"
  | "Campos Personalizados"
  | "Filtros";

export interface Vote {
  customer: string;
  votedAt: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  customer: string;
  category: Category;
  subcategory?: WebSubcategory;
  tags: string[];
  status: Status;
  createdAt: string;
  votes: Vote[];
}
