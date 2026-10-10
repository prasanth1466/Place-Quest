"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame, DomainType } from "@/context/GameContext";
import {
  Compass,
  Mic2,
  BarChart3,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ChevronDown,
  Cpu,
  Code2,
  Radio,
  Cog,
  Building2,
  Check,
} from "lucide-react";

export interface DomainMeta {
  id: DomainType;
  name: string;
  tag: string;
  icon: React.ElementType;
  color: string;
}

export const DOMAINS: DomainMeta[] = [
  {
    id: "robotics",
    name: "Robotics & Automation",
    tag: "PLC · ROS · Control",
    icon: Cpu,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "cs",
    name: "Computer Science & IT",
    tag: "DSA · OS · Networks",
    icon: Code2,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    tag: "VLSI · DSP · Embedded",
    icon: Radio,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "ee",
    name: "Electrical Engineering",
    tag: "Power · Circuits · Machines",
    icon: Zap,
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    tag: "Thermo · CAD · Fluid",
    icon: Cog,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "civil",
    name: "Civil & Structural",
    tag: "Structures · Geotech",
    icon: Building2,
    color: "from-stone-400 to-slate-500",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    domain,
    setDomain,
    xp,
    streak,
    soundEnabled,
    toggleSound,
    playSfx,
  } = useGame();

  const [domainMenuOpen, setDomainMenuOpen] = useState(false);

  const currentDomain = DOMAINS.find((d) => d.id === domain) || DOMAINS[0];
  const DomainIcon = currentDomain.icon;

  const navLinks = [
    { href: "/arenas", label: "Workbenches", icon: Compass },
    { href: "/interview", label: "AI Studio", icon: Mic2 },
    { href: "/dashboard", label: "Telemetry", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200 border-b border-indigo-500/15 backdrop-blur-xl bg-white/80 dark:bg-[#090d16]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand & Domain Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            onClick={() => playSfx("click")}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            {/* Gradient Logo Mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-bold text-sm tracking-tight text-slate-900 dark:text-white"
                  style={{ fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" }}
                >
                  Place
                  <span
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Quest
                  </span>
                </span>
                <span
                  className="px-1.5 py-0.5 text-[9px] font-semibold tracking-widest uppercase rounded bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
                  style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
                >
                  Studio
                </span>
              </div>
              <span
                className="text-[10px] hidden sm:inline leading-none text-slate-500 dark:text-slate-400"
                style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
              >
                Technical Placement Prep
              </span>
            </div>
          </Link>

          {/* Domain Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setDomainMenuOpen(!domainMenuOpen);
                playSfx("click");
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-indigo-500/20 text-slate-700 dark:text-slate-200"
              style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
            >
              <DomainIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span className="max-w-[130px] truncate">{currentDomain.name}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${domainMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {domainMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-xl py-1.5 z-50 bg-white/95 dark:bg-[#0d1321]/95 border border-indigo-500/20 dark:border-indigo-500/30 backdrop-blur-xl shadow-2xl"
                onMouseLeave={() => setDomainMenuOpen(false)}
              >
                <div
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
                >
                  Engineering Tracks
                </div>
                {DOMAINS.map((d) => {
                  const Icon = d.icon;
                  const isSelected = domain === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDomain(d.id);
                        setDomainMenuOpen(false);
                        playSfx("click");
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-indigo-950/40"
                      }`}
                      style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br ${d.color} ${isSelected ? "opacity-100" : "opacity-70"}`}
                        >
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>{d.name}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {d.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => playSfx("click")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-b border-indigo-500"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? "#6366f1" : undefined }}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Stats & Controls */}
        <div className="flex items-center gap-2">
          {/* Streak badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400"
            style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
            title="Consistent Training Days"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{streak}d</span>
          </div>

          {/* XP badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
            style={{ fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" }}
            title="Total Technical Points"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>{xp} XP</span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => {
              toggleSound();
              playSfx("click");
            }}
            title={soundEnabled ? "Mute audio" : "Enable audio"}
            className="p-1.5 rounded-lg transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-indigo-500/20 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="p-1.5 rounded-lg transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-indigo-500/20 text-slate-600 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
