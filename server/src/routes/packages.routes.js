import { Router } from "express";
import {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packages.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getPackages);
router.get("/:slug", getPackageBySlug);

router.post("/", requireAuth, requireRole("vendor", "admin"), createPackage);
router.patch("/:id", requireAuth, requireRole("vendor", "admin"), updatePackage);
router.delete("/:id", requireAuth, requireRole("admin"), deletePackage);

export default router;
