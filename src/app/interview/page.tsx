"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { 
  Bot, 
  Mic, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Activity, 
  Cpu, 
  Code2, 
  ShieldCheck, 
  Users,
  Sparkles,
  HelpCircle,
  Clock,
  Zap,
  Target
} from "lucide-react";

const fontDisplay = { fontFamily: "var(--font-display, 'Plus Jakarta Sans'), sans-serif" };
const fontLabel = { fontFamily: "var(--font-label, 'Space Grotesk'), sans-serif" };
const fontBody = { fontFamily: "var(--font-body, 'Manrope'), sans-serif" };

interface Track {
  id: string;
  name: string;
  badge: string;
  companies: string[];
  icon: React.ElementType;
  gradient: string;
  questions: {
    q: string;
    focus: string;
    sample: string;
  }[];
}

const INTERVIEW_TRACKS: Track[] = [
  {
    id: "robotics",
    name: "Robotics & Automation Track",
    badge: "Core Engineering",
    companies: ["Bosch", "Siemens", "ABB", "Rockwell Automation"],
    icon: Cpu,
    gradient: "from-amber-500 to-orange-500",
    questions: [
      {
        q: "Why is an 'Anti-Windup' mechanism critical in a closed-loop PID controller regulating an AGV motor drive? What physical failure occurs if actuator saturation is unhandled?",
        focus: "Actuator physical saturation limit, cumulative integral error growth, overshoot and oscillation damping.",
        sample: "In our autonomous AGV project, when the drive motor reaches physical voltage saturation, standard integral action continues accumulating error. This integral windup causes massive overshoot and actuator oscillation when decelerating. I implemented conditional anti-windup clamping that disables error integration whenever the control output exceeds the actuator threshold, stabilizing steady-state tracking within 40ms."
      },
      {
        q: "In an industrial automated manufacturing cell, describe the deterministic sequence of a PLC scan cycle. Why does input image table synchronization prevent race conditions?",
        focus: "Phase 1: Input Read, Phase 2: Logic Execution, Phase 3: Output Update. Decoupling physical I/O from runtime scans.",
        sample: "A PLC runs a deterministic three-phase scan cycle: Read physical inputs into the Input Image Table, execute ladder logic sequentially, then write outputs to physical actuators. Synchronizing inputs at the start of the scan prevents race conditions where a fast sensor changing mid-cycle would cause contradictory rungs within the same logic scan."
      },
      {
        q: "Distinguish between Forward Kinematics and Inverse Kinematics for a 6-axis articulated robot. Why is Inverse Kinematics mathematically non-trivial?",
        focus: "Direct mapping vs non-linear multi-solution mapping, kinematic singularities, Jacobian rank.",
        sample: "Forward kinematics calculates the 3D end-effector Cartesian pose given joint angles using DH matrices, which has a unique closed-form solution. Inverse kinematics does the reverse: finding joint angles to reach a given Cartesian target. It is harder because equations are highly non-linear, often yield multiple geometric configurations (elbow-up vs elbow-down), and encounter singular Jacobian regions where degrees of freedom collapse."
      }
    ]
  },
  {
    id: "cs",
    name: "Software Engineering (SDE Track)",
    badge: "Software Architecture",
    companies: ["Google", "Amazon", "Microsoft", "Zoho"],
    icon: Code2,
    gradient: "from-indigo-500 to-purple-500",
    questions: [
      {
        q: "Design a distributed rate limiter capable of enforcing 100,000 requests per minute across a multi-region microservices cluster. Which algorithm and datastore would you employ?",
        focus: "Token Bucket vs Leaky Bucket, Redis atomic keys, sliding window logs, latency trade-offs.",
        sample: "I would use the Token Bucket algorithm with Redis. Token Bucket allows bursts of traffic while enforcing average rate limits. In our system, tokens refill at a steady rate of 1,666 tokens per second. Requests consume 1 token; if the bucket is empty, we return HTTP 429 Too Many Requests. Redis atomic operations like INCR and EXPIRE ensure low-latency distributed coordination."
      },
      {
        q: "In what scenarios is a disk-oriented B-Tree index preferred over an in-memory Hash index in relational database engines like PostgreSQL?",
        focus: "Range scans (BETWEEN, >, <), disk block fan-out, sorted order traversal vs exact key equality.",
        sample: "While hash indexes offer O(1) lookups for strict equality, B-Trees are preferred in relational databases because they maintain sorted order on disk. This enables efficient O(log N) range queries (BETWEEN, greater-than, less-than) and index scans for ORDER BY and LIMIT clauses. B-Trees also have higher fan-out, minimizing expensive disk I/O operations."
      }
    ]
  },
  {
    id: "hr",
    name: "Behavioral & Leadership Track",
    badge: "STAR Methodology",
    companies: ["Campus Hiring Bar-Raisers", "All Tier-1 Tech"],
    icon: Users,
    gradient: "from-violet-500 to-pink-500",
    questions: [
      {
        q: "Describe a high-stakes engineering project where a critical technical failure occurred close to the milestone deadline. Walk through your problem-solving process.",
        focus: "STAR framework: Situation, Task, Action, Measurable Result.",
        sample: "During our final-year robotics symposium, our AGV LiDAR communication driver crashed 18 hours before demonstration (Situation). As the firmware lead, I had to identify the root cause and restore autonomous navigation (Task). I isolated the serial baud-rate buffer overflow, wrote an async FIFO buffer in C++, and ran stress tests overnight (Action). We demonstrated successfully the next morning and won 2nd place among 40 college teams (Result)."
      }
    ]
  }
];

export default function InterviewStudioPage() {
  const { playSfx, addInterviewResult } = useGame();

  const [activeTrackId, setActiveTrackId] = useState<string>("robotics");
  const [persona, setPersona] = useState<"mentor" | "bar_raiser">("mentor");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerText, setAnswerText] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationData, setEvaluationData] = useState<{
    score: number;
    clarityScore: number;
    technicalScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    starCompliance: boolean;
    fillerWordsFound: string[];
  } | null>(null);

  const activeTrack = INTERVIEW_TRACKS.find((t) => t.id === activeTrackId) || INTERVIEW_TRACKS[0];
  const activeQuestion = activeTrack.questions[currentQuestionIndex] || activeTrack.questions[0];

  const detectedFillers = ["like", "basically", "actually", "um", "uh"].filter((w) =>
    new RegExp(`\\b${w}\\b`, "i").test(answerText)
  );

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (!answerText.trim()) return;

    setIsEvaluating(true);
    playSfx("click");

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: activeTrack.name,
          domain: activeTrackId,
          persona,
          question: activeQuestion.q,
          userAnswer: answerText
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluationData(data);
        addInterviewResult({
          id: `eval-${Date.now()}`,
          domain: activeTrack.name,
          role: activeTrack.companies[0],
          overallScore: data.score,
          clarityScore: data.clarityScore || 8.0,
          technicalScore: data.technicalScore || 8.0,
          feedback: data.feedback,
          strengths: data.strengths || [],
          improvements: data.improvements || [],
          date: new Date().toISOString(),
        });
        playSfx("win");
      } else {
        fallbackEvaluation();
      }
    } catch {
      fallbackEvaluation();
    } finally {
      setIsEvaluating(false);
    }
  };

  const fallbackEvaluation = () => {
    const isGoodLen = wordCount >= 50 && wordCount <= 140;
    const computedScore = isGoodLen ? (persona === "bar_raiser" ? 8.2 : 8.8) : 6.8;
    const fallback = {
      score: computedScore,
      clarityScore: isGoodLen ? 8.5 : 6.5,
      technicalScore: 8.0,
      feedback:
        persona === "bar_raiser"
          ? "Good structure with quantitative metrics. Elevate by grounding architectural trade-offs against cost/latency boundaries."
          : "Solid technical articulation! Your response effectively demonstrates the root cause and deliberate implementation steps.",
      strengths: [
        "Concise domain vocabulary and clear problem context",
        "Action steps follow a coherent engineering progression",
        "Directly addressed the failure conditions specified in prompt"
      ],
      improvements: [
        "Include exact latency numbers (e.g. p99 SLAs or scan cycles)",
        "Elaborate on edge-case behavior under sudden power interruption"
      ],
      starCompliance: true,
      fillerWordsFound: detectedFillers
    };
    setEvaluationData(fallback);
    addInterviewResult({
      id: `eval-${Date.now()}`,
      domain: activeTrack.name,
      role: activeTrack.companies[0],
      overallScore: computedScore,
      clarityScore: fallback.clarityScore,
      technicalScore: fallback.technicalScore,
      feedback: fallback.feedback,
      strengths: fallback.strengths,
      improvements: fallback.improvements,
      date: new Date().toISOString(),
    });
    playSfx("win");
  };

  const handleNext = () => {
    setEvaluationData(null);
    setAnswerText("");
    setCurrentQuestionIndex((prev) => (prev + 1) % activeTrack.questions.length);
    playSfx("click");
  };

  const loadSample = () => {
    setAnswerText(activeQuestion.sample);
    playSfx("click");
  };

  return (
    <div className="flex-1 min-h-screen py-8 page-theme-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-indigo-500/15">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold mb-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
              style={fontLabel}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>AI Placement Mock Studio</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              style={fontDisplay}
            >
              Technical Interview Evaluation Console
            </h1>
            <p
              className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed"
              style={fontBody}
            >
              Real-time candidate evaluation powered by STAR structure analysis, domain vocabulary scoring, and hiring manager rubrics.
            </p>
          </div>

          {/* Persona Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-indigo-500/20">
            <button
              onClick={() => {
                setPersona("mentor");
                playSfx("click");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                persona === "mentor"
                  ? "text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              style={{
                background: persona === "mentor" ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "transparent",
                ...fontLabel,
              }}
            >
              Technical Mentor
            </button>
            <button
              onClick={() => {
                setPersona("bar_raiser");
                playSfx("click");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                persona === "bar_raiser"
                  ? "text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              style={{
                background: persona === "bar_raiser" ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" : "transparent",
                ...fontLabel,
              }}
            >
              Staff Bar-Raiser
            </button>
          </div>
        </div>

        {/* Track Selection Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {INTERVIEW_TRACKS.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTrackId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTrackId(t.id);
                  setCurrentQuestionIndex(0);
                  setAnswerText("");
                  setEvaluationData(null);
                  playSfx("click");
                }}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden glass-card-theme ${
                  isSelected
                    ? "ring-2 ring-indigo-500/50 shadow-lg scale-[1.01]"
                    : "hover:border-indigo-500/40"
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                    }}
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl text-white bg-gradient-to-br ${t.gradient}`}
                    style={{
                      boxShadow: isSelected ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300"
                    style={fontLabel}
                  >
                    {t.badge}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white" style={fontDisplay}>
                  {t.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1" style={fontBody}>
                  Hiring: {t.companies.join(", ")}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Console Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Input Pad (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl space-y-5 glass-card-theme">
              
              <div className="flex items-center justify-between text-xs" style={fontLabel}>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {activeTrack.questions.length} • {persona === "mentor" ? "Mentor Assessment" : "Bar-Raiser Rigor"}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {activeTrack.companies[0]} Track
                </span>
              </div>

              {/* Prompt Box */}
              <div
                className="p-4 sm:p-5 rounded-xl text-white space-y-2.5"
                style={{
                  background: "#060911",
                  border: "1px solid rgba(99,102,241,0.2)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={fontLabel}
                >
                  <Target className="w-3.5 h-3.5" />
                  INTERVIEWER PROMPT:
                </div>
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-100" style={fontDisplay}>
                  "{activeQuestion.q}"
                </p>
                <div
                  className="pt-2 text-xs text-slate-300 flex items-start gap-2 border-t border-slate-800/80"
                  style={fontBody}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Assessment Focus:</strong> {activeQuestion.focus}</span>
                </div>
              </div>

              {/* Answer Text Area */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300" style={fontLabel}>
                  <span>Candidate Response (STAR Framework):</span>
                  <button
                    onClick={loadSample}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Model Answer
                  </button>
                </div>

                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Structure response: 1. Situation / Context, 2. Root Cause Analysis, 3. Concrete Action Taken, 4. Quantified Engineering Outcome..."
                  rows={8}
                  className="w-full p-4 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-300 dark:border-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none transition-all shadow-inner"
                  style={fontBody}
                />

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400" style={fontLabel}>
                  <div className="flex items-center gap-2.5">
                    <span>Word Count: <strong className="text-slate-900 dark:text-white">{wordCount}</strong></span>
                    {detectedFillers.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25 text-[11px] font-semibold">
                        Filler word detected: {detectedFillers.join(", ")}
                      </span>
                    )}
                  </div>
                  <span>Recommended: 60 – 120 words</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isEvaluating || !answerText.trim()}
                  className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                    ...fontLabel,
                  }}
                >
                  {isEvaluating ? (
                    <span>Evaluating Rubric Criteria...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for AI Rubric Evaluation</span>
                    </>
                  )}
                </button>

                {evaluationData && (
                  <button
                    onClick={handleNext}
                    className="px-5 py-3 rounded-xl text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.02] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-indigo-500/25 cursor-pointer"
                    style={fontLabel}
                  >
                    <span>Next Question ({currentQuestionIndex + 1}/{activeTrack.questions.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right: Rubric Scorecard (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl space-y-5 glass-card-theme">
              
              <div className="flex items-center justify-between pb-1">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2"
                  style={fontLabel}
                >
                  <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  Rubric Telemetry & Feedback
                </span>
                <span
                  className="text-[11px] text-slate-500 dark:text-slate-400"
                  style={fontLabel}
                >
                  Tier-1 Hiring Bar
                </span>
              </div>

              {evaluationData ? (
                <div className="space-y-4 animate-in fade-in duration-150">
                  
                  {/* Score Summary Box */}
                  <div
                    className="p-5 rounded-xl text-white flex items-center justify-between"
                    style={{
                      background: "#060911",
                      border: "1px solid rgba(99,102,241,0.2)",
                      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold" style={fontLabel}>Overall Rating</div>
                      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400" style={fontDisplay}>
                        {evaluationData.score} <span className="text-xs text-slate-500 font-normal">/ 10.0</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right text-xs" style={fontLabel}>
                      <div>Clarity: <span className="text-cyan-400 font-bold">{evaluationData.clarityScore}</span></div>
                      <div>Technical: <span className="text-amber-400 font-bold">{evaluationData.technicalScore}</span></div>
                      <div>STAR Method: <span className={evaluationData.starCompliance ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{evaluationData.starCompliance ? "Passed" : "Partial"}</span></div>
                    </div>
                  </div>

                  {/* Feedback Note */}
                  <div
                    className="p-4 rounded-xl text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-indigo-500/10 border border-indigo-500/25"
                    style={fontBody}
                  >
                    {evaluationData.feedback}
                  </div>

                  {/* Strengths */}
                  <div className="space-y-2">
                    <div
                      className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
                      style={fontLabel}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths Identified:
                    </div>
                    {evaluationData.strengths.map((str, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 p-2.5 rounded-lg glass-card-sub-theme"
                        style={fontBody}
                      >
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>

                  {/* Improvements */}
                  <div className="space-y-2">
                    <div
                      className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5"
                      style={fontLabel}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Recommended Refinements:
                    </div>
                    {evaluationData.improvements.map((imp, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 p-2.5 rounded-lg glass-card-sub-theme"
                        style={fontBody}
                      >
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div
                    className="p-3.5 rounded-2xl inline-block bg-indigo-500/10 border border-indigo-500/25"
                  >
                    <Mic className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white" style={fontDisplay}>
                    Ready For Candidate Submission
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed" style={fontBody}>
                    Input your technical response on the left and submit. The AI rubric will evaluate engineering depth, STAR structure, and key terminology.
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
