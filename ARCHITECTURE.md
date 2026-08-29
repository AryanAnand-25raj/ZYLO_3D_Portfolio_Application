# ZYLO — System Architecture Document

> **AI-Powered 3D Portfolio Generator SaaS**  
> *Version: 0.1.0 (Foundation Stage)*

---

## 1. Executive Summary & Philosophy

**ZYLO** is a SaaS platform designed to transform static developer and creator portfolios into high-performance, real-time 3D WebGL dimensions.

The architecture is built on three uncompromising principles:
1. **Strict Separation of Concerns**: Isolating user data, content, visual theme tokens, 3D scene graphs, rendering pipelines, publishing artifacts, and billing.
2. **Security Sandboxing**: Zero evaluation (`eval`, `new Function()`) of arbitrary user or AI JavaScript in the 3D graphics pipeline. All 3D assets and behaviors are declaratively driven by schema-validated parameters.
3. **Hardware Adaptability**: Automatic tier detection scaling device pixel ratio (DPR), shadows, post-processing shaders, and particle limits for smooth 60 FPS experiences on both mobile and desktop GPUs.

---

## 2. Seven Core Architectural Domains

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 ZYLO SaaS                                   │
└──────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────┘
       │              │              │              │              │
┌──────▼──────┐┌──────▼──────┐┌──────▼──────┐┌──────▼──────┐┌──────▼──────┐
│  USER DATA  ││   CONTENT   ││   DESIGN    ││   3D SCENE  ││ RENDERING   │
│             ││             ││             ││             ││             │
│ NextAuth    ││ Profile     ││ HSL Colors  ││ Cameras     ││ @zylo/three-│
│ Sessions    ││ Experiences ││ Typography  ││ Lights      ││   engine    │
│ Multi-Tenant││ Projects    ││ Glass Tokens││ Fog / HDRI  ││ Sandboxed   │
│ Prisma User ││ Skills/Edu  ││ Animations  ││ Mesh Nodes  ││ Registry    │
└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘
       │                                                           │
┌──────▼──────┐                                             ┌──────▼──────┐
│   BILLING   │                                             │ PUBLISHING  │
│             │                                             │             │
│ Free / Pro  │                                             │ Snapshots   │
│ Entitlements│                                             │ Subdomains  │
│ Quotas      │                                             │ CDN Builds  │
└─────────────┘                                             └─────────────┘
```

### Domain 1: User Data
- **Responsibility**: User identity, credential authentication, OAuth profiles, multi-tenant session tokens, and RBAC roles (`USER`, `CREATOR`, `ADMIN`).
- **Boundaries**: Stored in PostgreSQL via Prisma (`users`, `accounts`, `sessions`). Never directly exposes billing or rendering state.

### Domain 2: Content
- **Responsibility**: Raw portfolio data (Biography, Profile Header, Work Experiences, Highlighted Projects, Categorized Skills, Education, Custom Sections).
- **Validation**: Enforced via Zod `ContentSchema`. Fully decoupled from visual styling and 3D scene placement.

### Domain 3: Design
- **Responsibility**: Visual style tokens and theme mechanics (HSL color palettes, typography scales, glassmorphism blur and opacity values, card borders, neon glow effects).
- **Validation**: Enforced via Zod `ThemeSchema`. Applied dynamically via CSS custom properties and Tailwind utilities without touching raw content.

### Domain 4: 3D Scene
- **Responsibility**: Declarative 3D scene configuration (Camera matrices and FOV, lighting presets and point/spot nodes, HDRI environment maps, atmospheric fog, particle systems, post-processing bloom/vignette, and mesh node hierarchies).
- **Validation**: Enforced via Zod `SceneSchema`. Only allows registered `ComponentType` identifiers (`TorusKnotCore`, `NeonRings`, `GeometricCluster`, `CyberGrid`, `CrystalPrism`, etc.).

### Domain 5: Rendering (`/packages/three-engine`)
- **Responsibility**: Pure WebGL / React Three Fiber / Three.js execution layer.
- **Components**:
  - `SceneRenderer`: Canvas lifecycle manager with adaptive DPR and error boundaries.
  - `CameraSystem`: Perspective/Orthographic camera controls and OrbitControls.
  - `LightingSystem`: Ambient, directional, point, and spot illumination.
  - `Environment`: HDRI background, depth fog, and Sparkles particle simulations.
  - `ComponentRegistry`: Sandboxed factory resolving allowed component types to pure R3F meshes. Rejects dynamic script evaluation.

### Domain 6: Publishing
- **Responsibility**: Deployment snapshot freezing, custom domain verification, subdomain routing (`zylo.design/{slug}`), and automated SEO metadata generation.
- **Storage**: Immutable JSON snapshots in Prisma `deployments`.

### Domain 7: Billing
- **Responsibility**: Subscription plan tiers (`FREE`, `PRO`, `AGENCY`), feature entitlements, portfolio count quotas, and AI token limits.

---

## 3. Sandboxing & Security Model

```text
[ AI Prompt / User Input ]
            │
            ▼
┌────────────────────────┐
│   Zod Schema Parser    │ ─── Invalid / Unknown Nodes ───► REJECTED (Throws ZodError)
└───────────┬────────────┘
            │ Validated SceneConfig
            ▼
┌────────────────────────┐
│   ComponentRegistry    │ ─── Pre-compiled Verified R3F Component Nodes ONLY
└───────────┬────────────┘
            │ Safe Render Tree
            ▼
┌────────────────────────┐
│  Three.js WebGL Canvas │
└────────────────────────┘
```

1. **No Code Generation Injections**: The platform forbids injecting raw JavaScript or HTML strings into the 3D canvas.
2. **Deterministic Declarative Format**: Any AI-generated scene must produce a valid JSON matching `SceneSchema`.

---

## 4. Database Schema (Prisma)

- **`User`**: Multi-tenant identity and role mapping.
- **`Portfolio`**: Root portfolio entity linked to User and slug.
- **`PortfolioContent`**: 1-to-1 JSON store validated against `ContentSchema`.
- **`PortfolioDesign`**: 1-to-1 JSON store validated against `ThemeSchema`.
- **`PortfolioScene`**: 1-to-1 JSON store validated against `SceneSchema`.
- **`Deployment`**: Deployment history and immutable snapshots.
- **`Subscription`**: Plan tier, quotas, and billing status.

---

## 5. Quality Assurance & Testing Matrix

- **Unit Testing**: Vitest test suites for schemas (`tests/schemas.test.ts`), three-engine component registry (`tests/three-engine.test.ts`), and environment variables (`tests/env.test.ts`).
- **Static Analysis**: TypeScript 5.7+ in strict mode, Next.js ESLint, Prettier.
- **Continuous Integration**: GitHub Actions workflow (`.github/workflows/ci.yml`) enforcing type checking, linting, unit tests, and production build.
