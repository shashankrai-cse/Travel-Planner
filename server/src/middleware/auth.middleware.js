import { getAuth } from "@clerk/express";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

const getAdminEmails = () => {
  const envEmails = process.env.ADMIN_EMAILS || "admin@wayfarer.com";
  return envEmails.split(",").map((e) => e.trim().toLowerCase());
};

export const requireAuth = asyncHandler(async (req, res, next) => {
  let userId = null;

  // 1. Check Clerk getAuth helper
  try {
    const auth = getAuth(req);
    userId = auth?.userId;
  } catch (err) {
    // Clerk getAuth may throw if middleware failed
  }

  // 2. Direct check on req.auth
  if (!userId) {
    userId = req.auth?.userId;
  }

  // 3. Fallback check for dev mode token
  const authHeader = req.headers.authorization;
  if (!userId && authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token === "dev_user_123" || !process.env.CLERK_SECRET_KEY) {
      userId = token || "dev_user_123";
    }
  }

  if (!userId) {
    throw new ApiError(401, "Authentication required. Please sign in.");
  }

  // Fetch or mirror user from MongoDB
  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    let realEmail = `${userId.toLowerCase()}@example.com`;
    let realName = userId === "dev_user_123" ? "Demo Admin User" : "Wayfarer Traveler";
    
    if (userId !== "dev_user_123" && process.env.CLERK_SECRET_KEY) {
      try {
        const { clerkClient } = await import("../config/clerk.js");
        const clerkUser = await clerkClient.users.getUser(userId);
        if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
          realEmail = clerkUser.emailAddresses[0].emailAddress;
        }
        realName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || realName;
      } catch (err) {
        console.error("Failed to fetch clerk user in middleware:", err.message);
      }
    }

    const isAdmin = getAdminEmails().includes(realEmail.toLowerCase());

    user = await User.create({
      clerkId: userId,
      email: realEmail.toLowerCase(),
      name: realName,
      role: isAdmin || userId === "dev_user_123" ? "admin" : "traveler",
    });
  }

  req.user = user;
  next();
});
