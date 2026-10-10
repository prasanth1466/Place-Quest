"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

export type DomainType = "robotics" | "cs" | "ece" | "ee" | "mech" | "civil";

export interface InterviewResult {
  id: string;
  domain: string;
  role: string;
  overallScore: number;
  clarityScore: number;
  technicalScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  date: string;
}

interface GameContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  domain: DomainType;
  setDomain: (domain: DomainType) => void;
  xp: number;
  streak: number;
  gems: number;
  level: string;
  levelTier: number;
  addXP: (amount: number) => void;
  completedQuests: string[];
  markQuestCompleted: (questId: string, xpReward: number) => void;
  interviewResults: InterviewResult[];
  addInterviewResult: (result: InterviewResult) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSfx: (type: "click" | "win" | "correct" | "wrong") => void;
  triggerConfetti: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [domain, setDomain] = useState<DomainType>("robotics");
  const [xp, setXp] = useState<number>(420);
  const [streak, setStreak] = useState<number>(6);
  const [gems, setGems] = useState<number>(85);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([
    {
      id: "demo-eval-1",
      domain: "Robotics & Automation",
      role: "Automation Systems Engineer (Bosch Track)",
      overallScore: 8.6,
      clarityScore: 9.0,
      technicalScore: 8.2,
      feedback: "Strong grasp of PLC cycle scans and closed-loop feedback. Recommended: elaborate further on anti-windup clamping thresholds.",
      strengths: ["Structured STAR response methodology", "Accurate sensor & actuator nomenclature", "Clear fail-safe interlock justification"],
      improvements: ["Quantify saturation mitigation time constants", "Address industrial SIL safety ratings"],
      date: "Recent"
    }
  ]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("placequest_theme") as "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
        document.documentElement.classList.toggle("light", savedTheme === "light");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = prefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", prefersDark);
        document.documentElement.classList.toggle("light", !prefersDark);
      }

      const savedXP = localStorage.getItem("placequest_xp");
      if (savedXP) setXp(parseInt(savedXP, 10));

      const savedQuests = localStorage.getItem("placequest_quests");
      if (savedQuests) setCompletedQuests(JSON.parse(savedQuests));

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    } catch {
      // LocalStorage or SW fallback
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("placequest_theme", nextTheme);
    } catch {}
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
    playSfx("click");
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const playSfx = (type: "click" | "win" | "correct" | "wrong") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "click") {
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "correct") {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "win") {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio fallback
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#6366f1", "#10b981", "#f59e0b"]
      });
    } catch {
      // Confetti fallback
    }
  };

  const addXP = (amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      localStorage.setItem("placequest_xp", next.toString());
      return next;
    });
    setGems((prev) => prev + Math.floor(amount / 10));
    playSfx("win");
    triggerConfetti();
  };

  const markQuestCompleted = (questId: string, xpReward: number) => {
    if (!completedQuests.includes(questId)) {
      const nextQuests = [...completedQuests, questId];
      setCompletedQuests(nextQuests);
      localStorage.setItem("placequest_quests", JSON.stringify(nextQuests));
      addXP(xpReward);
    }
  };

  const addInterviewResult = (result: InterviewResult) => {
    setInterviewResults((prev) => [result, ...prev]);
    addXP(100);
  };

  const getTier = (pts: number) => {
    if (pts < 250) return { title: "Tier 1: Foundation Associate", tier: 1 };
    if (pts < 600) return { title: "Tier 2: Systems Specialist", tier: 2 };
    if (pts < 1100) return { title: "Tier 3: Core Domain Lead", tier: 3 };
    if (pts < 1800) return { title: "Tier 4: Staff Candidate", tier: 4 };
    return { title: "Tier 5: Placed Engineer", tier: 5 };
  };

  const activeTier = getTier(xp);

  return (
    <GameContext.Provider
      value={{
        theme,
        toggleTheme,
        domain,
        setDomain,
        xp,
        streak,
        gems,
        level: activeTier.title,
        levelTier: activeTier.tier,
        addXP,
        completedQuests,
        markQuestCompleted,
        interviewResults,
        addInterviewResult,
        soundEnabled,
        toggleSound,
        playSfx,
        triggerConfetti
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
