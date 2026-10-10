"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame, DomainType } from "@/context/GameContext";
import { DOMAINS } from "@/components/Navbar";
import {
  Compass,
  Play,
  Bot,
  Code2,
  Radio,
  Zap,
  Cog,
  Building2,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
} from "lucide-react";

const fontDisplay = { fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" };
const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };
const fontBody = { fontFamily: "var(--font-body, 'Manrope'), sans-serif" };

interface ArenaModule {
  id: string;
  slug: string;
  title: string;
  domain: DomainType;
  domainName: string;
  category: string;
  level: string;
  xpReward: number;
  timeEstimate: string;
  playable: boolean;
  description: string;
  concepts: string[];
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

const ALL_MODULES: ArenaModule[] = [
  {
    id: "ladder-logic",
    slug: "/arenas/ladder-logic",
    title: "Ladder Logic Legends: Industrial PLC SCADA",
    domain: "robotics",
    domainName: "Robotics & Automation",
    category: "Industrial Automation",
    level: "Module 01: Seal-In Latching",
    xpReward: 100,
    timeEstimate: "5-7 mins",
    playable: true,
    description:
      "Design and validate an industrial PLC ladder rung controlling an automated sorting conveyor and articulated pick-and-place robotic arm with fail-safe stop logic.",
    concepts: ["Normally Open [ | ]", "Normally Closed [ / ]", "Relay Output ( M1 )", "Auxiliary Latch", "Scan Cycle Timing"],
    icon: Bot,
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
  },
  {
    id: "dsa-dungeon",
    slug: "/arenas/dsa-dungeon",
    title: "Memory Crypt: Data Structures & Binary Trees",
    domain: "cs",
    domainName: "Computer Science & IT",
    category: "Data Structures & Algos",
    level: "Module 01: Stack vs Queue & BST",
    xpReward: 80,
    timeEstimate: "4-6 mins",
    playable: true,
    description:
      "Analyze and resolve call stack undo mechanisms against FIFO event queues, followed by algorithmic binary search tree node routing.",
    concepts: ["LIFO Stack", "FIFO Buffer", "BST Partitioning", "Time Complexity", "Recursion Invariants"],
    icon: Code2,
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-500",
  },
  {
    id: "arm-kinematics",
    slug: "#",
    title: "Articulated Arm Kinematics & Jacobians",
    domain: "robotics",
    domainName: "Robotics & Automation",
    category: "Robot Kinematics",
    level: "Module 02: 3-DOF Arm",
    xpReward: 120,
    timeEstimate: "8 mins",
    playable: false,
    description:
      "Calculate forward and inverse kinematics using Denavit-Hartenberg parameters to position end-effectors without singular configurations.",
    concepts: ["DH Parameters", "Inverse Kinematics", "Cartesian Pose", "Jacobian Singularities"],
    icon: Bot,
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
  },
  {
    id: "circuit-analysis",
    slug: "#",
    title: "Substation Grid & Nodal Circuit Analysis",
    domain: "ee",
    domainName: "Electrical Engineering",
    category: "Network Theorems",
    level: "Module 01: KVL/KCL Stability",
    xpReward: 90,
    timeEstimate: "5 mins",
    playable: false,
    description:
      "Balance branch currents and compute Thevenin equivalent impedances across a high-voltage distribution node under simulated fault conditions.",
    concepts: ["Kirchhoff's Laws", "Thevenin Equivalent", "Nodal Admittance", "Power Factor"],
    icon: Zap,
    gradientFrom: "from-yellow-500",
    gradientTo: "to-amber-500",
  },
  {
    id: "opamp-design",
    slug: "#",
    title: "Analog Operational Amplifier Synthesis",
    domain: "ece",
    domainName: "Electronics & Communication",
    category: "Analog Circuits",
    level: "Module 01: Inverting Waveforms",
    xpReward: 95,
    timeEstimate: "6 mins",
    playable: false,
    description:
      "Configure feedback resistance ratios on op-amp stages to maximize signal dynamic range while avoiding rail saturation and slew distortion.",
    concepts: ["Virtual Ground", "Closed-Loop Gain", "Gain-Bandwidth Product", "Slew Rate Limits"],
    icon: Radio,
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500",
  },
  {
    id: "thermo-cycles",
    slug: "#",
    title: "Power Plant Thermodynamic Optimization",
    domain: "mech",
    domainName: "Mechanical Engineering",
    category: "Applied Thermodynamics",
    level: "Module 01: Rankine Cycle",
    xpReward: 85,
    timeEstimate: "6 mins",
    playable: false,
    description:
      "Tune superheat temperatures and condenser pressure parameters to optimize the net thermal efficiency of an industrial power turbine cycle.",
    concepts: ["Carnot Efficiency", "Enthalpy Drops", "Boiler Pressure", "Isentropic Turbine Work"],
    icon: Cog,
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-500",
  },
  {
    id: "truss-structures",
    slug: "#",
    title: "Bridge Truss Structural Member Loading",
    domain: "civil",
    domainName: "Civil Engineering",
    category: "Structural Mechanics",
    level: "Module 01: Pratt Truss",
    xpReward: 85,
    timeEstimate: "5 mins",
    playable: false,
    description:
      "Determine axial tension and compression forces across triangulated bridge members to avert buckling failure under moving live loads.",
    concepts: ["Method of Joints", "Euler Buckling", "Zero-Force Members", "Safety Factor (FoS)"],
    icon: Building2,
    gradientFrom: "from-stone-500",
    gradientTo: "to-slate-600",
  },
];

export default function ArenasHubPage() {
  const { domain, setDomain, completedQuests, playSfx } = useGame();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredModules =
    activeFilter === "all"
      ? ALL_MODULES
      : ALL_MODULES.filter((m) => m.domain === activeFilter);

  return (
    <div className="flex-1 min-h-screen page-theme-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-indigo-500/15">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
              style={fontLabel}
            >
              <Compass className="w-3.5 h-3.5" />
              Interactive Workbenches Directory
            </div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              style={fontDisplay}
            >
              Simulation & Practice Workbenches
            </h1>
            <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400" style={fontBody}>
              Hands-on technical modules designed to replicate real industry hiring assessments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveFilter("all");
                playSfx("click");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-indigo-500/20"
              }`}
              style={fontLabel}
            >
              All Disciplines
            </button>
            {DOMAINS.map((d) => {
              const Icon = d.icon;
              const isSelected = activeFilter === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveFilter(d.id);
                    setDomain(d.id);
                    playSfx("click");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-indigo-500/20"
                  }`}
                  style={fontLabel}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{d.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((item) => {
            const Icon = item.icon;
            const isDone = completedQuests.includes(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-200 relative glass-card-theme ${
                  item.playable ? "shadow-md hover:scale-[1.01]" : "opacity-75"
                }`}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background: item.playable
                      ? `linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)`
                      : "transparent",
                  }}
                />

                <div className="p-5 flex-1 flex flex-col space-y-3">
                  {/* Meta header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} text-white`}
                        style={{ opacity: item.playable ? 1 : 0.7 }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className="text-[11px] font-semibold text-slate-500 dark:text-slate-400"
                        style={fontLabel}
                      >
                        {item.domainName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300"
                        style={fontLabel}
                      >
                        +{item.xpReward} XP
                      </span>
                      {isDone && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          style={fontLabel}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Solved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & level */}
                  <div>
                    <h3
                      className="text-base font-bold text-slate-900 dark:text-white leading-snug"
                      style={fontDisplay}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="text-[11px] font-medium mt-0.5 text-indigo-600 dark:text-indigo-400"
                      style={fontLabel}
                    >
                      {item.level} • {item.category}
                    </div>
                  </div>

                  <p
                    className="text-xs leading-relaxed flex-1 text-slate-600 dark:text-slate-300"
                    style={fontBody}
                  >
                    {item.description}
                  </p>

                  {/* Concept chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.concepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800/80 border border-indigo-500/15 text-slate-600 dark:text-slate-400 font-medium"
                        style={fontLabel}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-3 border-t border-indigo-500/15">
                    {item.playable ? (
                      <Link
                        href={item.slug}
                        onClick={() => playSfx("click")}
                        className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.01]"
                        style={{
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          ...fontLabel,
                        }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isDone ? "Launch & Re-verify" : "Launch Interactive Workbench"}
                      </Link>
                    ) : (
                      <div
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 border border-indigo-500/15 text-slate-400 dark:text-slate-500"
                        style={fontLabel}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Scheduled in Curriculum
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
