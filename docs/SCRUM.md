# SCRUM.md — Frontend Cinematic & Editorial Revision

This document outlines the agile backlog, sprint structure, epics, user stories, and acceptance criteria for revising the Hijauin frontend public awareness site into a clean, editorial, photographic-overlay experience with immersive scroll choreography (following [`docs/DESIGN.md`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/DESIGN.md)).

---

## 1. Revision Goals & Scope

- **Remove 3D Particle Clutter**: Deprecate the heavy Three.js WebGL particle field in favor of crisp, documentary-style photographic background overlays.
- **Editorial Photographic Aesthetics**: Full-bleed imagery with dark void (`#14140F`) atmospheric overlays, film grain accents, and high-contrast bone-white (`#F1ECDF`) typography.
- **Immersive Scroll Choreography**: Lenis smooth scroll synced to GSAP ScrollTrigger timelines for slow cinematic camera drifts, pinned scenes, scrubbed statistic reveals, and dynamic SVG line-drawing.
- **Complete Narrative Arc**: Hero ➔ Crisis (51.8M tons statistic) ➔ Editorial Solution ➔ 4-Step Nasabah Journey.
- **Typography & Anti-Pattern Compliance**: Real Fraunces serif display font, clean grotesk body font, no all-caps eyebrows, no pill buttons on cinematic surfaces, and strict `--alarm-600` / `--growth-500` separation.

---

## 2. Epics & Story Points

| Epic ID | Epic Title | Total Points | Status |
|---|---|---|---|
| **EP-01** | Visual Tokens, Typography & Photographic Overlays | 5 | In Progress |
| **EP-02** | Immersive Scroll & GSAP Choreography Engine | 8 | Ready |
| **EP-03** | Hero & Crisis Scene Implementation | 8 | Ready |
| **EP-04** | Editorial Solution & 4-Step Journey Scene | 8 | Ready |
| **EP-05** | Responsiveness, Accessibility & Quality Assurance | 5 | Ready |
| **Total** | | **34 pts** | |

---

## 3. Sprint Breakdown

```
Sprint 1 (Days 1–2): Foundations & Clean Hero
├── US-101: Display Typography (Fraunces) & Global Token Integration
├── US-102: Atmospheric Image Overlay & Vignette Component
└── US-103: Clean Hero Scene Refactor (Particle Removal & Cinematic Push-in)

Sprint 2 (Days 3–4): Crisis & Immersive Scroll Choreography
├── US-201: Lenis + GSAP ScrollTrigger Scrubbing Engine
├── US-202: Pinned Crisis Scene with Parallax & 51.8M Ton Statistic Reveal
└── US-203: Palette Shift Transition (Void/Alarm to Bone/Forest)

Sprint 3 (Days 5–6): Editorial Solution & Nasabah Journey
├── US-301: Asymmetric Two-Column Editorial Solution Section
├── US-302: 4-Step Nasabah Journey with Scroll-Drawn SVG Line
└── US-303: Accessibility (prefers-reduced-motion) & Performance Audit
```

---

## 4. User Stories & Acceptance Criteria

### Sprint 1: Foundations & Clean Hero

#### **US-101: Display Typography (Fraunces) & Global Token Integration**
- **Priority**: High | **Points**: 3 | **Component**: `app/layout.tsx`, `app/globals.css`
- **Description**: As a visitor, I want to experience distinct, high-character editorial typography (Fraunces variable serif for headlines/stats, clean sans for narrative body) so that the content feels authentic, urgent, and literary.
- **Acceptance Criteria**:
  - [ ] Google Font `Fraunces` is loaded via `next/font/google` with optical sizing and weights 600–900.
  - [ ] CSS variable `--font-fraunces` is applied to headlines and display statistics.
  - [ ] Tailwind / CSS tokens `--forest-950`, `--forest-700`, `--growth-500`, `--void-900`, `--bone-100`, `--alarm-600`, `--haze-400` are registered.

#### **US-102: Atmospheric Image Overlay & Vignette Component**
- **Priority**: High | **Points**: 2 | **Component**: `components/marketing/ImageOverlay.tsx`
- **Description**: As a visitor, I want documentary landfill and environmental imagery treated with rich atmospheric dark overlays so the photography is emotionally resonant without diminishing text readability.
- **Acceptance Criteria**:
  - [ ] Component renders high-resolution documentary photography with Next.js image optimization.
  - [ ] Radial and linear dark gradient overlays in `--void-900` (`#14140F`) guarantee AAA contrast for `--bone-100` text.
  - [ ] Subtle film grain / noise texture is applied via lightweight CSS without GPU overhead.

#### **US-103: Clean Hero Scene Refactor (Particle Removal & Cinematic Push-in)**
- **Priority**: High | **Points**: 3 | **Component**: `app/(marketing)/page.tsx`
- **Description**: As a visitor, I want a clean, confident hero scene free from heavy particle distraction, opening with a slow photographic camera zoom and the urgent statement *"Sampah tidak pernah hilang. Ia hanya pindah tempat."*
- **Acceptance Criteria**:
  - [ ] Particle field simulation is removed or cleanly decoupled from hero.
  - [ ] High-impact documentary image overlay with dark vignette is the backdrop.
  - [ ] Statement is styled in Fraunces 800 fluid display type (`text-6xl md:text-8xl`).
  - [ ] No banned all-caps eyebrows or rounded pill buttons; buttons use clean 0px/4px editorial styling.
  - [ ] Scroll cue indicates narrative continuity below.

---

### Sprint 2: Crisis & Immersive Scroll Choreography

#### **US-201: Lenis + GSAP ScrollTrigger Scrubbing Engine**
- **Priority**: High | **Points**: 3 | **Component**: `components/marketing/LenisProvider.tsx`
- **Description**: As a visitor, I want smooth, cinematic scroll inertia synced directly to GSAP animation timelines so that page movement feels like a controlled camera dolly.
- **Acceptance Criteria**:
  - [ ] Lenis instance updates GSAP ScrollTrigger on every tick (`gsap.ticker.add`).
  - [ ] Scroll damping duration configured to ~1.2s with `easeOutExpo` decay.
  - [ ] Instant fallback to native scroll when `prefers-reduced-motion: reduce` is active.

#### **US-202: Pinned Crisis Scene with Parallax & 51.8M Ton Statistic Reveal**
- **Priority**: High | **Points**: 3 | **Component**: `app/(marketing)/page.tsx`
- **Description**: As a visitor, I want the screen to pin on a full-bleed landfill photograph as I scroll, scrubbing a subtle camera zoom and bringing the national 51.8M ton waste crisis projection into focus.
- **Acceptance Criteria**:
  - [ ] GSAP ScrollTrigger pins the crisis viewport (`pin: true`) for ~1.5x viewport scroll distance.
  - [ ] Background image undergoes subtle parallax drift and scale scrub (1.0 → 1.08).
  - [ ] Statistic `51,8 juta ton` renders in Fraunces 700 with `--alarm-600` (`#C1441F`) color.
  - [ ] Narrative caption: *"proyeksi sampah Indonesia 2026 — 75% tidak terkelola dengan baik"* fades in smoothly with scroll scrub.
  - [ ] No conflicting `--growth-500` appears in this crisis viewport.

#### **US-203: Palette Shift Transition (Void/Alarm to Bone/Forest)**
- **Priority**: Medium | **Points**: 2 | **Component**: `app/(marketing)/page.tsx`
- **Description**: As a visitor, I want a deliberate, smooth color transition from the dark dusk crisis state into the bright, constructive platform state so the story physically shifts from problem to solution.
- **Acceptance Criteria**:
  - [ ] Background smoothly interpolates from `--void-900` (`#14140F`) to light/off-white (`#F7F5EE`).
  - [ ] Text shifts from `--bone-100` to `--forest-950` (`#0B3D26`).
  - [ ] `--growth-500` is first introduced only after this threshold is crossed.

---

### Sprint 3: Editorial Solution & Nasabah Journey

#### **US-301: Asymmetric Two-Column Editorial Solution Section**
- **Priority**: High | **Points**: 3 | **Component**: `app/(marketing)/page.tsx`
- **Description**: As a visitor, I want to read how digital waste banking transforms individual trash into trackable value in an asymmetric, magazine-style editorial layout.
- **Acceptance Criteria**:
  - [x] Asymmetric two-column grid: left column features a documentary photo / diagram; right column features editorial narrative (max 68ch).
  - [x] Clear typography: Section headline in Fraunces 600, narrative body in crisp grotesk.
  - [x] Material palette tokens visualized: Plastik (`#2F7DB8`), Kertas (`#B8873A`), Logam (`#8A94A0`), Kaca (`#4FA6A0`).

#### **US-302: 4-Step Nasabah Journey with Scroll-Drawn SVG Line**
- **Priority**: High | **Points**: 3 | **Component**: `app/(marketing)/page.tsx`
- **Description**: As a visitor, I want to see the 4-step nasabah journey (`1 Setor` ➔ `2 Verifikasi` ➔ `3 Poin` ➔ `4 Tukar`) connected by a continuous SVG path that draws itself as I scroll down.
- **Acceptance Criteria**:
  - [x] Horizontal flow on desktop, stacked on mobile.
  - [x] Numbered markers `1`, `2`, `3`, `4` represent genuine sequential stages.
  - [x] SVG connecting line uses `strokeDasharray` and `strokeDashoffset` scrubbed to ScrollTrigger progress.
  - [x] Final step leads into clear action: registration and login buttons.

#### **US-303: Accessibility (prefers-reduced-motion) & Performance Audit**
- **Priority**: High | **Points**: 2 | **Component**: Testing / CSS
- **Description**: As a visitor with motion sensitivity or low-end hardware, I want all essential content legible without scroll hijacking or disorientation.
- **Acceptance Criteria**:
  - [x] `prefers-reduced-motion: reduce` completely bypasses pinning, scaling, and SVG line scrub; displays content in clean static layout.
  - [x] All Next.js images specify `sizes`, `priority` (for hero), and responsive aspect ratios.
  - [x] `npm run build` compiles with zero errors and zero hydration warnings.

---

## 5. Definition of Done (DoD)

A user story is considered **Done** only when:
1. **Design Conformance**: Matches [`docs/DESIGN.md`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/DESIGN.md) rules and anti-pattern checklist (no all-caps eyebrows, sharp corners on panels, correct color semantics).
2. **Type Safety & Build**: Passes `npm run build` (TypeScript check and Next.js static generation) with 0 errors.
3. **Motion Integrity**: Smooth 60fps scrolling via Lenis + GSAP ticker, with graceful static fallback for reduced-motion.
4. **Clean Code**: Follows [`docs/RULES.md`](file:///e:/Project/OWN%20PROJECT/Hijauinv2/docs/RULES.md) (no hardcoded credentials, clean component breakdown, no unused clutter).
