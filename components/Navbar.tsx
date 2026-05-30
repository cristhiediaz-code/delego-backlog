"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, Trophy } from "lucide-react";
import { NewFeatureModal } from "./NewFeatureModal";

const links = [
  { href: "/explorer", label: "Explorador", icon: LayoutList },
  { href: "/ranking", label: "Ranking", icon: Trophy },
];

export function Navbar() {
  const path = usePathname();
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

        <NewFeatureModal />
      </div>
    </header>
  );
}
