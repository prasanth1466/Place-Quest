import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { role, domain, persona, question, userAnswer } = await req.json();

    if (!userAnswer || userAnswer.trim().length < 5) {
      return NextResponse.json({
        score: 2.0,
        clarityScore: 3.0,
        technicalScore: 2.0,
        feedback: "Your response was too brief. In technical interviews, interviewers look for structured explanations, concrete examples, and trade-off considerations.",
        strengths: ["Attempted response"],
        improvements: ["Elaborate on core engineering principles", "Use the STAR format (Situation, Task, Action, Result)"],
        starCompliance: false,
        fillerWordsFound: []
      });
    }

    const text = userAnswer.toLowerCase();

    // Analyze filler words
    const commonFillers = ["like", "basically", "actually", "um", "uh", "you know", "kind of", "sort of"];
    const foundFillers = commonFillers.filter((f) => {
      const regex = new RegExp(`\\b${f}\\b`, "i");
      return regex.test(userAnswer);
    });

    // Check STAR compliance
    const hasSituationOrTask = /project|scenario|problem|assigned|situation|client|company|team/i.test(userAnswer);
    const hasAction = /implemented|designed|built|developed|calculated|configured|tuned|analyzed/i.test(userAnswer);
    const hasResult = /result|achieved|improved|reduced|optimized|successful|outcome|efficiency/i.test(userAnswer);
    const starScore = (hasSituationOrTask ? 1 : 0) + (hasAction ? 1 : 0) + (hasResult ? 1 : 0);

    // Domain keyword check
    let technicalMatches = 0;
    const domainKeywords = [
      "plc", "ladder", "sensor", "actuator", "motor", "pid", "kinematics", "ros",
      "stack", "queue", "binary", "tree", "complexity", "o(n)", "o(1)", "algorithm",
      "circuit", "voltage", "current", "kvl", "kcl", "impedance", "transistor",
      "latency", "cache", "database", "sql", "state", "controller", "feedback"
    ];

    domainKeywords.forEach((kw) => {
      if (text.includes(kw)) technicalMatches += 1;
    });

    // Calculate simulated rubric scores
    const words = userAnswer.trim().split(/\s+/).length;
    let baseScore = 6.0;

    if (words > 40) baseScore += 1.0;
    if (words > 80) baseScore += 0.8;
    if (technicalMatches >= 2) baseScore += 1.2;
    if (starScore >= 2) baseScore += 0.8;
    if (foundFillers.length > 2) baseScore -= 0.6;

    const overallScore = Math.min(9.8, Math.max(3.5, parseFloat(baseScore.toFixed(1))));
    const clarityScore = Math.min(9.8, Math.max(4.0, parseFloat((overallScore + (foundFillers.length > 1 ? -0.8 : 0.5)).toFixed(1))));
    const technicalScore = Math.min(9.8, Math.max(3.0, parseFloat((overallScore + (technicalMatches >= 2 ? 0.6 : -0.6)).toFixed(1))));

    // Determine strengths & improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (words >= 40) strengths.push("Thorough length with good context");
    if (technicalMatches >= 1) strengths.push("Appropriate domain engineering terminology");
    if (starScore >= 2) strengths.push("Structured action-oriented explanation");
    if (strengths.length === 0) strengths.push("Direct answer to the prompt");

    if (foundFillers.length > 0) improvements.push(`Reduce filler words: ${foundFillers.join(", ")}`);
    if (technicalMatches < 2) improvements.push("Mention specific components, math models, or engineering metrics");
    if (starScore < 2) improvements.push("Adopt the STAR technique: highlight Situation, Action, and Measurable Result");
    if (improvements.length === 0) improvements.push("Proactively address failure modes or edge-case safety parameters");

    let feedbackMessage = `Strong effort! Your explanation demonstrates foundational understanding. `;
    if (persona === "bar_raiser") {
      feedbackMessage = `As a Bar-Raiser, I appreciate your core concept, but you must be more rigorous with system limits, trade-offs, and industrial reliability standards. `;
    }

    if (overallScore >= 8.0) {
      feedbackMessage += `This answer would pass comfortably in a campus technical interview at a top MNC.`;
    } else {
      feedbackMessage += `To push this into top-percentile range, sharpen the engineering justification and quantify your results.`;
    }

    return NextResponse.json({
      score: overallScore,
      clarityScore,
      technicalScore,
      feedback: feedbackMessage,
      strengths,
      improvements,
      starCompliance: starScore >= 2,
      fillerWordsFound: foundFillers
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process interview response" },
      { status: 500 }
    );
  }
}
