# DESIGN.md — Hijauin Cinematic & Editorial Experience

Design tokens and motion patterns for Hijauin's public-facing awareness site:
a clean, scroll-driven, editorial experience that confronts visitors with the
stark reality of Indonesia's waste crisis using high-impact photography with
atmospheric background overlays, immersive scroll choreography, and clear,
uncluttered narrative pacing before introducing Hijauin's digital bank-sampah
platform as the response.

Product UI (nasabah/admin dashboards) inherits the color palette and typography
tokens but maintains a fast, low-motion product layout — see note in §8.

---

## 1. Design Rationale & Art Direction

**Direction**: Clean, bold, and documentary-editorial. We avoid noisy particle
clutter or gimmick 3D effects. The impact comes from authentic documentary
photography, dark atmospheric overlays, razor-sharp typography, and
cinematic scroll transitions that physically pull the reader through the narrative.

**Subject**: Indonesia generates tens of millions of tons of waste annually,
most of it ending up unmanaged or hand-sorted in colossal landfills like Bantar
Gebang. Powerful, full-bleed documentary imagery with moody, tonal overlays
anchors the emotional gravity of the site.

**Audience**: Urban Indonesian citizens (potential nasabah), community waste-bank
operators, and institutional partners. The tone is sober, urgent, and credible —
not a playful SaaS pitch deck or an experimental tech demo.

**Key Aesthetic Principles**:
1. **Clean & Restrained**: No unnecessary particle fields or visual noise. Generous negative space, editorial typography, and high-contrast atmospheric photography.
2. **Immersive Scroll Choreography**: Scroll-triggered camera zooms, pinned narrative scenes, scrubbed metric reveals, and SVG path drawing on scroll via Lenis + GSAP ScrollTrigger.
3. **Atmospheric Background Overlays**: Full-bleed documentary images treated with deep void vignettes (`#14140F`), dual-tone grain, and gradient overlays so typography remains effortlessly readable.
4. **Authentic Color Semantics**: Void dusk (`#14140F`), paper bone (`#F1ECDF`), landfill alarm red (`#C1441F`), and forest leaf green (`#0B3D26` / `#4FA65C`).
5. **No AI Defaults**: No all-caps eyebrow labels, no arrow suffixes on buttons, no generic SaaS card grids, and no rounded pill buttons on cinematic surfaces.


---

## 2. Color Tokens

| Token | Hex | Use |
|---|---|---|
| `--forest-950` | `#0B3D26` | Primary brand green (from logo pin). Nav, footer, primary buttons. |
| `--forest-700` | `#1F6B3F` | Mid green. Hover/active states, links on dark backgrounds. |
| `--growth-500` | `#4FA65C` | Lighter leaf green. Reserved for "solution" moments only — first appears when the story shifts from problem to platform. Never used in the crisis sections. |
| `--void-900` | `#14140F` | Near-black backdrop for cinematic scenes. Warm/olive-tinted, not a cold tech black — evokes landfill dusk rather than a UI dark mode. |
| `--bone-100` | `#F1ECDF` | Off-white text on dark. Warm, paper-like — not pure white. |
| `--alarm-600` | `#C1441F` | Crisis/urgency accent, pulled from the red bottle caps visible in the reference landfill photo. Used exclusively for real statistics about the waste crisis — never for decoration, never for standard UI states. |
| `--haze-400` | `#7C8574` | Muted secondary text, dividers, captions. |

**Rule**: `--alarm-600` and `--growth-500` never appear in the same viewport.
Alarm marks the problem; growth marks the response. Mixing them undercuts the
before/after structure of the story.

## 3. Material Palette (shared with product dashboards)

Waste categories already have a canonical enum in `SCHEMA.md`
(`jenis_sampah`). Use these exact colors anywhere a category is visualized —
cinematic infographics, admin recap charts, category icons — so the same
material always reads as the same color across the whole product:

| `jenis` | Token | Hex | Reasoning |
|---|---|---|---|
| `plastik` | `--jenis-plastik` | `#2F7DB8` | Recognized recycling-blue, distinct from brand green. |
| `kertas` | `--jenis-kertas` | `#B8873A` | Kraft/cardboard tan. |
| `logam` | `--jenis-logam` | `#8A94A0` | Cool metal grey. |
| `kaca` | `--jenis-kaca` | `#4FA6A0` | Glass teal, sits between blue and green without competing with brand green. |

## 4. Typography

Two families, clearly distinct roles — no third face, no default system sans.

- **Display — Fraunces** (variable, use optical size + weight axes). Soft,
  slightly organic serif flares that echo the leaf in the mark without being
  literal. Used for: hero statements, large statistic callouts, section
  openers. Weight 600–900 depending on scale; never used below 28px.
- **Body/UI — General Sans**. Clean humanist grotesk for narrative
  paragraphs, captions, data labels, and all product UI chrome. Weight
  400–500 for body, 600 for UI labels and buttons.

**Type scale** (desktop, fluid via `clamp()`):
| Role | Size | Family/Weight |
|---|---|---|
| Hero statement | 64–120px | Fraunces 800 |
| Section statistic | 48–88px | Fraunces 700 |
| Section heading | 32–40px | Fraunces 600 |
| Body/narrative | 18–20px | General Sans 400, line-height 1.6, max 68ch |
| Caption/label | 13–14px | General Sans 500 |

Do not set labels in all caps. Do not italicize or recolor a single word
inside a headline for emphasis — let scale and placement carry weight
instead.

## 5. Spacing, Radius, Elevation

- Spacing scale: 4 / 8 / 16 / 24 / 40 / 64 / 96 / 160px. Cinematic sections
  use the top of the scale (96–160px vertical rhythm); UI/product sections
  use the lower half.
- Radius: `4px` for UI controls (buttons, inputs, cards in the product
  dashboard). Cinematic-site imagery and full-bleed panels use `0px` —
  no rounded corners on photography or WebGL canvases; the crisis is not
  softened.
- Elevation: avoid soft drop-shadows as a default card treatment (the "SaaS
  card kit" look). Where separation is needed on dark backgrounds, use a
  1px `--haze-400` hairline at 20% opacity instead of a shadow.

## 6. Layout System

- **Cinematic/statement scenes** (hero, crisis stats, transition moments):
  full-bleed, center-aligned, single column, generous negative space.
- **Narrative/data scenes** (explaining the problem's mechanics, explaining
  the platform): asymmetric two-column editorial grid — image or WebGL
  element bleeds to one edge, text column (max 68ch) sits opposite,
  left-aligned. Alternate which side the text sits on scene to scene so the
  page has a rhythm rather than a repeated template.
- **Product/journey scene** (the four-step nasabah flow): the one place
  numbered markers are legitimate, laid out as a horizontal sequence on
  desktop, vertical on mobile.

### Wireframe — Hero (cinematic, center-aligned)
```
┌──────────────────────────────────────────┐
│                                            │
│         [ WebGL particle field ]          │
│                                            │
│        Sampah tidak pernah hilang.        │  <- Fraunces 800, bone-100
│        Ia hanya pindah tempat.            │
│                                            │
│              [ scroll cue ]               │
└──────────────────────────────────────────┘
```

### Wireframe — Crisis scene (pinned, full-bleed photography)
```
┌──────────────────────────────────────────┐
│  [ landfill photograph, full-bleed,       │
│    slow parallax/zoom tied to scroll ]    │
│                                            │
│                     51,8 juta ton         │  <- Fraunces 700, alarm-600
│                     proyeksi sampah 2026  │  <- General Sans caption, bone-100
│                     -- 75% tidak terkelola│
│                       dengan baik         │
└──────────────────────────────────────────┘
```

### Wireframe — Narrative/solution scene (asymmetric, left text)
```
┌───────────────┬────────────────────────────┐
│               │  Bank sampah digital        │  <- Fraunces 600
│  [ image /    │  membuat setiap kilogram    │  <- General Sans body,
│    WebGL      │  bisa dilacak -- dari       │     left-aligned, 68ch max
│    element ]  │  setoran sampai poin.       │
│               │                              │
└───────────────┴────────────────────────────┘
```

### Wireframe — Journey (legitimate sequence, numbered)
```
   1              2              3              4
Setor  ───────►  Verifikasi ──► Poin  ────────► Tukar
sampah          admin           bertambah       hadiah
```

---

## 7. Motion & Technical Architecture

**Stack**: Lenis (smooth scroll layer) + GSAP with ScrollTrigger (pinning, timeline scrubbing, parallax). Clean, highly optimized, and focused on photographic overlays rather than GPU-heavy 3D particles.

### 7.1 Core Principle: One Signature Gesture Per Scene
Per scene, choose exactly one orchestrated motion idea, avoiding arbitrary stacks of animation:
- **Hero**: Atmospheric photographic overlay with subtle dark vignette (`#14140F`). Slow cinematic zoom/scale drift (1.05 → 1.0) on scroll, with smooth opacity reveal for the statement headline.
- **Crisis Scene**: GSAP ScrollTrigger `pin: true` locks the landfill documentary photograph in place. Scroll scrubs a deep parallax drift while the stark statistic (`51,8 juta ton`) crossfades in with `--alarm-600` accent.
- **Transition to Platform**: The only hard palette shift on the page — `--void-900`/`--alarm-600` seamlessly transitions into `--bone-100`/`--forest-950`/`--growth-500` along a GSAP scroll timeline, visually delivering the leap from "crisis" to "solution".
- **Journey Scene**: An SVG connecting line dynamically draws its stroke (`strokeDashoffset` scrubbed to scroll) linking Step 1 (`Setor`) → Step 2 (`Verifikasi`) → Step 3 (`Poin`) → Step 4 (`Tukar`).

**Anti-Patterns**: Do NOT apply generic bounce animations, do not add bouncy hover-lift to every element, and avoid filling screens with distracting floating particles.

### 7.2 Lenis Smooth Scroll Configuration
- Use Lenis across the public awareness page; sync it directly with GSAP's ticker (`gsap.ticker.add`) to guarantee a single unified 60/120fps render loop.
- Duration/easing: Cinematic camera feel (~1.2s duration, `easeOutExpo`-style decay curve), not rapid or springy overshoot.
- Respect accessibility: If `prefers-reduced-motion: reduce` is detected, instantly disable Lenis and snap scroll-triggered elements to their final states.

### 7.3 Background Image & Overlay Strategy
- High-resolution, optimized documentary imagery (WebP/AVIF format via Next.js `<Image>`).
- Dual-layer overlays:
  1. Base radial/linear gradient in `--void-900` (`#14140F`) with 70–85% opacity to guarantee AAA contrast for `--bone-100` typography.
  2. Subtle film grain / noise overlay for tactile documentary texture without performance overhead.
- Fully responsive: image scaling uses `object-cover` and focal alignment.


---

## 8. Where Product UI Diverges

The nasabah/admin dashboard (see `TRD.md`, `SCHEMA.md`) reuses the color
tokens (§2, §3) and typography (§4) for brand consistency, but **does not**
use the cinematic motion system in §7. Dashboards need predictable, fast,
low-motion interfaces -- Lenis/WebGL/scroll-pinning do not belong there.
Product UI motion is limited to short (150-200ms) state transitions
(hover, expand, confirm), following the existing "motion answers action"
principle, not scroll-driven choreography.

---

## 9. Content Voice & Reference Data

Copy on the awareness site should read like plain, urgent reporting -- short
declarative sentences, active voice, no marketing gloss. Pull real, sourced
figures rather than invented ones; verify against the latest release before
publishing, as these move year to year:

- National waste generation is projected to reach 51.8 million tons in
  2026, with roughly 75% still not properly managed. (Source: ANTARA News,
  2026 -- verify against current-year figure before publish.)
- More than 35% of Indonesia's total waste -- around 11 million metric tons
  in a recent year -- was unmanaged, ending up in rivers, ravines, and
  roadsides. (Source: Mongabay/BRIN reporting.)
- The most recent Ministry of Environment breakdown shows food scraps as
  the largest waste category (about 41%), followed by plastic (about 20%).
  (Source: KLH via Databoks -- useful for the material-breakdown scene,
  ties directly to the four `jenis` categories in §3.)

Avoid rounding these into vague claims ("Indonesia has a huge waste
problem") -- the specificity of the number is what makes the crisis scene
land. Keep a citation/source note in the CMS entry for each stat used, since
these figures get revised annually.

---

## 10. Anti-Pattern Checklist (review before shipping any new scene)

- [ ] No cream background Terracotta accent combination.
- [ ] No ALL-CAPS eyebrow labels above headings.
- [ ] No dot-separated meta strings (`A · B · C`).
- [ ] No arrow (`→`) appended to button/link text.
- [ ] No numbered markers unless the content is a genuine sequence.
- [ ] No more than one orchestrated motion idea per scene.
- [ ] No hover-lift/shadow applied uniformly to every card.
- [ ] `--alarm-600` and `--growth-500` never appear together in one view.
- [ ] Reduced-motion and no-WebGL fallbacks tested, not just assumed.
