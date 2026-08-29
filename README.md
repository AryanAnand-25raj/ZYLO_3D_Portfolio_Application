(ZYLO) — AI-Powered 3D Portfolio Generator SaaS

<div align="center">
  <h3>Next-Generation WebGL Spatial Portfolio Generator</h3>
  <p>Transform professional resumes, GitHub data, and natural-language style prompts into interactive, high-performance 3D spatial portfolio websites.</p>
</div>

---

## ⚡ Core Tech Stack

* **Web Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **3D Engine**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Glassmorphism & Neon Design System)
* **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
* **Validation**: [Zod](https://zod.dev/)
* **Authentication**: [NextAuth.js](https://next-auth.js.org/)
* **AI & LLM Orchestration**: Multi-provider architecture (OpenAI GPT-4o / GPT-4o-mini + Mock Provider + Structured JSON Output)
* **Testing**: [Vitest](https://vitest.dev/) (19 Test Suites, 64 Automated Tests)
* **Motion**: [Framer Motion](https://www.framer.com/motion/)

---

## 🏛️ Architectural Separation of Concerns

The codebase enforces strict separation across 7 core product domains:

| Domain | Responsibility | Directory / Package |
| :--- | :--- | :--- |
| **User Data** | Identity, authentication, sessions, permissions | `src/modules/user-data/`, `src/lib/auth.ts` |
| **Content** | Canonical profile, experience, projects, skills, metrics | `src/modules/content/`, `packages/ai/src/schemas/` |
| **Design** | HSL color tokens, typography scales, glassmorphism | `src/modules/design/`, `src/schemas/theme.schema.ts` |
| **3D Scene** | Declarative camera, lighting, environment, nodes | `src/modules/scene/`, `packages/three-engine/` |
| **Rendering** | Sandboxed WebGL runtime, component & asset registry | `packages/three-engine/src/core/` |
| **Publishing** | Immutable snapshots, subdomain routing, custom domains | `src/modules/publishing/` |
| **Billing** | Subscription tiers (Free, Pro, Agency), usage quotas | `src/modules/billing/` |

---

## 🛡️ Non-Negotiable AI & 3D Security Architecture

1. **Zero Arbitrary Code Generation**: AI never generates executable JavaScript, TypeScript, or dynamic shaders.
2. **Schema-Constrained JSON**: All AI output is constrained to strictly typed Zod schemas.
3. **Component Registry Whitelist**: Only pre-approved WebGL components from `@zylo/three-engine` can be rendered.
4. **Asset Registry Whitelist**: External model URLs are strictly prohibited. Models must match approved asset IDs (`planet-01`, `robot-01`, `abstract-ring-01`, `computer-01`, `crystal-01`).
5. **HTML-First Accessibility & SEO**: The 3D canvas is contained in a decorative layer marked `aria-hidden="true"`, ensuring all text, headings, and links remain fully crawlable and accessible.

---

## 📋 Comprehensive Task Breakdown

### ✅ TASK 01 — Product Foundation
- [x] Initialized Next.js 14 monorepo structure with `@zylo/three-engine` and `@zylo/ai` packages.
- [x] Implemented shared TypeScript configuration with path aliases (`@/*`, `@zylo/three-engine`, `@zylo/ai`).
- [x] Configured environment-variable validation schema with strict runtime enforcement.
- [x] Created dark spatial design system with glassmorphism tokens, neon glows, and custom typography.
- [x] Built responsive landing page shell (`/`) with interactive 3D WebGL hero canvas.
- [x] Built creator dashboard shell (`/dashboard`) with metrics, portfolio cards, and navigation.
- [x] Created NextAuth.js authentication foundation with credential providers and session handling.
- [x] Implemented Prisma schema and database migrations for user, portfolio, theme, scene, and analytics models.
- [x] Defined foundational domain schemas with Zod (`PortfolioSchema`, `ThemeSchema`, `SceneSchema`).

---

### ✅ TASK 02 — Resume + Multi-Source Ingestion & Onboarding Wizard
- [x] Multi-source ingestion pipeline for Resumes (PDF, DOCX, TXT), Manual Forms, GitHub, and LinkedIn.
- [x] Server-side resume text and metadata extraction (`POST /api/resume/upload`).
- [x] Normalization engine harmonizing raw resume entities into `CanonicalProfile`.
- [x] Real-time Conflict & Duplicate resolution system with source priority (`manual` > `resume` > `github` > `linkedin` > `ai`).
- [x] Profile completeness scoring engine with targeted missing-field heuristics.
- [x] Complete 6-step Onboarding Wizard UI:
  1. **Upload Resume** (`/create/resume`)
  2. **Profile Review & Conflict Resolution** (`/create/profile` & `/create/review`)
  3. **Visual Style & Template Picker** (`/create/style`)
  4. **AI Generation Progress State** (`/create/generate`)
  5. **Generated Result & Review** (`/create/result`)

---

### ✅ TASK 03 — AI Profile Normalization & Content Generation
- [x] AI Content Generation engine supporting **7 Professional Writing Styles**:
  - `Confident & Authoritative`, `Technical & Detailed`, `Creative & Expressive`, `Executive & Strategic`, `Minimalist & Punchy`, `Storyteller & Narrative`, `Visionary & Futuristic`.
- [x] Generates tailored headlines, professional bios, executive summaries, quantified project impact metrics, and categorized skill proficiency.
- [x] AI Follow-Up Interview Question Generator formulating high-impact career questions based on profile gaps.
- [x] Partial patch system (`POST /api/ai/portfolio/patch`) allowing targeted regeneration of individual sections.
- [x] AI Rate Limiter (`SlidingWindowRateLimiter`) protecting all generation endpoints.
- [x] Token usage and cost tracking system (`recordAIUsage`).
- [x] Multi-provider architecture with OpenAI GPT-4o / GPT-4o-mini integration and structured JSON fallback.

---

### ✅ TASK 04 — Production 3D Rendering Engine (`@zylo/three-engine`)
- [x] **Core Runtime (`<SceneRenderer />`)**: React Three Fiber + Three.js declarative runtime with `ErrorBoundary3D`, `StaticFallback`, and `aria-hidden="true"`.
- [x] **Component Registry**: Whitelist mapping 20 approved components:
  - *Primitives*: `sphere`, `box`, `torus`, `plane`, `cylinder`, `cone`.
  - *Procedural Nodes*: `TorusKnotCore`, `NeonRings`, `GeometricCluster`, `FloatingMeshNode`, `CyberGrid`, `ParticleVortex`, `HologramPillar`, `SphereOrb`, `CrystalPrism`, `InteractiveCard3D`, `NeuralNodes`.
  - *Assets & Text*: `model` (GLTF loader with fallback proxy), `text3d` (Drei Text/Center), `particles` (GPU points buffer).
- [x] **Camera & Lighting System**: Perspective & Orthographic camera with damping, mouse parallax, and 6 preset lighting environments (*studio*, *cyberpunk*, *warm-sunset*, *minimal-white*, *neon-noir*, *deep-space*).
- [x] **Environment & Materials**: Solid/gradient backgrounds, fog, starfield particles, Drei HDR environments, and `ControlledMaterial` factory (*standard*, *physical*, *basic*, *toon*).
- [x] **Animation & Interaction Controller**: Zero-render `useFrame` animation loop (`rotate`, `float`, `pulse`, `orbit`, `sway`) and pointer hover/click dispatcher.
- [x] **Performance Manager & Device Tiers**: Dynamic profiling across 6 tiers (`ULTRA`, `HIGH`, `MEDIUM`, `LOW`, `MOBILE`, `REDUCED_MOTION`) with adaptive DPR and hard budget clamping.
- [x] **Page Visibility Lifecycle**: `useSceneLifecycle` automatically pauses the render loop when the browser tab is hidden to eliminate CPU/GPU waste.
- [x] **Template Curations**: 6 ready-to-render templates (`ORBIT_SCENE_TEMPLATE`, `NEURAL_SCENE_TEMPLATE`, `GLASS_SCENE_TEMPLATE`, `CREATIVE_SCENE_TEMPLATE`, `MINIMAL_SCENE_TEMPLATE`, `HEAVY_SCENE_TEMPLATE`).
- [x] **Acceptance Testbed**: Dedicated live interactive demo page at **[`/3d-test`](http://localhost:3000/3d-test)** with template switcher, tier toggles, motion toggles, and developer HUD.

---

### ✅ TASK 05 — AI Design Director & 3D Scene Generation
- [x] **Two-Stage Generation Pipeline**:
  - **Stage 1 (Design Planning)**: Synthesizes `DesignPlan` (visual concept, HSL/Hex palette, controlled font pairings, layout modes, motion intensity, 3D concept) based on profession, industry, style prompt, and target audience.
  - **Stage 2 (3D Scene Synthesis)**: Translates `DesignPlan` into a validated `SceneConfig` adhering to template constraints and component whitelists.
- [x] **Profession & Persona Design Rules**:
  - *AI / ML / Data Science*: Neural nodes, particle vortex, cyber grid, `#00F0FF`/`#7B2CBF`, `JetBrains Mono` + `Space Grotesk`.
  - *Aerospace / Hardware*: Exoplanet orbit, orbital neon rings, deep starfield, `#38BDF8`/`#9D00FF`, `Inter` + `Space Grotesk`.
  - *Product & UX Designer*: Crystal prism, floating refractive glass tiles, studio lighting, `#FF007A`/`#FF7B00`, `Plus Jakarta Sans` + `Syne`.
  - *Creative Technologist*: Abstract geometric kinetic cluster, hologram pillars, `#FF007A`/`#00FFA3`, `Syne` + `Clash Display`.
  - *Executive / Founder*: Minimalist sculptural metallic torus, `#E2E8F0`/`#94A3B8`, `Inter` + `Plus Jakarta Sans`.
- [x] **Template Capabilities Registry**: Maps template bounds and provides customized default scene fallbacks ensuring zero broken states.
- [x] **Security & Sanitization**: `validateAndSanitizeScene()` strips unapproved component types, replaces invalid asset URLs with proxies, and clamps budgets.
- [x] **API Endpoints**:
  - `POST /api/ai/design/generate`: Unified endpoint taking profile + preferences and returning complete `{ theme, layout, motion, scene, plan }`.
  - `POST /api/ai/scene/generate`: Dedicated scene generator taking `{ plan, performanceTier }` and returning fresh `{ scene }`.

---

### 🔮 ROADMAP — Upcoming Tasks

* **TASK 06 — Visual 3D Portfolio Studio & Live Editor**:
  - Split-screen live preview canvas with hot-reloading.
  - Interactive property inspector for lighting, camera FOV, mesh colors, materials, and typography.
  - Drag-and-drop section reordering and content inline editor.
* **TASK 07 — Publishing, Custom Domains & Static Export**:
  - Subdomain routing (`username.zylo.design`).
  - Custom domain CNAME mapping with automated SSL provisioning.
  - Static HTML/WebGL bundle export for self-hosting.
* **TASK 08 — Billing & Subscription System**:
  - Stripe Checkout & Customer Portal integration.
  - Free, Pro, and Agency plan limits (custom domains, high-tier 3D models, AI generation credits).

---

## 🗺️ Application Route & Endpoint Directory

| Route / Endpoint | Type | Description |
| :--- | :--- | :--- |
| **`/`** | Page | Public landing page with real-time 3D WebGL hero |
| **`/3d-test`** | Page | Interactive 3D engine testbed & developer HUD |
| **`/create`** | Flow | 6-step AI Portfolio Onboarding Wizard |
| **`/dashboard`** | Page | Creator dashboard with analytics and portfolio cards |
| **`/login` & `/register`** | Page | Authentication portals |
| **`POST /api/resume/upload`** | API | Resume PDF/DOCX/TXT extraction |
| **`POST /api/ai/profile/normalize`** | API | Ingestion normalization into CanonicalProfile |
| **`POST /api/ai/content/generate`** | API | 7-style portfolio content generator |
| **`POST /api/ai/design/generate`** | API | Complete AI Design Director & Scene pipeline |
| **`POST /api/ai/scene/generate`** | API | Dedicated 3D scene synthesizer |
| **`POST /api/ai/portfolio/patch`** | API | Section-level AI content regeneration |

---

## 🧪 Verification & Quality Commands

```bash
# Run automated test suites (Vitest - 19 suites, 64 tests)
npm run test

# Run TypeScript strict type-checking
npm run type-check

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

* Open **[http://localhost:3000](http://localhost:3000)** for the Landing Page.
* Open **[http://localhost:3000/3d-test](http://localhost:3000/3d-test)** for the 3D Engine Testbed.
* Open **[http://localhost:3000/create](http://localhost:3000/create)** for the AI Portfolio Generator.
