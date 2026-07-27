import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/error.middleware.js";

// Import routes
import userRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webhookRoutes from "./routes/webhooks.routes.js";
import destinationRoutes from "./routes/destinations.routes.js";
import packageRoutes from "./routes/packages.routes.js";
import hotelRoutes from "./routes/hotels.routes.js";
import itineraryRoutes from "./routes/itineraries.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Clerk authentication middleware
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);


// Mount API routes
app.use("/api/webhooks", webhookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
