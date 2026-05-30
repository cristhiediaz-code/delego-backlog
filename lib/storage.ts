import { Feature } from "@/types";

const KEY = "delego_features";

const SEED: Feature[] = [
  {
    id: "1",
    title: "Automatización de aprobaciones",
    description:
      "Flujo de aprobación automática basado en reglas configurables para reducir tiempos de respuesta.",
    customer: "Acme Corp",
    category: "Automatización",
    tags: ["workflow", "aprobaciones"],
    status: "En espera",
    createdAt: "2026-01-15T10:00:00Z",
    votes: [
      { customer: "Acme Corp", votedAt: "2026-01-15T10:00:00Z" },
      { customer: "TechStart", votedAt: "2026-01-20T09:00:00Z" },
      { customer: "GlobalInc", votedAt: "2026-02-01T14:00:00Z" },
    ],
  },
  {
    id: "2",
    title: "Integración con Slack",
    description:
      "Notificaciones en tiempo real en canales de Slack cuando hay cambios de estado en tareas delegadas.",
    customer: "TechStart",
    category: "Integraciones",
    tags: ["slack", "notificaciones"],
    status: "En progreso",
    createdAt: "2026-01-20T11:00:00Z",
    votes: [
      { customer: "TechStart", votedAt: "2026-01-20T11:00:00Z" },
      { customer: "Acme Corp", votedAt: "2026-01-22T08:00:00Z" },
    ],
  },
  {
    id: "3",
    title: "Dashboard de métricas ejecutivo",
    description:
      "Vista consolidada con KPIs de productividad, tiempos de ciclo y cumplimiento de SLAs.",
    customer: "GlobalInc",
    category: "Reportes",
    tags: ["dashboard", "KPIs", "ejecutivo"],
    status: "En espera",
    createdAt: "2026-02-01T09:00:00Z",
    votes: [
      { customer: "GlobalInc", votedAt: "2026-02-01T09:00:00Z" },
      { customer: "Acme Corp", votedAt: "2026-02-05T10:00:00Z" },
      { customer: "Nexus Labs", votedAt: "2026-02-10T15:00:00Z" },
      { customer: "Orbit Co", votedAt: "2026-02-12T11:00:00Z" },
    ],
  },
  {
    id: "4",
    title: "Exportación a PDF de reportes",
    description: "Generación de reportes en formato PDF con branding personalizado del cliente.",
    customer: "Nexus Labs",
    category: "Reportes",
    tags: ["exportación", "PDF"],
    status: "Completada",
    createdAt: "2026-01-10T08:00:00Z",
    votes: [
      { customer: "Nexus Labs", votedAt: "2026-01-10T08:00:00Z" },
      { customer: "TechStart", votedAt: "2026-01-11T09:00:00Z" },
    ],
  },
  {
    id: "5",
    title: "Autenticación SSO con Google Workspace",
    description: "Inicio de sesión único mediante OAuth 2.0 integrado con Google Workspace.",
    customer: "Orbit Co",
    category: "Seguridad",
    tags: ["SSO", "Google", "autenticación"],
    status: "En espera",
    createdAt: "2026-02-10T14:00:00Z",
    votes: [
      { customer: "Orbit Co", votedAt: "2026-02-10T14:00:00Z" },
    ],
  },
];

export function loadFeatures(): Feature[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED));
    return SEED;
  }
  return JSON.parse(raw) as Feature[];
}

export function saveFeatures(features: Feature[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(features));
}
