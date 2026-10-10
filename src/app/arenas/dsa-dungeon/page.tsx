"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  GitFork,
  Check,
  Info,
  ShieldCheck,
} from "lucide-react";

const fontDisplay = { fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" };
const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };
const fontBody = { fontFamily: "var(--font-body, 'Manrope'), sans-serif" };

type Stage = "chamber1" | "chamber2" | "completed" | "failed";

export default function DsaWorkbenchPage() {
  const { addXP, markQuestCompleted, playSfx, triggerConfetti } = useGame();

  const [stage, setStage] = useState<Stage>("chamber1");
  const [healthScore, setHealthScore] = useState<number>(3);
  const [score, setScore] = useState<number>(0);

  const [stackItems, setStackItems] = useState<string[]>([]);
  const [queueItems, setQueueItems] = useState<string[]>([]);
  const [chamber1Solved, setChamber1Solved] = useState<boolean>(false);
  const [chamber1Feedback, setChamber1Feedback] = useState<string | null>(null);

  const [bstNode, setBstNode] = useState<{ val: number; left?: number; right?: number }>({
    val: 50,
    left: 25,
    right: 75,
  });
  const [targetKey, setTargetKey] = useState<number>(68);
  const [bstDepth, setBstDepth] = useState<number>(0);
  const [chamber2Feedback, setChamber2Feedback] = useState<string | null>(null);

  const resetAll = () => {
    setStage("chamber1");
    setHealthScore(3);
    setScore(0);
    setStackItems([]);
    setQueueItems([]);
    setChamber1Solved(false);
    setChamber1Feedback(null);
    setBstNode({ val: 50, left: 25, right: 75 });
    setTargetKey(68);
    setBstDepth(0);
    setChamber2Feedback(null);
    playSfx("click");
  };

  const handlePenalty = (msg: string) => {
    playSfx("wrong");
    setHealthScore((prev) => {
      const next = prev - 1;
      if (next <= 0) setStage("failed");
      return next;
    });
  };

  const handlePush = (type: "stack" | "queue", label: string) => {
    playSfx("click");
    if (type === "stack") {
      setStackItems((prev) => [...prev, label]);
    } else {
      setQueueItems((prev) => [...prev, label]);
    }
  };

  const handlePop = (type: "stack" | "queue") => {
    if (type === "stack") {
      if (stackItems.length === 0) return;
      playSfx("click");
      const popped = stackItems[stackItems.length - 1];
      setStackItems((prev) => prev.slice(0, prev.length - 1));
      if (popped.includes("Profile Settings")) {
        setChamber1Solved(true);
        playSfx("correct");
        setScore((prev) => prev + 40);
        setChamber1Feedback(
          "Verification Succeeded: The LIFO Call Stack correctly restores the immediately preceding execution frame."
        );
      }
    } else {
      if (queueItems.length === 0) return;
      playSfx("click");
      setQueueItems((prev) => prev.slice(1));
      handlePenalty(
        "FIFO Buffer Mismatch: Dequeue operations return the earliest buffered frame (Home), which violates browser undo semantics."
      );
    }
  };

  const handleBstChoice = (direction: "left" | "right") => {
    playSfx("click");
    if (bstDepth === 0) {
      if (direction === "right") {
        playSfx("correct");
        setBstNode({ val: 75, left: 60, right: 85 });
        setBstDepth(1);
        setChamber2Feedback(
          `Valid Traversal: Target Key (68) > Root Key (50), descending into Right Subtree.`
        );
      } else {
        handlePenalty(
          "Binary Search Property Violated: Keys greater than current node must branch into the Right Subtree."
        );
      }
    } else if (bstDepth === 1) {
      if (direction === "left") {
        playSfx("win");
        triggerConfetti();
        setScore((prev) => prev + 40);
        setStage("completed");
        markQuestCompleted("dsa-dungeon", 80);
      } else {
        handlePenalty(
          "Binary Search Property Violated: Target Key (68) < Node Key (75), so routing must branch into Left Subtree."
        );
      }
    }
  };

  return (
    <div className="flex-1 min-h-screen py-8 page-theme-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-500/15">
          <div>
            <Link
              href="/arenas"
              className="flex items-center gap-1 mb-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              style={fontLabel}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Workbenches
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                }}
              >
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                  style={fontDisplay}
                >
                  Algorithmic Memory & Graph Visualizer
                </h1>
                <span
                  className="text-[11px] text-slate-500 dark:text-slate-400"
                  style={fontLabel}
                >
                  Data Structures • Call Stack Allocation & Binary Trees
                </span>
              </div>
            </div>
          </div>

          {/* Score & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Integrity */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-indigo-500/20"
              style={fontLabel}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              Checks:{" "}
              <strong className="text-indigo-600 dark:text-indigo-300">
                {healthScore} / 3
              </strong>
            </div>

            {/* XP Score */}
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
              style={fontLabel}
            >
              Score: {score} / 80 XP
            </div>

            {/* Reset */}
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-indigo-500/20 cursor-pointer"
              style={fontLabel}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="p-6 rounded-2xl space-y-6 relative overflow-hidden glass-card-theme">
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }}
          />

          {/* ── Stage 1: Stack vs Queue ── */}
          {stage === "chamber1" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
                <div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
                    style={fontLabel}
                  >
                    Verification Chamber 01
                  </span>
                  <h2
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
                    style={fontDisplay}
                  >
                    Memory Buffer Allocation: LIFO Call Stack vs FIFO Event Queue
                  </h2>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400" style={fontLabel}>
                  Complexity: O(1) Push/Pop
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300" style={fontBody}>
                Three execution contexts were created in sequence:{" "}
                <code
                  className="px-2 py-0.5 rounded-md text-[11px] bg-slate-200 dark:bg-slate-800 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold"
                  style={fontLabel}
                >
                  Home → Dashboard → Profile Settings
                </code>
                . Populate both data structures and execute the correct extraction operation to retrieve the immediate previous active frame.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Stack Container */}
                <div className="p-4 rounded-xl space-y-3 glass-card-sub-theme">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
                      style={fontLabel}
                    >
                      STRUCTURE A: CALL STACK (LIFO)
                    </span>
                    <span className="text-[10px] text-slate-400" style={fontLabel}>
                      ESP Register Pointer
                    </span>
                  </div>

                  <div
                    className="h-40 rounded-xl p-2.5 flex flex-col-reverse gap-1.5 overflow-hidden"
                    style={{
                      background: "#060911",
                      border: "1px dashed rgba(99,102,241,0.25)",
                    }}
                  >
                    {stackItems.length === 0 ? (
                      <div
                        className="h-full flex items-center justify-center text-xs text-slate-500"
                        style={fontLabel}
                      >
                        Empty Stack Frame
                      </div>
                    ) : (
                      stackItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg text-xs font-medium flex items-center justify-between"
                          style={{
                            background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 100%)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            color: "#c4b5fd",
                            ...fontLabel,
                          }}
                        >
                          <span>{item}</span>
                          <span className="text-[10px] opacity-75">
                            {idx === stackItems.length - 1 ? "[TOP]" : ""}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handlePush(
                          "stack",
                          `Frame 0${stackItems.length + 1}: ${
                            stackItems.length === 0
                              ? "Home"
                              : stackItems.length === 1
                              ? "Dashboard"
                              : "Profile Settings"
                          }`
                        )
                      }
                      disabled={stackItems.length >= 3}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-indigo-500/20 cursor-pointer"
                      style={fontLabel}
                    >
                      + Push Execution Frame
                    </button>
                    <button
                      onClick={() => handlePop("stack")}
                      disabled={stackItems.length === 0}
                      className="py-2 px-4 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 shadow-sm cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        ...fontLabel,
                      }}
                    >
                      POP (Undo)
                    </button>
                  </div>
                </div>

                {/* Queue Container */}
                <div className="p-4 rounded-xl space-y-3 glass-card-sub-theme">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold text-slate-600 dark:text-slate-400"
                      style={fontLabel}
                    >
                      STRUCTURE B: MESSAGE BUFFER (FIFO)
                    </span>
                    <span className="text-[10px] text-slate-400" style={fontLabel}>
                      Head / Tail Pointers
                    </span>
                  </div>

                  <div
                    className="h-40 rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden"
                    style={{
                      background: "#060911",
                      border: "1px dashed rgba(99,102,241,0.25)",
                    }}
                  >
                    {queueItems.length === 0 ? (
                      <div
                        className="h-full flex items-center justify-center text-xs text-slate-500"
                        style={fontLabel}
                      >
                        Empty Message Queue
                      </div>
                    ) : (
                      queueItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg text-xs font-medium flex items-center justify-between text-slate-300"
                          style={{
                            background: "rgba(19,29,49,0.8)",
                            border: "1px solid rgba(99,102,241,0.15)",
                            ...fontLabel,
                          }}
                        >
                          <span>{item}</span>
                          <span className="text-[10px] opacity-75">
                            {idx === 0 ? "[FRONT]" : ""}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handlePush(
                          "queue",
                          `Frame 0${queueItems.length + 1}: ${
                            queueItems.length === 0
                              ? "Home"
                              : queueItems.length === 1
                              ? "Dashboard"
                              : "Profile Settings"
                          }`
                        )
                      }
                      disabled={queueItems.length >= 3}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-indigo-500/20 cursor-pointer"
                      style={fontLabel}
                    >
                      + Enqueue Message
                    </button>
                    <button
                      onClick={() => handlePop("queue")}
                      disabled={queueItems.length === 0}
                      className="py-2 px-4 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-indigo-500/20 cursor-pointer"
                      style={fontLabel}
                    >
                      DEQUEUE
                    </button>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {chamber1Feedback && (
                <div
                  className="p-4 rounded-xl flex items-center justify-between gap-4 animate-in fade-in"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#059669",
                  }}
                >
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300" style={fontBody}>
                    {chamber1Feedback}
                  </span>
                  <button
                    onClick={() => {
                      setStage("chamber2");
                      playSfx("click");
                    }}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      ...fontLabel,
                    }}
                  >
                    Proceed to Chamber 02 (BST) →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Stage 2: BST Traversal ── */}
          {stage === "chamber2" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
                <div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"
                    style={fontLabel}
                  >
                    Verification Chamber 02
                  </span>
                  <h2
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
                    style={fontDisplay}
                  >
                    Binary Search Tree Partition Traversal
                  </h2>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400" style={fontLabel}>
                  Depth: {bstDepth + 1} • O(log N)
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300" style={fontBody}>
                Target Key to insert or find:{" "}
                <strong
                  className="font-mono text-sm px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
                >
                  KEY = {targetKey}
                </strong>
                . Route through the tree structure by selecting the mathematically valid subtree branch.
              </p>

              {/* BST Visualizer */}
              <div
                className="p-8 rounded-2xl flex flex-col items-center justify-center space-y-6"
                style={{
                  background: "#060911",
                  border: "1px solid rgba(99,102,241,0.2)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold"
                  style={fontLabel}
                >
                  Evaluation Node at Depth {bstDepth}
                </span>

                <div
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.3) 100%)",
                    border: "2px solid #6366f1",
                    boxShadow: "0 0 24px rgba(99,102,241,0.35)",
                  }}
                >
                  <span className="text-[9px] text-indigo-300 font-bold" style={fontLabel}>
                    NODE
                  </span>
                  <span
                    className="text-2xl font-bold text-white"
                    style={fontDisplay}
                  >
                    {bstNode.val}
                  </span>
                </div>

                <div className="text-xs text-slate-300" style={fontLabel}>
                  Compare Target{" "}
                  <span className="text-indigo-300 font-bold">[{targetKey}]</span>{" "}
                  with Node Key{" "}
                  <span className="text-emerald-400 font-bold">[{bstNode.val}]</span>:
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                  <button
                    onClick={() => handleBstChoice("left")}
                    className="flex-1 py-3 px-3 rounded-xl flex flex-col items-center transition-all bg-slate-800/80 hover:bg-slate-700/80 border border-indigo-500/30 text-white cursor-pointer shadow-md"
                  >
                    <span className="text-sm font-semibold" style={fontLabel}>
                      Branch Left
                    </span>
                    <span className="text-[10px] mt-0.5 text-slate-400" style={fontLabel}>
                      Key &lt; {bstNode.val}
                    </span>
                  </button>

                  <button
                    onClick={() => handleBstChoice("right")}
                    className="flex-1 py-3 px-3 rounded-xl flex flex-col items-center transition-all cursor-pointer shadow-md text-white"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.3) 100%)",
                      border: "1px solid rgba(99,102,241,0.4)",
                    }}
                  >
                    <span className="text-sm font-semibold" style={fontLabel}>
                      Branch Right
                    </span>
                    <span className="text-[10px] mt-0.5 text-indigo-300" style={fontLabel}>
                      Key &gt; {bstNode.val}
                    </span>
                  </button>
                </div>

                {chamber2Feedback && (
                  <div
                    className="text-xs px-4 py-2.5 rounded-lg w-full text-center bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-medium"
                    style={fontBody}
                  >
                    {chamber2Feedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Completed ── */}
          {stage === "completed" && (
            <div className="text-center py-12 space-y-5 animate-in fade-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "2px solid rgba(16,185,129,0.5)",
                  boxShadow: "0 0 24px rgba(16,185,129,0.25)",
                }}
              >
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  style={fontDisplay}
                >
                  Workbench Assessment Completed (+80 XP)
                </h2>
                <p
                  className="text-xs max-w-md mx-auto mt-2 text-slate-600 dark:text-slate-300 leading-relaxed"
                  style={fontBody}
                >
                  You successfully validated Call Stack undo restoration and Binary Search Tree
                  partition invariants under time-critical execution.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2 flex-wrap">
                <Link
                  href="/interview"
                  className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    ...fontLabel,
                  }}
                >
                  Proceed to AI Mock Interview →
                </Link>
                <button
                  onClick={resetAll}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold transition-all bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-indigo-500/20 cursor-pointer"
                  style={fontLabel}
                >
                  Re-run Workbench
                </button>
              </div>
            </div>
          )}

          {/* ── Failed ── */}
          {stage === "failed" && (
            <div className="text-center py-12 space-y-5 animate-in fade-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-rose-500"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "2px solid rgba(239,68,68,0.35)",
                  boxShadow: "0 0 24px rgba(239,68,68,0.2)",
                }}
              >
                !
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  style={fontDisplay}
                >
                  Session Exhausted
                </h2>
                <p
                  className="text-xs max-w-md mx-auto mt-2 text-slate-600 dark:text-slate-300"
                  style={fontBody}
                >
                  Multiple structural violations tripped the runtime debugger. Reset to verify
                  with clean invariant tracing.
                </p>
              </div>
              <button
                onClick={resetAll}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer shadow-md"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  ...fontLabel,
                }}
              >
                Reset Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
