"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Zap, 
  Bot, 
  Info, 
  Sliders, 
  Cpu, 
  Activity,
  Check,
  Power,
  Sparkles,
  ShieldCheck,
  Radio,
  ArrowRight
} from "lucide-react";

const fontDisplay = { fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" };
const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };
const fontBody = { fontFamily: "var(--font-body, 'Manrope'), sans-serif" };

type SlotId = "stop_slot" | "start_slot" | "latch_slot" | "coil_slot";

interface PlacedComponent {
  id: string;
  name: string;
  symbol: string;
  type: "no" | "nc" | "coil" | "latch";
  standard: string;
  desc: string;
}

const AVAILABLE_PALETTE: PlacedComponent[] = [
  { id: "comp_stop_nc", name: "E-Stop PB (NC)", symbol: "[ / ]", type: "nc", standard: "IEC 61131-3", desc: "Normally Closed contact that interrupts current when depressed" },
  { id: "comp_start_no", name: "Start PB (NO)", symbol: "[ | ]", type: "no", standard: "IEC 61131-3", desc: "Normally Open momentary push button conducting only when held" },
  { id: "comp_latch_no", name: "Auxiliary Latch", symbol: "[ M1 ]", type: "latch", standard: "Aux Seal-In", desc: "Parallel holding contact tied to relay coil state" },
  { id: "comp_coil_m1", name: "Motor Coil (M1)", symbol: "( M1 )", type: "coil", standard: "Actuator Relay", desc: "Electromagnetic contactor energizing high-voltage drive" }
];

export default function LadderLogicGame() {
  const { addXP, markQuestCompleted, playSfx, triggerConfetti } = useGame();

  const [placed, setPlaced] = useState<Record<SlotId, PlacedComponent | null>>({
    stop_slot: null,
    start_slot: null,
    latch_slot: null,
    coil_slot: null
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [motorEnergized, setMotorEnergized] = useState(false);
  const [boxPosition, setBoxPosition] = useState(10);
  const [boxPicked, setBoxPicked] = useState(false);
  const [robotArmAngle, setRobotArmAngle] = useState(0);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isSimulating) {
      setMotorEnergized(false);
      return;
    }

    const hasStop = placed.stop_slot?.type === "nc";
    const hasStart = placed.start_slot?.type === "no";
    const hasLatch = placed.latch_slot?.type === "latch";
    const hasCoil = placed.coil_slot?.type === "coil";

    const stopConduction = hasStop && !stopPressed;
    const branchConduction = (hasStart && startPressed) || (hasLatch && motorEnergized);

    if (stopConduction && branchConduction && hasCoil) {
      setMotorEnergized(true);
    } else if (stopPressed || !stopConduction) {
      setMotorEnergized(false);
    }
  }, [isSimulating, startPressed, stopPressed, placed, motorEnergized]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (motorEnergized && !boxPicked) {
      interval = setInterval(() => {
        setBoxPosition((prev) => {
          if (prev >= 82) {
            setRobotArmAngle(45);
            setTimeout(() => {
              setBoxPicked(true);
              setRobotArmAngle(0);
              playSfx("correct");
            }, 500);
            return 82;
          }
          return prev + 2;
        });
      }, 45);
    }
    return () => clearInterval(interval);
  }, [motorEnergized, boxPicked, playSfx]);

  useEffect(() => {
    if (boxPicked && !isSuccess) {
      setIsSuccess(true);
      playSfx("win");
      triggerConfetti();
      markQuestCompleted("ladder-logic", 100);
    }
  }, [boxPicked, isSuccess, markQuestCompleted, playSfx, triggerConfetti]);

  const handlePlace = (slotId: SlotId, comp: PlacedComponent) => {
    playSfx("click");
    setPlaced((prev) => ({ ...prev, [slotId]: comp }));
    setErrorFeedback(null);
  };

  const handleClearSlot = (slotId: SlotId) => {
    playSfx("click");
    setPlaced((prev) => ({ ...prev, [slotId]: null }));
  };

  const handleStartSimulation = () => {
    if (!placed.stop_slot || !placed.start_slot || !placed.latch_slot || !placed.coil_slot) {
      setErrorFeedback("Incomplete Rung Logic: Populate all 4 instrument slots to complete the electrical circuit.");
      playSfx("wrong");
      return;
    }

    if (placed.stop_slot.type !== "nc") {
      setErrorFeedback("Safety Constraint Violated: Emergency Stop must be Normally Closed [ / ] to guarantee fail-safe power cut on wire severance.");
      playSfx("wrong");
      return;
    }

    if (placed.start_slot.type !== "no") {
      setErrorFeedback("Contact Error: The momentary Start button must be Normally Open [ | ] so coil excitation only triggers upon deliberate operator depression.");
      playSfx("wrong");
      return;
    }

    if (placed.latch_slot.type !== "latch") {
      setErrorFeedback("Latching Failure: Auxiliary seal-in contact [ M1 ] must be connected in parallel around the Start button to sustain coil current when released.");
      playSfx("wrong");
      return;
    }

    if (placed.coil_slot.type !== "coil") {
      setErrorFeedback("Actuator Missing: Motor Relay Coil ( M1 ) must terminate the rung directly against the 0V return rail.");
      playSfx("wrong");
      return;
    }

    setErrorFeedback(null);
    setIsSimulating(true);
    playSfx("click");
  };

  const handleReset = () => {
    setIsSimulating(false);
    setStartPressed(false);
    setStopPressed(false);
    setMotorEnergized(false);
    setBoxPosition(10);
    setBoxPicked(false);
    setRobotArmAngle(0);
    setErrorFeedback(null);
    setIsSuccess(false);
    playSfx("click");
  };

  return (
    <div className="flex-1 min-h-screen py-8 page-theme-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-500/15">
          <div>
            <Link
              href="/arenas"
              className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              style={fontLabel}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Workbenches
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                  boxShadow: "0 4px 16px rgba(245, 158, 11, 0.25)",
                }}
              >
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                  style={fontDisplay}
                >
                  Industrial PLC Ladder Logic Workbench
                </h1>
                <span
                  className="text-[11px] text-slate-500 dark:text-slate-400 font-medium"
                  style={fontLabel}
                >
                  SCADA Emulation • Bosch, ABB & Siemens Core Automation Track
                </span>
              </div>
            </div>
          </div>

          {/* Status & Reset */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
              style={fontLabel}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Bounty: +100 XP</span>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-indigo-500/20 cursor-pointer"
              style={fontLabel}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Engineering Task Briefing */}
        <div className="p-5 rounded-2xl flex items-start gap-3.5 text-xs sm:text-sm glass-card-theme">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div
              className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2"
              style={fontLabel}
            >
              <span>Engineering Challenge: Conveyor Seal-In Circuit</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25">
                IEC 61131-3 STANDARD
              </span>
            </div>
            <p
              className="text-slate-600 dark:text-slate-300 text-xs sm:text-[13px] leading-relaxed"
              style={fontBody}
            >
              Configure the IEC 61131-3 ladder rung so that a momentary push of the <strong>Start Button [ | ]</strong> latches the <strong>Motor Coil ( M1 )</strong> ON continuously. The conveyor will move the manufacturing pallet to the 3-axis robotic sorting arm. If the <strong>Emergency Stop [ / ]</strong> is actuated, the circuit must immediately open and de-energize the coil.
            </p>
          </div>
        </div>

        {/* Main SCADA & Ladder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Ladder Diagram Workbench (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl space-y-5 glass-card-theme">
              
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span
                    className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200"
                    style={fontLabel}
                  >
                    Rung 0001: Main Motor Contactor
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 text-[11px]"
                  style={fontLabel}
                >
                  <span className={`w-2.5 h-2.5 rounded-full transition-all ${motorEnergized ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-400 dark:bg-slate-600"}`} />
                  <span className={motorEnergized ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                    {motorEnergized ? "M1: ENERGIZED (24V DC)" : "M1: OPEN (0V DC)"}
                  </span>
                </div>
              </div>

              {/* Industrial Ladder Rack */}
              <div
                className="relative p-5 sm:p-6 rounded-xl overflow-x-auto text-white"
                style={{
                  background: "#060911",
                  border: "1px solid rgba(99,102,241,0.2)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="flex justify-between text-[11px] mb-4"
                  style={fontLabel}
                >
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    +24V DC SUPPLY RAIL
                  </span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    0V RETURN BUS (GND)
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  </span>
                </div>

                {/* Rung Schematic */}
                <div className="min-w-[540px] flex items-center justify-between relative py-8 px-2 border-y border-slate-800/80">
                  
                  {/* Left Power Rail */}
                  <div
                    className={`w-3 h-28 rounded-sm transition-all duration-300 ${
                      isSimulating 
                        ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" 
                        : "bg-slate-700"
                    }`}
                  />

                  {/* Conductor to Stop Slot */}
                  <div
                    className={`h-1 flex-1 transition-colors duration-200 ${
                      isSimulating && !stopPressed ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-slate-700"
                    }`}
                  />

                  {/* Slot 1: E-Stop */}
                  <div className="flex flex-col items-center mx-1">
                    <span
                      className="text-[10px] text-slate-400 mb-1.5 font-semibold"
                      style={fontLabel}
                    >
                      E-STOP (NC)
                    </span>
                    <div 
                      onClick={() => placed.stop_slot && handleClearSlot("stop_slot")}
                      className={`w-22 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all ${
                        placed.stop_slot 
                          ? "border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]" 
                          : "border-slate-700 hover:border-indigo-400/60 bg-slate-900/60 text-slate-500 text-xs"
                      }`}
                    >
                      {placed.stop_slot ? (
                        <>
                          <span className="text-sm font-bold" style={fontLabel}>{placed.stop_slot.symbol}</span>
                          <span className="text-[9px] truncate max-w-[80px]" style={fontBody}>{placed.stop_slot.name}</span>
                          <span className="text-[7px] text-amber-400/70 uppercase">Click to remove</span>
                        </>
                      ) : (
                        <div className="text-center" style={fontLabel}>
                          <span className="block font-semibold text-slate-400">Slot 1</span>
                          <span className="text-[9px] text-slate-500">Drop NC</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`h-1 w-6 transition-colors duration-200 ${
                      isSimulating && !stopPressed ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-slate-700"
                    }`}
                  />

                  {/* Parallel Branch: Start PB & Latch Contact */}
                  <div className="flex flex-col gap-3 relative px-3 py-1 bg-slate-900/40 rounded-xl border border-slate-800">
                    
                    {/* Top: Start PB */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 w-12 font-semibold" style={fontLabel}>INPUT:</span>
                      <div 
                        onClick={() => placed.start_slot && handleClearSlot("start_slot")}
                        className={`w-28 h-12 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all ${
                          placed.start_slot 
                            ? "border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]" 
                            : "border-slate-700 hover:border-cyan-400/60 bg-slate-900/60 text-slate-500 text-xs"
                        }`}
                      >
                        {placed.start_slot ? (
                          <>
                            <span className="text-xs font-bold" style={fontLabel}>{placed.start_slot.symbol}</span>
                            <span className="text-[9px] truncate max-w-[90px]" style={fontBody}>{placed.start_slot.name}</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400" style={fontLabel}>Start Slot (NO)</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Auxiliary Latch M1 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 w-12 font-semibold" style={fontLabel}>LATCH:</span>
                      <div 
                        onClick={() => placed.latch_slot && handleClearSlot("latch_slot")}
                        className={`w-28 h-12 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all ${
                          placed.latch_slot 
                            ? "border-purple-400 bg-purple-500/15 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]" 
                            : "border-slate-700 hover:border-purple-400/60 bg-slate-900/60 text-slate-500 text-xs"
                        }`}
                      >
                        {placed.latch_slot ? (
                          <>
                            <span className="text-xs font-bold" style={fontLabel}>{placed.latch_slot.symbol}</span>
                            <span className="text-[9px] truncate max-w-[90px]" style={fontBody}>{placed.latch_slot.name}</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400" style={fontLabel}>Latch Slot (M1)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`h-1 flex-1 transition-colors duration-200 ${
                      motorEnergized ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-slate-700"
                    }`}
                  />

                  {/* Slot 4: Output Coil */}
                  <div className="flex flex-col items-center mx-1">
                    <span
                      className="text-[10px] text-slate-400 mb-1.5 font-semibold"
                      style={fontLabel}
                    >
                      OUTPUT (M1)
                    </span>
                    <div 
                      onClick={() => placed.coil_slot && handleClearSlot("coil_slot")}
                      className={`w-22 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all ${
                        placed.coil_slot 
                          ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]" 
                          : "border-slate-700 hover:border-emerald-400/60 bg-slate-900/60 text-slate-500 text-xs"
                      }`}
                    >
                      {placed.coil_slot ? (
                        <>
                          <span className="text-sm font-bold" style={fontLabel}>{placed.coil_slot.symbol}</span>
                          <span className="text-[9px] truncate max-w-[80px]" style={fontBody}>{placed.coil_slot.name}</span>
                          <span className="text-[7px] text-emerald-400/70 uppercase">Click to remove</span>
                        </>
                      ) : (
                        <div className="text-center" style={fontLabel}>
                          <span className="block font-semibold text-slate-400">Slot 4</span>
                          <span className="text-[9px] text-slate-500">Coil (M1)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`h-1 w-6 transition-colors duration-200 ${
                      motorEnergized ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-slate-700"
                    }`}
                  />

                  {/* Right Ground Bus */}
                  <div className="w-3 h-28 rounded-sm bg-slate-700" />

                </div>
              </div>

              {/* Toolbox Palette */}
              <div className="pt-2">
                <div
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between"
                  style={fontLabel}
                >
                  <span>Available Components (Click to assign to target slot)</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">IEC 61131-3 Instruments</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVAILABLE_PALETTE.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3 rounded-xl flex flex-col items-center text-center space-y-2 transition-all hover:border-indigo-500/40 glass-card-sub-theme"
                    >
                      <span
                        className="text-sm font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700"
                        style={fontLabel}
                      >
                        {comp.symbol}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block" style={fontDisplay}>
                          {comp.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5" style={fontBody}>
                          {comp.standard}
                        </span>
                      </div>

                      <div className="pt-1 w-full">
                        {comp.type === "nc" && (
                          <button
                            onClick={() => handlePlace("stop_slot", comp)}
                            className="w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-white cursor-pointer shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                              ...fontLabel,
                            }}
                          >
                            Assign → Stop Slot
                          </button>
                        )}
                        {comp.type === "no" && (
                          <button
                            onClick={() => handlePlace("start_slot", comp)}
                            className="w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-white cursor-pointer shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                              ...fontLabel,
                            }}
                          >
                            Assign → Start Slot
                          </button>
                        )}
                        {comp.type === "latch" && (
                          <button
                            onClick={() => handlePlace("latch_slot", comp)}
                            className="w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-white cursor-pointer shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                              ...fontLabel,
                            }}
                          >
                            Assign → Latch Slot
                          </button>
                        )}
                        {comp.type === "coil" && (
                          <button
                            onClick={() => handlePlace("coil_slot", comp)}
                            className="w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-white cursor-pointer shadow-sm"
                            style={{
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              ...fontLabel,
                            }}
                          >
                            Assign → Coil Slot
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Callout */}
              {errorFeedback && (
                <div
                  className="p-3.5 rounded-xl text-rose-600 dark:text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in"
                  style={{
                    background: "rgba(244,63,94,0.12)",
                    border: "1px solid rgba(244,63,94,0.28)",
                    ...fontBody,
                  }}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorFeedback}</span>
                </div>
              )}

              {/* Execution Controls */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {!isSimulating ? (
                  <button
                    onClick={handleStartSimulation}
                    className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                      ...fontLabel,
                    }}
                  >
                    <Power className="w-4 h-4" />
                    <span>Energize 24V DC Bus & Verify Logic</span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                      onMouseDown={() => {
                        setStartPressed(true);
                        playSfx("click");
                      }}
                      onMouseUp={() => setStartPressed(false)}
                      onTouchStart={() => {
                        setStartPressed(true);
                        playSfx("click");
                      }}
                      onTouchEnd={() => setStartPressed(false)}
                      className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 select-none cursor-pointer ${
                        startPressed
                          ? "scale-95 shadow-inner"
                          : "hover:scale-[1.02]"
                      }`}
                      style={{
                        background: startPressed
                          ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                          : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        ...fontLabel,
                      }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{startPressed ? "Holding Start Contact..." : "Press & Hold Start PB (Momentary)"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setStopPressed(!stopPressed);
                        playSfx("wrong");
                      }}
                      className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                        stopPressed
                          ? "ring-2 ring-rose-400 scale-95"
                          : "hover:scale-[1.02]"
                      }`}
                      style={{
                        background: stopPressed
                          ? "linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)"
                          : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        color: "#ffffff",
                        ...fontLabel,
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{stopPressed ? "Disengage E-Stop Contact" : "Actuate E-Stop (Fail-Safe)"}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right: Industrial SCADA Visualization & Robotics Arm (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl space-y-4 glass-card-theme">
              
              <div className="flex items-center justify-between pb-1">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2"
                  style={fontLabel}
                >
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Line Telemetry: Station Alpha
                </span>
                <span
                  className="text-[11px] text-slate-500 dark:text-slate-400"
                  style={fontLabel}
                >
                  Scan Time: 1.2ms • 60Hz
                </span>
              </div>

              {/* Simulated Factory Floor */}
              <div
                className="h-64 rounded-xl relative overflow-hidden flex flex-col justify-end p-4"
                style={{
                  background: "#060911",
                  border: "1px solid rgba(99,102,241,0.2)",
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                
                {/* Telemetry Status OSD */}
                <div
                  className="absolute top-3 left-3 text-[10px] text-slate-300 space-y-1 z-10 p-2 rounded-lg"
                  style={{
                    background: "rgba(10,15,26,0.85)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    ...fontLabel,
                  }}
                >
                  <div>CONVEYOR DRIVE: <span className={motorEnergized ? "text-emerald-400 font-bold" : "text-slate-400"}>{motorEnergized ? "1450 RPM • 24V DC" : "IDLE (0 RPM)"}</span></div>
                  <div>ROBOT ARM DOF: <span className={boxPicked ? "text-cyan-400 font-bold" : "text-slate-400"}>{boxPicked ? "PALLET RETRIEVED" : "AWAITING SENSOR"}</span></div>
                  <div>STATUS: <span className={isSimulating ? (motorEnergized ? "text-emerald-400" : "text-amber-400") : "text-slate-400"}>{isSimulating ? (motorEnergized ? "ACTIVE LATCH" : "READY TO EXCITE") : "BUS DE-ENERGIZED"}</span></div>
                </div>

                {/* 3-DOF Articulated Robotic Arm */}
                <div 
                  className="absolute right-8 top-6 w-16 h-36 flex flex-col items-center pointer-events-none transition-transform duration-300"
                  style={{ transform: `rotate(${robotArmAngle}deg)` }}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-indigo-400 flex items-center justify-center shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  </div>
                  <div className="w-3 h-20 bg-slate-600 rounded-sm shadow-md" />
                  <div className="w-10 h-2.5 bg-slate-400 rounded-sm" />
                  <div className="flex justify-between w-8">
                    <div className="w-1.5 h-4 bg-cyan-400 rounded-b shadow-[0_0_6px_#22d3ee]" />
                    <div className="w-1.5 h-4 bg-cyan-400 rounded-b shadow-[0_0_6px_#22d3ee]" />
                  </div>
                </div>

                {/* Conveyor Belt & Pallet */}
                <div className="relative w-full z-10">
                  {!boxPicked && (
                    <div 
                      className="absolute -top-9 transition-all duration-75"
                      style={{ left: `${boxPosition}%` }}
                    >
                      <div
                        className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-[10px] text-slate-950 shadow-md"
                        style={{
                          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                          border: "1px solid #fde68a",
                          ...fontLabel,
                        }}
                      >
                        P-01
                      </div>
                    </div>
                  )}

                  {/* Conveyor Track */}
                  <div
                    className={`h-6 rounded-md flex items-center justify-around px-3 transition-colors ${
                      motorEnergized ? "bg-slate-800 border border-indigo-500/30" : "bg-slate-900 border border-slate-800"
                    }`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full border border-slate-600 bg-slate-700 ${motorEnergized ? "animate-spin" : ""}`} 
                        style={{
                          boxShadow: motorEnergized ? "0 0 6px rgba(99,102,241,0.4)" : "none",
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between px-4 pt-1.5">
                    <div className="w-2.5 h-4 bg-slate-700 rounded-b-xs" />
                    <div className="w-2.5 h-4 bg-slate-700 rounded-b-xs" />
                    <div className="w-2.5 h-4 bg-slate-700 rounded-b-xs" />
                  </div>
                </div>

              </div>

              {/* Validation Outcome */}
              {isSuccess ? (
                <div
                  className="p-5 rounded-2xl space-y-3 animate-in fade-in"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-300" style={fontDisplay}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Workbench Objective Completed (+100 XP)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed" style={fontBody}>
                    Seal-in auxiliary latch successfully verified! The circuit held continuous motor excitation through a momentary pulse and safely unloaded upon robotic sensor trigger.
                  </p>
                  <div className="pt-1 flex gap-2">
                    <Link
                      href="/arenas/dsa-dungeon"
                      className="px-4 py-2 rounded-xl text-white font-semibold text-xs transition-all hover:scale-[1.02] flex items-center gap-1.5 shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                        ...fontLabel,
                      }}
                    >
                      Next: Memory Crypt (CS & IT) <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl space-y-1.5 glass-card-sub-theme" style={fontBody}>
                  <div
                    className="font-bold text-indigo-600 dark:text-indigo-300 text-xs flex items-center gap-1.5"
                    style={fontLabel}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Interview Rubric Insight (Bosch / Siemens):
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    "Why is a seal-in circuit preferred over a mechanical detent switch in industrial automation?" — <em>Upon an electrical mains brownout, a mechanical toggle would dangerously restart moving machinery without human surveillance. A seal-in latch drops out automatically, requiring an intentional manual push to reset.</em>
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
