import { Router } from "express";
import {
  getItineraryByPackage,
  updateItineraryByPackage,
} from "../controllers/itineraries.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/:packageId", getItineraryByPackage);
router.patch("/:packageId", requireAuth, requireRole("vendor", "admin"), updateItineraryByPackage);

export default router;
