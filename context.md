# context.md — Wayfarer: Tour & Travel Booking Platform

> Working name: **Wayfarer**. Rename freely — it's referenced only here and in copy, not in code identifiers.

## 1. What this product is

Wayfarer is a full-stack travel booking platform where travelers discover destinations,
browse curated tour packages, customize itineraries, book hotels, and pay for trips end
to end. Admins/operators manage the catalog (destinations, packages, hotels) and the
bookings that come in.

**Core feature set** (source of truth — do not silently expand scope):
1. Destination listings — browsable, searchable, filterable destinations
2. Tour package management — CRUD packages tied to destinations, pricing, availability
3. Itinerary planning — day-by-day itinerary attached to (or customized from) a package
4. Hotel booking — room types/availability tied to a destination or package
5. Booking management — multi-step booking flow + booking lifecycle (pending → confirmed
   → completed/cancelled)
6. Payment gateway — checkout, payment capture, receipts, refund path

## 2. Who uses it

| Role | Capabilities |
|---|---|
| **Traveler** (default) | Browse, plan itinerary, book, pay, view "My Bookings", leave reviews |
| **Vendor/Operator** | Create & manage their own destinations/packages/hotels, view bookings for their listings |
| **Admin** | Everything a Vendor can do, plus manage all users, all listings, platform-wide bookings, and role assignment |

Roles are Clerk-managed (see `structure.md`). Do not build a parallel role system.

## 3. End-to-end product flow

This is the flow the finished product must support, start to finish:

1. Visitor lands on the home page, browses **destinations** (no login required).
2. Visitor opens a **destination**, sees its tour **packages**.
3. Visitor opens a **package**, sees pricing, duration, included services, and the default
   **itinerary** (day-by-day).
4. Visitor can adjust the itinerary within allowed bounds (swap a day's activity, extend
   duration, choose optional add-ons) — changes recalculate price live.
5. Visitor picks travel dates, party size, and a **hotel/room tier**.
6. At checkout, if not authenticated, Clerk sign-in/sign-up is triggered inline (no full
   navigation away from the booking flow if avoidable).
7. Traveler details are collected (names, ages if relevant, contact info).
8. Price breakdown is shown (base price, hotel upgrade, add-ons, taxes, total).
9. Payment is captured via the payment gateway; on success a **Booking** is created with
   status `confirmed` and a **Payment** record is linked to it.
10. Confirmation email is sent (Nodemailer) with a booking summary.
11. Booking appears in the traveler's **dashboard** ("My Bookings") with status, dates, and
    a downloadable/viewable itinerary.
12. Operator/Admin sees the booking in their **admin dashboard**, can update status,
    contact the traveler, or trigger a cancellation/refund.
13. After the travel end date passes, the traveler can leave a **review** on the package.

## 4. Non-negotiable constraints

- Stack is **strictly MERN** (MongoDB, Express, React, Node) plus explicitly justified
  additions — see `structure.md` for the locked list. No swapping frameworks mid-project.
- **Auth is Clerk**, not hand-rolled JWT. Clerk owns registration, login, verification,
  password reset, and session management. Roles live in Clerk `publicMetadata` and are
  mirrored into MongoDB for query convenience.
- **Styling is Tailwind CSS only.** No Bootstrap, no MUI, no styled-components.
- Design language (glassmorphism, sliding/overlapping cards, booking micro-interactions,
  full responsiveness) is defined in `design.md` and is binding, not optional flavor text.
- Folder/module layout is defined in `structure.md` and is binding.

## 5. Development phases

Work through these **in order**. Each phase has an exit criterion — don't start the next
phase until the current one's criterion is met. If a phase reveals that an earlier
assumption was wrong, fix it before moving on rather than patching around it later.

### Phase 0 — Foundations & environment
- Init `client/` (Vite + React + Tailwind) and `server/` (Express) per `structure.md`.
- Set up MongoDB Atlas cluster + connection, `.env.example` for both apps.
- Set up Clerk project (dev instance), wire `ClerkProvider` on the client and Clerk
  middleware on the server, confirm a test sign-up round-trips.
- Exit: a signed-in user can hit a protected `/api/users/me` route and get their profile.

### Phase 1 — Auth & user sync
- Clerk webhook (`user.created`, `user.updated`, `user.deleted`) → sync `User` doc in Mongo.
- Role assignment flow (default `traveler`; admin can promote to `vendor`/`admin`).
- Route guards on client (`ProtectedRoute`, `RoleGate`) and server (`requireAuth`,
  `requireRole`).
- Exit: role-gated pages/routes correctly block/allow access for all three roles.

### Phase 2 — Core data layer & admin CMS skeleton
- Mongoose models: `Destination`, `TourPackage`, `Hotel`, `Itinerary`.
- Admin-only CRUD routes + minimal admin UI (tables + forms, not yet styled to spec) for
  destinations, packages, hotels.
- Exit: an admin can create a destination → package → itinerary → hotel chain entirely
  through the UI, and it's readable via public GET routes.

### Phase 3 — Public browsing experience
- Destination listing + detail pages, package listing + detail pages.
- Search + filters (destination, price range, duration, dates).
- Exit: an anonymous visitor can go from home → destination → package detail with real
  data, fully responsive.

### Phase 4 — Itinerary planning module
- Day-by-day itinerary renderer on package detail.
- Customization affordances (swap/add/remove within operator-defined bounds), live price
  recalculation.
- Exit: itinerary edits persist through to the booking flow's price summary.

### Phase 5 — Hotel booking module
- Room type selection tied to a destination/package, availability check against dates.
- Exit: selecting a room tier updates the running total and blocks unavailable dates.

### Phase 6 — Booking management flow
- Multi-step booking wizard: dates & travelers → hotel/room → add-ons → review → payment.
- `Booking` model + status state machine (`pending → confirmed → completed | cancelled`).
- Exit: a full booking can be created end-to-end and lands correctly in Mongo with
  status `pending` before payment.

### Phase 7 — Payments
- Payment gateway integration behind a `payment.service.js` abstraction (see
  `structure.md`) so the provider is swappable.
- Webhook handling for payment confirmation, `Payment` record creation, booking status
  flip to `confirmed` on success.
- Exit: a real (test-mode) payment moves a booking from `pending` to `confirmed` and is
  idempotent against webhook retries.

### Phase 8 — Notifications
- Nodemailer transactional emails: booking confirmation, payment receipt, cancellation.
- Exit: each of the three email types fires correctly from the relevant event.

### Phase 9 — Media pipeline
- Multer → Cloudinary upload flow for destination/package/hotel images and user avatars.
- Exit: admin can upload images through the CMS and they render via Cloudinary URLs
  everywhere images are needed.

### Phase 10 — User dashboard & reviews
- "My Bookings" (status, dates, itinerary view, invoice/receipt).
- Reviews on completed bookings (rating + comment, tied to package).
- Exit: a completed booking unlocks the review form; the review shows on the package page.

### Phase 11 — Admin/vendor dashboard & basic analytics
- Booking queue, status management, revenue-at-a-glance, listing management in one place.
- Exit: an operator can manage their full catalog and booking pipeline without touching
  the database directly.

### Phase 12 — UI/UX polish & animation pass
- Apply `design.md` in full: glass surfaces, the fanned/sliding package cards, booking
  step transitions, hover/press states, empty/loading/error states.
- Full responsive pass (mobile, tablet, desktop) — this is not optional and not last-minute.
- Exit: every page matches `design.md`'s spec at all breakpoints; reduced-motion respected.

### Phase 13 — QA & hardening
- Server-side validation on every mutating route, rate limiting on auth-adjacent and
  payment routes, error boundaries on the client, centralized API error shape.
- Exit: invalid input, expired sessions, and failed payments all fail gracefully with
  clear user-facing messaging — never a blank screen or raw stack trace.

### Phase 14 — Deployment
- MongoDB Atlas (prod cluster), server deployed (Render/Railway/Fly/etc.), client
  deployed (Vercel/Netlify), environment variables set per platform, Clerk + payment
  provider switched to production keys.
- Exit: a real end-to-end booking works on the deployed URL, not just localhost.

## 6. Definition of "done" for the end product

A stranger can land on the site, browse destinations with no friction, build out a trip
(package + itinerary + hotel), pay for it, get a confirmation email, and see it in their
dashboard — all without encountering an unstyled page, a broken breakpoint, or a dead
button. An operator can run their catalog and booking pipeline entirely through the admin
UI. Nothing in the core feature set (Section 1) is missing or stubbed with placeholder text.
