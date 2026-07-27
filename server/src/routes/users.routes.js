import { Router } from "express";
import { getCurrentUser, updateCurrentUser, updateSelfRole } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", requireAuth, getCurrentUser);
router.patch("/me", requireAuth, updateCurrentUser);
router.patch("/me/role", requireAuth, updateSelfRole);

export default router;
