import { Router } from "express";
import {
  getReviewsByPackage,
  createReview,
} from "../controllers/reviews.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/package/:packageId", getReviewsByPackage);
router.post("/", requireAuth, createReview);

export default router;
