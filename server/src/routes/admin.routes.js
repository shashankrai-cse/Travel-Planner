import { Router } from "express";
import { getAllUsers, updateUserRole } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;
