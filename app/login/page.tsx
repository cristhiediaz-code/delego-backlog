"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/ranking");
  }, [user, loading, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eef2ff 0%, #f8faff 60%, #e0e7ff 100%)",
    }}>
      <div style={{
        background: "white",
        borderRadius: "1.5rem",
        boxShadow: "0 20px 60px rgba(79,110,247,0.12)",
        padding: "3rem 3.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        maxWidth: 420,
        width: "90vw",
      }}>
        <img src="/delego-logo.svg" style={{ height: 56 }} alt="Delego" />

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111", margin: 0 }}>
            Bienvenido al Backlog
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>
            Inicia sesión con tu cuenta de Google para acceder.
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0.75rem 1.75rem",
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            background: "white",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
            color: "#374151",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "box-shadow 0.2s, background 0.2s",
            width: "100%",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          {/* Google "G" logo */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continuar con Google
        </button>

        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
          Solo cuentas autorizadas de Intelligis pueden acceder.
        </p>
      </div>
    </div>
  );
}
