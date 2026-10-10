"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { 
  BarChart3, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  Flame, 
  Bot, 
  Code2, 
  CheckCircle2, 
  Activity, 
  Target,
  ArrowRight,
  Sparkles
} from "lucide-react";

const fontDisplay = { fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" };
const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };
const fontBody = { fontFamily: "var(--font-body, 'Manrope'), sans-serif" };

export default function DashboardTelemetryPage() {
  const { xp, streak, level, completedQuests, interviewResults } = useGame();

  const skills = [
    { label: "Robotics & PLC", value: 85, angle: 0 },
    { label: "DSA & Architecture", value: 78, angle: 60 },
    { label: "Circuits & Control", value: 72, angle: 120 },
    { label: "Aptitude & Logic", value: 84, angle: 180 },
    { label: "System Design", value: 65, angle: 240 },
    { label: "Technical Interview", value: 88, angle: 300 }
  ];

  const center = 150;
  const radius = 95;
  const points = skills.map((s) => {
    const rad = (s.angle - 90) * (Math.PI / 180);
    const r = (s.value / 100) * radius;
    const x = center + r * Math.cos(rad);
    const y = center + r * Math.sin(rad);
    return `${x},${y}`;
  }).join(" ");

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  const COMPETENCIES = [
    { id: "ladder-logic", name: "PLC SCADA & Latching", desc: "IEC 61131-3 Seal-in rung verified", unlocked: completedQuests.includes("ladder-logic"), icon: Bot },
    { id: "dsa-dungeon", name: "Call Stack & BST Routing", desc: "LIFO frames and tree partition validated", unlocked: completedQuests.includes("dsa-dungeon"), icon: Code2 },
    { id: "first-interview", name: "STAR Interview Verified", desc: "AI technical interview evaluation passed", unlocked: interviewResults.length > 0, icon: ShieldCheck },
    { id: "streak-warrior", name: "Consistent Training Cadence", desc: "5+ consecutive active days logged", unlocked: streak >= 5, icon: Flame }
  ];

  const COMPANIES = [
    { name: "Bosch & Siemens Industrial", role: "Automation & Robotics Engineer", match: 86, tag: "Core Track" },
    { name: "Zoho & Tech Firms", role: "Software Development Engineer (SDE-1)", match: 82, tag: "CS / IT" },
    { name: "ABB & L&T Technology", role: "Control & Power Systems Engineer", match: 79, tag: "Electrical" },
    { name: "Amazon & Cloud SDE", role: "Distributed Systems Associate", match: 72, tag: "Tier-1 Cloud" }
  ];

  return (
    <div className="flex-1 min-h-screen py-8 page-theme-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Telemetry Overview Card */}
        <div className="p-6 sm:p-8 rounded-2xl relative overflow-hidden glass-card-theme">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="p-2 rounded-xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                  }}
                >
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
                  style={fontLabel}
                >
                  Placement Telemetry & Readiness Dashboard
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                style={fontDisplay}
              >
                Candidate Preparedness Analytics
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300" style={fontLabel}>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25">
                  {level}
                </span>
                <span>•</span>
                <span>Cohort: Final-Year Engineering Batch 2026-27</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl glass-card-sub-theme">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold" style={fontLabel}>Placement Match</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1" style={fontDisplay}>
                  83.4%
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5" style={fontLabel}>
                  <ArrowUpRight className="w-3 h-3" /> Tier-1 Standard
                </span>
              </div>

              <div className="p-4 rounded-xl glass-card-sub-theme">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold" style={fontLabel}>Training Points</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1" style={fontDisplay}>
                  {xp} XP
                </div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5 mt-0.5" style={fontLabel}>
                  <Zap className="w-3 h-3 text-amber-500" /> Active Bounties
                </span>
              </div>

              <div className="p-4 rounded-xl col-span-2 sm:col-span-1 glass-card-sub-theme">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold" style={fontLabel}>Cadence Streak</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1" style={fontDisplay}>
                  {streak} Days
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5 mt-0.5" style={fontLabel}>
                  <Flame className="w-3 h-3" /> Momentum Active
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: 6-Dimension Skill Radar (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl space-y-5 glass-card-theme">
              
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2" style={fontDisplay}>
                    <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Engineering Skill Vector Radar
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" style={fontBody}>
                    Calculated from simulation workbenches, logic timing, and STAR rubric evaluations.
                  </p>
                </div>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300"
                  style={fontLabel}
                >
                  6 Dimensions
                </span>
              </div>

              {/* Clean SVG Radar */}
              <div className="flex items-center justify-center py-4">
                <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                  <defs>
                    <linearGradient id="radarPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>

                  {gridCircles.map((factor, idx) => (
                    <circle
                      key={idx}
                      cx={center}
                      cy={center}
                      r={radius * factor}
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-300 dark:text-indigo-500/25"
                      strokeDasharray={idx < 3 ? "3 3" : "none"}
                      strokeWidth="1"
                    />
                  ))}

                  {skills.map((s, idx) => {
                    const rad = (s.angle - 90) * (Math.PI / 180);
                    const x = center + radius * Math.cos(rad);
                    const y = center + radius * Math.sin(rad);
                    return (
                      <line
                        key={idx}
                        x1={center}
                        y1={center}
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        className="text-slate-300 dark:text-indigo-500/25"
                        strokeWidth="1"
                      />
                    );
                  })}

                  <polygon
                    points={points}
                    fill="url(#radarPolyGrad)"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 0 8px rgba(99,102,241,0.5))"
                  />

                  {skills.map((s, idx) => {
                    const rad = (s.angle - 90) * (Math.PI / 180);
                    const r = (s.value / 100) * radius;
                    const x = center + r * Math.cos(rad);
                    const y = center + r * Math.sin(rad);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#8b5cf6"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {skills.map((s, idx) => {
                    const rad = (s.angle - 90) * (Math.PI / 180);
                    const labelR = radius + 24;
                    const x = center + labelR * Math.cos(rad);
                    const y = center + labelR * Math.sin(rad);
                    return (
                      <text
                        key={idx}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[10px] font-semibold fill-slate-700 dark:fill-slate-300"
                        style={fontLabel}
                      >
                        {s.label} ({s.value}%)
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs border-t border-indigo-500/15" style={fontLabel}>
                <span className="text-slate-500 dark:text-slate-400">
                  Focus Recommendation: <strong className="text-amber-600 dark:text-amber-400">System Design (65%)</strong>
                </span>
                <Link
                  href="/arenas"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>Select Workbench</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

          {/* Right: Company Readiness & Competencies (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Target Company Match */}
            <div className="p-5 sm:p-6 rounded-2xl space-y-4 glass-card-theme">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2" style={fontDisplay}>
                  <Briefcase className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  Target Company Preparedness
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400" style={fontLabel}>
                  Top Placements
                </span>
              </div>

              <div className="space-y-3">
                {COMPANIES.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl transition-all glass-card-sub-theme"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white" style={fontDisplay}>
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400" style={fontBody}>
                          {c.role} • <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{c.tag}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-indigo-600 dark:text-indigo-300" style={fontDisplay}>
                          {c.match}%
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold" style={fontLabel}>
                          Qualified
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${c.match}%`,
                          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competency Badges */}
            <div className="p-5 sm:p-6 rounded-2xl space-y-4 glass-card-theme">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2" style={fontDisplay}>
                <Award className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                Verified Placement Competencies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPETENCIES.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        b.unlocked
                          ? "bg-indigo-500/10 border-indigo-500/25 shadow-sm"
                          : "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50 grayscale"
                      }`}
                    >
                      <div
                        className="p-2 rounded-lg text-white shrink-0"
                        style={{
                          background: b.unlocked ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "#94a3b8",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white" style={fontDisplay}>
                          {b.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5" style={fontBody}>
                          {b.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
