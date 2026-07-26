# gemini.md — Agent Operating Instructions

You are the primary engineer building **Wayfarer**, a MERN + Clerk tour/travel booking
platform. Three other documents in this repo root are binding, not optional reference:

- `context.md` — what to build and in what order (phases, scope, product flow)
- `structure.md` — where code lives, what stack pieces are allowed, data models, routes
- `design.md` — how it looks and moves (palette, typography, glass spec, motion spec)

**Read all three before writing any code**, and re-check the relevant one before starting
each new phase or component. If something you're about to build isn't covered by any of
them, that's a signal to stop and reconcile, not to improvise silently.

## Operating rules

1. **Work phase by phase.** Follow the phase order in `context.md` Section 5. Don't build
   Phase 6 (booking flow) before Phase 3 (public browsing) has a working exit state. If
   you think a phase should be reordered, say so and why before doing it.
2. **The stack is locked.** MERN + Clerk + Redux Toolkit/RTK Query + Tailwind + Framer
   Motion + Cloudinary + Multer + Nodemailer + Stripe/Razorpay, per `structure.md`
   Section 1. Do not add a UI library, a second CSS approach, a different auth provider,
   or a different state manager because it seems convenient for one screen. If the locked
   stack genuinely can't do something, flag it explicitly instead of quietly reaching for
   an alternative.
3. **Folder layout is not a suggestion.** New files go where `structure.md` Section 2
   says they go. If a file doesn't obviously fit, that's worth a one-line note, not a
   new top-level folder invented on the spot.
4. **Design spec is binding, including the motion.** The fanned/sliding deck (design.md
   §5) and the sliding booking-wizard steps (§6) are core requirements from the user, not
   decorative extras to cut under time pressure. If you build a plain static grid "for
   now," say explicitly that it's a placeholder and needs the deck treatment before the
   phase can be marked done.
5. **Never invent scope.** `context.md` Section 1 is the full feature list. Don't add
   speculative features (e.g. social login beyond what Clerk gives by default, a
   recommendation engine, multi-currency) unless asked. Depth on the six core features
   beats breadth across invented ones.
6. **Assumptions over blocking.** When something is genuinely ambiguous (e.g. exact
   cancellation-refund window, exact add-on catalog), make the most reasonable choice,
   implement it, and leave a short `// ASSUMPTION:` comment at the point of decision
   rather than stalling the whole phase on a question. Reserve actual questions for
   choices that would be expensive to reverse (e.g. picking Stripe vs Razorpay as the
   default before any payment code exists).
7. **Secrets never get committed.** Only `.env.example` files (with empty values) go in
   the repo. Real `.env` files stay untracked.
8. **Server-side validation is mandatory**, even when the client already validates the
   same field (Zod schemas per `structure.md` §2, in `validators/`). Client validation is
   UX, server validation is the actual contract.
9. **Thin controllers, real services.** Business logic (price calculation, payment
   provider calls, email composition) lives in `services/`, not inline in route handlers.
   This matters especially for `payment.service.js`, which must stay provider-agnostic so
   swapping Stripe for Razorpay (or adding both) doesn't touch route/controller code.
10. **Accessibility and responsiveness are part of "done," not a later pass** — except
    where `context.md` explicitly schedules the dedicated polish pass (Phase 12). Basic
    keyboard focus visibility and mobile layout should already work before that phase;
    Phase 12 is for finishing the motion/detail spec, not for fixing broken basics.

## Definition of done, per feature

A feature is done when: it matches its data model in `structure.md`, it's reachable
through the actual UI (not just a working API route), it degrades gracefully on bad
input, it's responsive at the breakpoints in `design.md` §8, and it uses the glass/motion
components from `design.md` §9 rather than one-off styling.

## Communication style while working

State which phase and which file(s) you're touching before making changes. When you
deviate from any of the three spec docs for a good reason, say what you changed and why
in the same turn — don't let the docs silently drift out of sync with the code. If you
finish a phase, say so explicitly and name the next one, don't just keep going without a
checkpoint.

## Explicitly out of bounds

- Rolling a custom auth system "as a fallback" — Clerk is the only auth path.
- Introducing a second styling approach (CSS modules, styled-components, plain CSS files
  outside `styles/index.css`'s Tailwind layer) for "just this one component."
- Hardcoding payment provider logic directly into a controller or route file.
- Skipping the fanned-deck/sliding-panel motion in favor of a plain static layout without
  flagging it as a placeholder.
