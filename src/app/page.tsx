"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { DOMAINS } from "@/components/Navbar";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Compass,
  Mic2,
  BarChart3,
  Activity,
  ChevronRight,
  Sliders,
  Terminal,
  Bot,
  Code2,
  Target,
} from "lucide-react";

const fontDisplay = { fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" };
const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };
const fontBody = { fontFamily: "var(--font-body, 'Manrope'), sans-serif" };

export default function HomePage() {
  const { domain, setDomain, xp, streak, level, playSfx } = useGame();

  const currentDomainMeta = DOMAINS.find((d) => d.id === domain) || DOMAINS[0];
  const DomainIcon = currentDomainMeta.icon;

  return (
    <div className="flex-1 flex flex-col page-theme-bg transition-colors duration-200">

      {/* ── Hero Section ── */}
      <section className="border-b border-indigo-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">

            {/* Left */}
            <div className="max-w-2xl space-y-6">
              {/* Pill badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
                style={fontLabel}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next-Gen Core Placement Simulator</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400">Open Access</span>
              </div>

              {/* Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                style={fontDisplay}
              >
                Interactive Training for{" "}
                <br className="hidden sm:inline" />
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Core Engineering
                </span>{" "}
                Hiring.
              </h1>

              {/* Subtitle */}
              <p
                className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300"
                style={fontBody}
              >
                Replace passive slides with interactive simulation workbenches and AI-evaluated
                technical interviews. Tailored for{" "}
                <strong className="text-slate-900 dark:text-white">Robotics & Automation</strong>,
                Computer Science, Electronics, and Core disciplines.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/arenas"
                  onClick={() => playSfx("click")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                    ...fontLabel,
                  }}
                >
                  <Compass className="w-4 h-4" />
                  Launch Workbenches
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/interview"
                  onClick={() => playSfx("click")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-indigo-500/25"
                  style={fontLabel}
                >
                  <Mic2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  AI Mock Studio
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => playSfx("click")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  style={fontLabel}
                >
                  <BarChart3 className="w-4 h-4" />
                  Telemetry
                </Link>
              </div>

              {/* Trust badges */}
              <div
                className="flex flex-wrap items-center gap-5 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400"
                style={fontLabel}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Curriculum aligned with Tier-1 MNCs
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  PWA & Offline Ready
                </div>
              </div>
            </div>

            {/* Right: Telemetry Card */}
            <div className="lg:w-96 w-full rounded-2xl p-5 space-y-4 glass-card-theme shadow-xl">
              {/* Card header */}
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span
                    className="text-xs font-bold text-slate-900 dark:text-white"
                    style={fontDisplay}
                  >
                    Session Telemetry
                  </span>
                </div>
                <span
                  className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  style={fontLabel}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400" style={fontLabel}>Current Discipline:</span>
                  <span
                    className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5"
                    style={fontLabel}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br ${currentDomainMeta.color}`}
                    >
                      <DomainIcon className="w-3 h-3 text-white" />
                    </div>
                    {currentDomainMeta.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400" style={fontLabel}>Student Tier:</span>
                  <span className="font-semibold text-slate-800 dark:text-white" style={fontLabel}>{level}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400" style={fontLabel}>Training Velocity:</span>
                  <span
                    className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
                    style={fontLabel}
                  >
                    <Zap className="w-3 h-3" />
                    {xp} XP Earned
                  </span>
                </div>

                {/* Progress bar */}
                <div className="pt-2 border-t border-indigo-500/15">
                  <div
                    className="flex justify-between text-[11px] font-medium mb-2"
                    style={fontLabel}
                  >
                    <span className="text-slate-500 dark:text-slate-400">Interview Preparedness Index</span>
                    <span className="font-bold text-slate-900 dark:text-white">83.4%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "83.4%",
                        background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 60%, #3b82f6 100%)",
                        boxShadow: "0 0 8px rgba(99,102,241,0.4)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/arenas/ladder-logic"
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  ...fontLabel,
                }}
              >
                <span>Continue PLC Simulation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Curriculum Tracks ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
              style={fontDisplay}
            >
              Curriculum Tracks by Specialization
            </h2>
            <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400" style={fontBody}>
              Select your domain to calibrate simulation workbenches and interview criteria.
            </p>
          </div>
          <Link
            href="/arenas"
            className="flex items-center gap-1 text-xs font-semibold self-start sm:self-auto transition-colors text-indigo-600 dark:text-indigo-400 hover:underline"
            style={fontLabel}
          >
            Browse Full Catalog
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map((d) => {
            const Icon = d.icon;
            const isSelected = domain === d.id;
            return (
              <div
                key={d.id}
                onClick={() => {
                  setDomain(d.id);
                  playSfx("click");
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 glass-card-theme ${
                  isSelected
                    ? "ring-2 ring-indigo-500/50 shadow-lg scale-[1.01]"
                    : "hover:border-indigo-500/40"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${d.color}`}
                    style={{ boxShadow: isSelected ? "0 4px 12px rgba(99,102,241,0.25)" : "none" }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300"
                    style={fontLabel}
                  >
                    {d.tag}
                  </span>
                </div>

                <div
                  className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center justify-between"
                  style={fontDisplay}
                >
                  <span>{d.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
                </div>

                <p className="text-xs mb-3 line-clamp-2 text-slate-500 dark:text-slate-400" style={fontBody}>
                  {d.id === "robotics" && "Industrial PLC ladder logic, kinematics, sensor integration, PID tuning."}
                  {d.id === "cs" && "Data structures, memory allocation, algorithm complexity, system design."}
                  {d.id === "ece" && "Analog op-amp design, digital gate networks, microcontrollers, VLSI."}
                  {d.id === "ee" && "Grid stability, KVL/KCL analysis, electrical machines, control loops."}
                  {d.id === "mech" && "Thermodynamic cycles, fluid dynamics, finite stress analysis, CAD."}
                  {d.id === "civil" && "Truss structural analysis, surveying loops, CPM/PERT scheduling."}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-indigo-500/15">
                  <span className="text-slate-400" style={fontLabel}>
                    {d.id === "robotics" || d.id === "cs" ? "Workbench Ready" : "Syllabus Active"}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400" style={fontLabel}>
                    Select Track →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Featured Workbenches ── */}
      <section className="py-12 border-t border-indigo-500/15 bg-indigo-500/[0.02] dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
              style={fontDisplay}
            >
              Featured Interactive Workbenches
            </h2>
            <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400" style={fontBody}>
              Hands-on engineering environments that validate practical technical competency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Workbench 01: Ladder Logic */}
            <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden glass-card-theme shadow-md">
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)" }}
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400" style={fontLabel}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    Robotics & Industrial Automation
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400" style={fontLabel}>
                    100 XP
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={fontDisplay}>
                  Ladder Logic Legends: Seal-In Conveyor SCADA
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300" style={fontBody}>
                  Construct an industrial PLC ladder rung with normally open/closed contacts,
                  auxiliary latching, and emergency stops to control a simulated sorting
                  conveyor and 3-axis pick-and-place arm.
                </p>

                {/* Target skills box */}
                <div className="p-3.5 rounded-xl text-xs space-y-1 glass-card-sub-theme text-slate-700 dark:text-slate-300" style={fontLabel}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-slate-400">
                    Target Skills:
                  </div>
                  <div>• Fail-safe E-Stop circuitry [ / ]</div>
                  <div>• Momentary pushbutton seal-in latching [ M1 ]</div>
                  <div>• Interview focus: Bosch, Siemens, ABB, Rockwell</div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/arenas/ladder-logic"
                  onClick={() => playSfx("click")}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    ...fontLabel,
                  }}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Launch PLC Workbench
                </Link>
              </div>
            </div>

            {/* Workbench 02: DSA Dungeon */}
            <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden glass-card-theme shadow-md">
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }}
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400" style={fontLabel}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    Computer Science & IT
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300" style={fontLabel}>
                    80 XP
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={fontDisplay}>
                  Memory Crypt: Stack/Queue & BST Traversal
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300" style={fontBody}>
                  Resolve memory registers through LIFO stack undo pipelines versus FIFO queues,
                  followed by O(log N) binary search tree node routing under time limits.
                </p>

                <div className="p-3.5 rounded-xl text-xs space-y-1 glass-card-sub-theme text-slate-700 dark:text-slate-300" style={fontLabel}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-slate-400">
                    Target Skills:
                  </div>
                  <div>• Call stack execution vs buffer queues</div>
                  <div>• Binary search tree partition properties</div>
                  <div>• Interview focus: Amazon, Zoho, TCS Digital</div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  href="/arenas/dsa-dungeon"
                  onClick={() => playSfx("click")}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    ...fontLabel,
                  }}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Launch Algorithm Workbench
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Mock Interview Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #0f172a 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow: "0 10px 40px rgba(139,92,246,0.15)",
          }}
        >
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
          />

          <div className="space-y-2 max-w-xl relative z-10">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 border border-violet-500/40 text-violet-200"
              style={fontLabel}
            >
              <Mic2 className="w-3.5 h-3.5" />
              Technical Interview Evaluation Studio
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white" style={fontDisplay}>
              Practice Under Realistic Engineering Rubrics
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-violet-200" style={fontBody}>
              Test technical communication with Mentor and Bar-Raiser personas. Get concrete
              feedback on STAR formatting, domain terminology, and speech clarity.
            </p>
          </div>

          <Link
            href="/interview"
            onClick={() => playSfx("click")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap relative z-10 bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg"
            style={fontLabel}
          >
            Open Studio
            <ArrowRight className="w-4 h-4 text-violet-600" />
          </Link>
        </div>
      </section>

    </div>
  );
}
