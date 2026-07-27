import { Router } from "express";
import {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinations.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getDestinations);
router.get("/:slug", getDestinationBySlug);

// Protected mutation routes
router.post("/", requireAuth, requireRole("vendor", "admin"), createDestination);
router.patch("/:id", requireAuth, requireRole("vendor", "admin"), updateDestination);
router.delete("/:id", requireAuth, requireRole("admin"), deleteDestination);

export default router;
