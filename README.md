# PlaceQuest: Gamified Technical Placement Preparation Platform

PlaceQuest is a modular, interactive simulation and placement preparedness platform built for engineering students across core disciplines and computer science. The platform bridges the gap between passive theoretical learning and rigorous industrial hiring assessments through hands-on workbenches and automated interview evaluation.

## Problem Statement

Engineering campus placements for Tier-1 firms (such as Bosch, Siemens, ABB, Google, and Amazon) require both conceptual mastery and practical problem-solving:
- Core engineering candidates (Robotics, Electrical, Mechanical, Civil) rarely have access to interactive SCADA, PLC, or circuit testbenches before interview rounds.
- Software engineering candidates require rapid intuitive verification of call-stack execution models and tree data structures beyond standard static text quizzes.
- Candidates often struggle with technical articulation, overusing conversational filler words and failing to structure solutions using standard STAR (Situation, Task, Action, Result) interview frameworks.

PlaceQuest addresses these challenges through interactive, game-inspired workbenches paired with an automated technical evaluation console.

## Current Proof of Concept (POC) Features

The current release delivers a fully functional, responsive proof-of-concept application featuring:

1. **Industrial PLC Ladder Logic Workbench (`/arenas/ladder-logic`)**
   - Interactive IEC 61131-3 rung assembly: Normally Open (NO), Normally Closed (NC), Auxiliary Seal-In Latch, and Output Coil (M1).
   - Real-time circuit excitation and electrical continuity simulation.
   - Live SCADA factory floor telemetry featuring an animated conveyor system and a 3-DOF articulated robotic sorting arm.
   - Fail-safe Emergency Stop (E-Stop) interlock validation and interview rubric feedback.

2. **Algorithmic Memory & Data Structure Visualizer (`/arenas/dsa-dungeon`)**
   - Call stack allocation vs FIFO buffer queue verification under browser undo scenarios.
   - Binary Search Tree (BST) partition routing under O(log N) depth constraints.
   - Real-time execution checking, health integrity scoring, and state recovery.

3. **Curriculum Workbench Catalog (`/arenas`)**
   - Multi-disciplinary track selection covering Robotics, Computer Science, Electronics & Communication, Electrical Engineering, Mechanical Engineering, and Civil Engineering.
   - Modular practice module indexing with XP bounties and target engineering competencies.

4. **Technical Interview Evaluation Console (`/interview`)**
   - AI Mock Interview system supporting technical mentor and staff bar-raiser personas.
   - Automated candidate response evaluation assessing STAR compliance, keyword density, and filler word detection.
   - Rubric telemetry with structured feedback, strengths identification, and concrete recommendations.

5. **Placement Telemetry Dashboard (`/dashboard`)**
   - Six-axis skill vector radar chart calculating student domain competencies.
   - Tier-1 target company preparedness indexing (Bosch, Siemens, Zoho, ABB, Amazon).
   - Verifiable competency achievement badges tied to workbench completions.

6. **Cybernetic Glass Design System**
   - Cohesive indigo-violet gradient color tone designed for high legibility.
   - Seamless, flicker-free switching between Light and Dark modes.
   - Unified professional typography leveraging Plus Jakarta Sans, Manrope, and Space Grotesk.

## Roadmap: Features Under Future Development

The following enhancements are planned for subsequent production milestones:

- **Hardware-in-the-Loop & Circuit Synthesis**: WebAssembly-powered SPICE nodal analysis for analog op-amp and electrical grid simulation modules.
- **Multimodal AI Mock Interviews**: Real-time WebRTC audio streaming with speech-to-text, prosody analysis, and dynamic follow-up questioning.
- **Institutional Admin & Placement Cell Dashboard**: Cohort analytics, batch benchmarking, and candidate export tools for university placement offices.
- **Peer-to-Peer Competitive Arenas**: Synchronous multiplayer engineering showdowns with live ladder rung and algorithm debugging rounds.
- **Persistent Cloud Backend**: Multi-tenant database integration for user profiles, progress sync, verifiable digital certificates, and recruiter access.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for light/dark theme adaptation
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, SVG graphics, CSS micro-animations

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prasanth1466/Place-Quest.git
   cd Place-Quest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```
