import { Router } from "express";
import {
  handleCreatePaymentIntent,
  handleConfirmPayment,
} from "../controllers/payments.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-intent", requireAuth, handleCreatePaymentIntent);
router.post("/confirm", requireAuth, handleConfirmPayment);

export default router;
