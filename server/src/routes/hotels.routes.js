import { Router } from "express";
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../controllers/hotels.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", requireAuth, requireRole("vendor", "admin"), createHotel);
router.patch("/:id", requireAuth, requireRole("vendor", "admin"), updateHotel);
router.delete("/:id", requireAuth, requireRole("admin"), deleteHotel);

export default router;
