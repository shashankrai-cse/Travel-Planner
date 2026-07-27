import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsAdmin,
} from "../controllers/bookings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", requireAuth, createBooking);
router.get("/my-bookings", requireAuth, getMyBookings);
router.get("/admin/all", requireAuth, requireRole("admin", "vendor"), getAllBookingsAdmin);
router.get("/:id", requireAuth, getBookingById);
router.patch("/:id/cancel", requireAuth, cancelBooking);

export default router;
