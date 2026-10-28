# 0010 — CSS-only motion primitives, tokenised timing, reduced motion removes movement

**Status:** Accepted · 2026-10-28

## Context

Motion carries brand personality: Opera's calm ease-out reveal, a SaaS brand's snappy hard cuts. It is also a WCAG
concern (2.3.3 Animation from Interactions, 2.2.2 Pause, Stop, Hide) and a performance one: JavaScript scroll
listeners cost INP. Opera's CSS scroll-driven reveal with visible-by-default content was the right foundation.

## Decision

- **Tokens:** `--motion-duration-{fast,base,slow}`, `--motion-ease`, `--motion-distance`, generated from `brand.motion`.
- **Primitives (CSS classes, no JS):**
  - `.lk-reveal`: fade/rise on entry using `animation-timeline: view()` inside `@supports`. Content is visible without
    support. The brand picks `none` | `fade` | `rise`.
  - `.lk-enter` with `--lk-delay`: load-time staggered entrance for heroes.
  - `[data-header="overlay"]`: transparent → solid header via `animation-timeline: scroll(root)`.
  - Hover/press transitions on interactive components use the duration tokens; only `opacity`, `transform`, `color`,
    `background-color` and `border-color` animate.
- **Reduced motion:** under `prefers-reduced-motion: reduce` every primitive is disabled (`animation: none`) and
  transitions drop to near-instant. Content is never hidden waiting for an animation.
- No scroll-jacking, no parallax on text, no autoplaying carousels.

## Alternatives considered

- **GSAP / Motion One.** Powerful timelines, but JavaScript on the main thread for effects CSS now does natively. A site
  with a genuine choreography need can add it to a signature section.
- **IntersectionObserver reveal.** Needs JS and hides content until JS runs, which hurts LCP and no-JS visitors.

## Consequences

- Browsers without scroll-driven animations (Firefox at the time of writing, unless flagged) show static content. That is
  acceptable by design.
- Motion is testable: the e2e suite runs with `reducedMotion: "reduce"` and asserts no running animations.
