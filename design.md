# design.md — Wayfarer Design System

## 1. Direction

Grounded in the actual materials of travel: a boarding pass, a fanned stack of postcards,
a horizon line at dusk. The site is built on a **dusk-to-sunset gradient world** with
**glass panels floating over it**, and its signature motif is tour package cards that sit
in a **fanned, overlapping deck** — like boarding passes or postcards laid slightly askew
— which **slide/settle into place** on load, hover, and scroll. This satisfies the
translucent-overlap and sliding-card requirement directly, rather than as a generic
glassmorphism skin bolted onto a template layout.

Everything else stays quiet so that motif reads as the one bold move: flat glass surfaces,
restrained accent use, no competing gradients or decorative shapes elsewhere.

## 2. Color — "Dusk to Horizon"

| Token | Hex | Use |
|---|---|---|
| `dusk-950` | `#150C2E` | Base background (deep night-violet) |
| `dusk-800` | `#2C1B54` | Background gradient mid-stop |
| `horizon-600` | `#6D4FD1` | Secondary accent, links, focus rings |
| `sunset-500` | `#FF6B5B` | Primary accent — CTAs, active states, price highlights |
| `gold-400` | `#FFB86B` | Secondary accent — ratings, badges, highlights |
| `glass-white` | `#F7F5FF` | Glass panel fill (used at 8–14% opacity, never solid) |
| `mist-300` | `#C7C2DA` | Muted text on dark, borders, dividers |
| `ink-900` | `#120A22` | Body text on light surfaces |

Background is always a **gradient**, never a flat fill: `linear-gradient(180deg, #150C2E
0%, #2C1B54 55%, #3A2461 100%)` behind every page, so glass panels always have something
to refract. Light-mode surfaces (forms, dashboard tables) use `glass-white` at higher
opacity (~85–92%) over the same gradient, not a separate white theme — the product does
not switch to a plain white page anywhere.

Avoid: pure black backgrounds, cream/beige backgrounds, and terracotta/clay accents —
none of those belong to this palette and mixing one in breaks the "dusk" premise.

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display (H1/H2, hero, price callouts) | **Fraunces** (variable, optical size high) | Warm editorial serif — travel-magazine register, used at large sizes only |
| Body / UI | **General Sans** (fallback: Inter) | Neutral, highly legible at small sizes for forms and tables |
| Data / labels (dates, prices, flight-style codes) | **IBM Plex Mono** | Used for booking references, dates, room codes — reinforces the "boarding pass" motif |

Type scale (Tailwind `fontSize` keys to add): `display-xl` 4.5rem/1.05, `display-lg`
3rem/1.1, `display-md` 2.25rem/1.15, `body-lg` 1.125rem/1.6, `body` 1rem/1.6, `caption`
0.8125rem/1.4 (mono, tracked +0.02em).

## 4. Glass surface spec

Every card, modal, nav bar, and form panel uses one consistent glass recipe — don't
invent per-component variants.

```css
/* index.css — glass utility layer */
.glass {
  background: rgba(247, 245, 255, 0.10);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(247, 245, 255, 0.16);
  box-shadow: 0 8px 32px rgba(21, 12, 46, 0.35);
}

.glass-elevated {
  background: rgba(247, 245, 255, 0.14);
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  border: 1px solid rgba(247, 245, 255, 0.22);
  box-shadow: 0 16px 48px rgba(21, 12, 46, 0.45);
}
```

Tailwind usage: apply `.glass` via `@apply` inside component classes, or add as a plugin
utility — do not recreate the blur/opacity values ad hoc in JSX className strings.
Corner radius is consistently `rounded-2xl` (1rem) on cards, `rounded-full` only on pills
(badges, nav toggle, CTA buttons) — never mix a third radius scale in.

## 5. Signature motif — the fanned package deck

Tour package cards on the destination page render as a **stacked, fanned deck**:

- Default (rest) state: 3–5 cards visible, each offset by `rotate(-6deg → +6deg)` and
  `translateX`/`translateY` in small steps, later cards behind and slightly scaled down
  (`scale(0.94)`, `0.90`...), each using `.glass-elevated`.
- Hover/focus on a card: that card animates to `rotate(0deg) scale(1)` and rises to the
  front (`z-index` + `translateY(-12px)`), others ease back slightly — a "pull from the
  deck" feel, not a full re-layout.
- Tap/click: card **slides** to full-bleed detail view — the card itself is the shared
  transition element (Framer Motion `layoutId`) so it feels like it's the same object
  expanding, not a new page popping in.
- On scroll into view: cards animate in with a staggered slide from `translateY(24px)
  opacity:0` to rest, `staggerChildren: 0.08s`.

Reference Framer Motion variants (implementation guide, not literal final code):

```jsx
const deckVariants = {
  rest: (i) => ({
    rotate: (i - 2) * 3.5,
    x: (i - 2) * 14,
    y: Math.abs(i - 2) * 6,
    scale: 1 - Math.abs(i - 2) * 0.045,
    zIndex: 10 - Math.abs(i - 2),
  }),
  active: { rotate: 0, x: 0, y: -12, scale: 1, zIndex: 20 },
};
```

Use this exact deck motif for: destination highlight cards on the home page, package
cards on a destination page, and hotel room-tier cards in the booking flow. Do not invent
a second competing card-motion style elsewhere.

## 6. Booking flow motion

The booking wizard (Dates & Travelers → Hotel → Add-ons → Review → Payment) is a single
persistent `.glass-elevated` panel; steps **slide horizontally** past each other inside
it (`translateX(100%) → 0 → translateX(-100%)` on forward, reversed on back), with the
step indicator (mono-font, "01 / 05" style — this is a real sequence, so the numbering is
earned) sliding in sync above it. Price summary is a docked glass strip that **stays
fixed** while steps slide past it, and any price change animates the number with a quick
count-up/count-down tween (150–250ms) rather than an instant jump — this is the one place
a small delight animation is worth it, because it's direct feedback on a decision the
user just made (add-on, hotel tier).

Payment success state: the step panel's content cross-fades to a confirmation card with a
single subtle checkmark draw-in (SVG stroke animation, ~400ms, no confetti/bounce —
keep it calm, this is a financial confirmation).

All motion respects `prefers-reduced-motion`: fall back to opacity-only crossfades, no
transforms, when set.

## 7. Layout concepts (ASCII)

**Home**
```
[ nav — glass, transparent-on-top, solidifies on scroll ]
[ hero — display-xl headline, single destination-photo backdrop, sunset gradient overlay ]
[ fanned deck — "Popular destinations", horizontally scrollable on mobile ]
[ how-it-works — 3 steps, mono step numbers, glass cards in a row ]
[ footer — glass, dusk-950 solid beneath ]
```

**Package detail**
```
[ nav ]
[ full-bleed image band, glass info panel overlapping bottom-left (translucent-over-image) ]
[ two-column: itinerary (day-by-day, left, ~60%) | sticky booking summary card (right, ~40%, glass-elevated) ]
[ hotel tier fanned deck ]
[ reviews ]
```

**Booking wizard**
```
[ nav — minimal, exit-to-package link only ]
[ single glass-elevated panel, centered, max-w-2xl ]
  [ step indicator — mono ]
  [ sliding step content ]
  [ docked price strip — bottom of panel, always visible ]
```

## 8. Responsive rules

Tailwind default breakpoints, used deliberately (not just "it happens to reflow"):

- **Base (< 640px)**: single column everywhere, fanned deck becomes a horizontal snap-
  scroll row (cards still overlap slightly, just fewer visible, `snap-x snap-mandatory`),
  booking wizard panel goes full-width with reduced padding, sticky booking summary on
  package detail collapses to a bottom sheet.
- **`md:` (≥768px)**: two-column layouts activate (package detail), nav becomes full
  horizontal bar instead of hamburger.
- **`lg:` (≥1024px)**: fanned deck shows full 3–5 card spread, sticky sidebar summary
  appears.
- **`xl:` (≥1280px)**: max content width caps at `max-w-7xl`, extra horizontal breathing
  room, not extra columns.

Every interactive element must have a visible focus state (`focus-visible:ring-2
ring-sunset-500`) — glass surfaces make default browser focus rings hard to see, so this
is not optional polish, it's a correctness requirement.

## 9. Component inventory (`components/ui/`)

`GlassCard`, `GlassElevatedCard`, `StackedDeck` (implements Section 5), `Button` (variants:
primary/sunset, secondary/glass, ghost), `Pill`/`Badge`, `StepTransition` (implements
Section 6), `PriceTicker` (count-up/down), `Modal` (glass, backdrop-blurred scrim),
`LoadingSkeleton` (glass shimmer, not a spinner, for card grids), `EmptyState` (mono
caption + short actionable copy, per the writing guidance below).

## 10. Writing/copy tone

Plain, active-voice, traveler-facing language — never system-facing terms. "Add a hotel"
not "configure accommodation resource." Buttons name the exact result: "Confirm booking,"
not "Submit." Errors state what happened and what to do, in-voice, no apology filler:
"That date range isn't available for this package — try shifting by a few days" rather
than "Oops! Something went wrong."
