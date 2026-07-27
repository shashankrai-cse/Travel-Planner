import { Router } from "express";
import express from "express";
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/apiResponse.js";

const router = Router();

// Express raw body parsing may be needed for signature verification if Svix is used
router.post("/clerk", express.json(), async (req, res) => {
  try {
    const evt = req.body;
    const eventType = evt?.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url, public_metadata, phone_numbers } = evt.data;
      const primaryEmail = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "";
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "Traveler";
      const role = public_metadata?.role || "traveler";
      const phone = phone_numbers && phone_numbers.length > 0 ? phone_numbers[0].phone_number : "";

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          email: primaryEmail,
          name,
          avatarUrl: image_url || "",
          role,
          phone,
        },
        { upsert: true, new: true, runValidators: true }
      );
    } else if (eventType === "user.deleted") {
      const { id } = evt.data;
      await User.findOneAndDelete({ clerkId: id });
    }

    return res.status(200).json(new ApiResponse(200, null, "Webhook processed successfully"));
  } catch (error) {
    console.error("Clerk Webhook Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
