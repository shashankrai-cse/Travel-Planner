# structure.md — Wayfarer Technical Structure

This is the binding source of truth for stack, folders, models, and routes. Deviating
requires a documented reason, not a silent substitution.

## 1. Locked stack

**Strictly MERN**, plus the following justified additions:

| Layer | Choice | Why |
|---|---|---|
| Frontend | React.js (Vite) | Fast dev server, matches spec |
| Routing | React Router | Standard MERN pairing |
| Client state | Redux Toolkit + RTK Query | RTK for booking-wizard/UI state, RTK Query for server-state caching (packages, destinations, hotels) instead of hand-rolled Axios+useEffect everywhere |
| HTTP client | Axios | Used inside RTK Query base query, and directly for one-off calls |
| Styling | Tailwind CSS | Explicit requirement — no Bootstrap/MUI |
| Auth | **Clerk** (`@clerk/clerk-react`, `@clerk/express`) | Replaces custom JWT/verification/reset flows entirely |
| Backend | Node.js + Express.js | Spec |
| DB | MongoDB Atlas + Mongoose | Spec |
| File upload | Multer (memory storage) → Cloudinary | Spec |
| Media hosting | Cloudinary | Spec |
| Email | Nodemailer | Spec |
| Payments | Stripe (primary), Razorpay (optional, India) behind one interface | "Additionals as required" — payment gateway is a core feature, not in the original stack list, so it's added here explicitly |
| Validation | Zod (shared-shape schemas, server-side enforced) | Prevents bad data reaching Mongo |
| Animation | Framer Motion | Needed for the sliding/overlapping card and booking-step transitions in `design.md`; Tailwind alone can't do the physics-based slide/fan motion |

Auth notes: Clerk replaces *User Registration & Login*, *JWT Authentication*, *Email
Verification*, and *Forgot/Reset Password* from the original stack outright — do not
implement any of those by hand. **Role-Based Access Control** is still required, but
implemented via Clerk `publicMetadata.role` (`traveler | vendor | admin`) checked with
`requireRole` middleware server-side, not a custom JWT claim.

## 2. Repository layout

```
wayfarer/
├── context.md
├── gemini.md
├── design.md
├── structure.md
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── app/
│       │   ├── store.js                  # RTK store setup
│       │   └── api/
│       │       ├── apiSlice.js           # RTK Query base
│       │       ├── destinationsApi.js
│       │       ├── packagesApi.js
│       │       ├── hotelsApi.js
│       │       ├── itinerariesApi.js
│       │       ├── bookingsApi.js
│       │       ├── paymentsApi.js
│       │       └── reviewsApi.js
│       ├── features/
│       │   ├── auth/
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── RoleGate.jsx
│       │   ├── destinations/
│       │   ├── packages/
│       │   ├── hotels/
│       │   ├── itinerary/
│       │   ├── booking/
│       │   │   ├── bookingSlice.js       # wizard step state, running total
│       │   │   └── steps/                # DatesTravelers, HotelSelect, AddOns, Review, Payment
│       │   ├── dashboard/                # "My Bookings", profile
│       │   ├── admin/                    # catalog + booking management
│       │   └── reviews/
│       ├── components/
│       │   ├── ui/                       # GlassCard, StackedDeck, Button, Modal, Badge,
│       │   │                             # StepTransition, LoadingSkeleton, EmptyState
│       │   └── layout/                   # Navbar, Footer, PageShell
│       ├── hooks/
│       ├── lib/                          # axios instance, constants, formatters
│       └── styles/
│           └── index.css                 # tailwind directives + glass utility layer
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── server.js                     # boot + listen
        ├── app.js                        # express app, middleware wiring
        ├── config/
        │   ├── db.js                     # mongoose connect
        │   ├── clerk.js
        │   └── cloudinary.js
        ├── models/
        │   ├── User.js
        │   ├── Destination.js
        │   ├── TourPackage.js
        │   ├── Hotel.js
        │   ├── Itinerary.js
        │   ├── Booking.js
        │   ├── Payment.js
        │   └── Review.js
        ├── routes/
        │   ├── users.routes.js
        │   ├── destinations.routes.js
        │   ├── packages.routes.js
        │   ├── hotels.routes.js
        │   ├── itineraries.routes.js
        │   ├── bookings.routes.js
        │   ├── payments.routes.js
        │   ├── reviews.routes.js
        │   ├── admin.routes.js
        │   └── webhooks.routes.js        # Clerk + payment provider webhooks
        ├── controllers/                  # one file per resource, thin
        ├── services/
        │   ├── payment.service.js        # provider-agnostic interface (Stripe/Razorpay)
        │   ├── email.service.js          # nodemailer templates + send
        │   └── cloudinary.service.js
        ├── middleware/
        │   ├── auth.middleware.js        # Clerk requireAuth
        │   ├── role.middleware.js        # requireRole('admin'|'vendor'|'traveler')
        │   ├── upload.middleware.js      # multer
        │   └── error.middleware.js       # centralized error shape
        ├── validators/                   # zod schemas per resource
        └── utils/
            ├── apiResponse.js
            ├── apiError.js
            └── asyncHandler.js
```

## 3. Data models (Mongoose, essential fields only)

**User** — `clerkId` (unique, indexed), `email`, `name`, `avatarUrl`, `role`
(`traveler|vendor|admin`, mirrors Clerk metadata), `phone`, timestamps.

**Destination** — `name`, `slug`, `country`, `description`, `images[]`, `highlights[]`,
`createdBy` (User ref), timestamps.

**TourPackage** — `title`, `slug`, `destination` (ref), `description`, `basePrice`,
`durationDays`, `maxGroupSize`, `includedServices[]`, `images[]`, `startDates[]`,
`itinerary` (ref), `createdBy` (User ref), `avgRating`, timestamps.

**Itinerary** — `package` (ref), `days: [{ dayNumber, title, description, activities[],
meals, optional }]`.

**Hotel** — `name`, `destination` (ref), `address`, `starRating`, `amenities[]`,
`images[]`, `roomTypes: [{ name, pricePerNight, capacity, totalRooms }]`, `createdBy`.

**Booking** — `user` (ref), `package` (ref), `hotel` (ref, optional), `roomType`,
`travelers: [{ name, age }]`, `startDate`, `endDate`, `addOns[]`, `priceBreakdown:
{ base, hotel, addOns, taxes, total }`, `status`
(`pending|confirmed|completed|cancelled`), `payment` (ref), timestamps.

**Payment** — `booking` (ref), `provider` (`stripe|razorpay`), `providerPaymentId`,
`amount`, `currency`, `status` (`pending|succeeded|failed|refunded`), `receiptUrl`,
timestamps.

**Review** — `user` (ref), `package` (ref), `booking` (ref), `rating` (1–5), `comment`,
`images[]`, timestamps.

## 4. API surface (all under `/api`)

```
GET    /destinations                 public
GET    /destinations/:slug           public
POST   /destinations                 vendor/admin
PATCH  /destinations/:id             vendor/admin (owner check)
DELETE /destinations/:id             admin

GET    /packages?destination=&min=&max=&duration=   public, filterable
GET    /packages/:slug               public
POST   /packages                     vendor/admin
PATCH  /packages/:id                 vendor/admin (owner check)
DELETE /packages/:id                 admin

GET    /itineraries/:packageId       public
PATCH  /itineraries/:packageId       vendor/admin (owner check)

GET    /hotels?destination=          public
GET    /hotels/:id                   public
POST   /hotels                       vendor/admin
PATCH  /hotels/:id                   vendor/admin (owner check)

POST   /bookings                     authenticated (creates status=pending)
GET    /bookings/me                  authenticated
GET    /bookings/:id                 owner or vendor/admin
PATCH  /bookings/:id/status          vendor/admin
DELETE /bookings/:id                 owner (before confirmation) or admin

POST   /payments/checkout            authenticated — creates provider session/intent
POST   /webhooks/payments            public, signature-verified

GET    /reviews/package/:packageId   public
POST   /reviews                      authenticated, must own a completed booking

GET    /users/me                     authenticated
PATCH  /users/me                     authenticated
GET    /admin/users                  admin
PATCH  /admin/users/:id/role         admin

POST   /webhooks/clerk               public, svix-verified
```

## 5. Auth wiring specifics (Clerk)

- Client: wrap `<App/>` in `<ClerkProvider>`, use `<SignedIn>`/`<SignedOut>`, Clerk's
  `<SignIn/>`/`<SignUp/>` components (or Clerk Elements if custom-styled to match
  `design.md`'s glass surfaces).
- Server: `@clerk/express` middleware attaches `req.auth`; `auth.middleware.js` wraps
  `requireAuth()`; `role.middleware.js` reads the mirrored `User.role` from Mongo (not
  Clerk metadata directly, to avoid an extra API call per request) after the initial sync.
- `POST /webhooks/clerk` verifies the Svix signature and upserts/deletes the mirrored
  `User` document on `user.created` / `user.updated` / `user.deleted`.
- Role changes are admin-initiated through `PATCH /admin/users/:id/role`, which updates
  both the Mongo `User.role` and Clerk's `publicMetadata.role` (via Clerk backend SDK) so
  the two never drift.

## 6. Environment variables (both `.env.example` files)

**client/.env.example**
```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_BASE_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

**server/.env.example**
```
PORT=
MONGODB_URI=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CLIENT_URL=
```
