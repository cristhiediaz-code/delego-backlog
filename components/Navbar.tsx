"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, Trophy, LogOut } from "lucide-react";
import { NewFeatureModal } from "./NewFeatureModal";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/explorer", label: "Explorador", icon: LayoutList },
  { href: "/ranking", label: "Ranking", icon: Trophy },
];

export function Navbar() {
  const path = usePathname();
  const { user, signOut } = useAuth();

  if (path === "/login") return null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/delego-logo.svg" alt="Delego by Intelligis" style={{ height: 52, width: "auto" }} />
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <NewFeatureModal />
          {user && (
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name ?? ""}
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
                />
              )}
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.user_metadata?.full_name ?? user.email}
              </span>
              <button
                onClick={signOut}
                title="Cerrar sesión"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
