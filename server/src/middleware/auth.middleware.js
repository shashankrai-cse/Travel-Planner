import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const userId = req.auth?.userId;
  if (!userId) {
    throw new ApiError(401, "Authentication required. Please sign in.");
  }

  // Fetch or mirror user from MongoDB
  let user = await User.findOne({ clerkId: userId });
  
  // If user exists, attach to req.user
  if (user) {
    req.user = user;
  }
  
  next();
});
