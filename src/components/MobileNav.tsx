"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { LayoutGrid, Compass, Mic2, BarChart3 } from "lucide-react";

const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };

export default function MobileNav() {
  const pathname = usePathname();
  const { playSfx } = useGame();

  const links = [
    { href: "/", label: "Overview", icon: LayoutGrid },
    { href: "/arenas", label: "Workbenches", icon: Compass },
    { href: "/interview", label: "Interview", icon: Mic2 },
    { href: "/dashboard", label: "Telemetry", icon: BarChart3 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-around border-t border-indigo-500/20 backdrop-blur-xl bg-white/90 dark:bg-[#090d16]/92 transition-colors duration-200">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => playSfx("click")}
            className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all ${
              isActive
                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent"
            }`}
            style={fontLabel}
          >
            <Icon
              className="w-4 h-4"
              style={{
                strokeWidth: isActive ? 2.5 : 1.75,
                color: isActive ? "#6366f1" : undefined,
              }}
            />
            <span className="text-[10px] font-semibold">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
