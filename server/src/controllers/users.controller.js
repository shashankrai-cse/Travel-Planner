import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";
import { clerkClient } from "../config/clerk.js";

const getAdminEmails = () => {
  const envEmails = process.env.ADMIN_EMAILS || "admin@wayfarer.com";
  return envEmails.split(",").map((e) => e.trim().toLowerCase());
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  let user = req.user;

  if (!user && req.auth?.userId) {
    user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      const clerkUser = req.auth.user || {};
      const userEmail = (clerkUser.emailAddresses?.[0]?.emailAddress || `${req.auth.userId}@placeholder.com`).toLowerCase();
      const isAdmin = getAdminEmails().includes(userEmail);

      user = await User.create({
        clerkId: req.auth.userId,
        email: userEmail,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Wayfarer Member',
        avatarUrl: clerkUser.imageUrl || '',
        role: isAdmin ? 'admin' : (clerkUser.publicMetadata?.role || 'traveler'),
      });
    }
  }

  // Ensure env-based admin role is reflected
  if (user && getAdminEmails().includes(user.email.toLowerCase()) && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const { name, phone, avatarUrl } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(404, "User profile not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl && { avatarUrl }),
      },
    },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User profile updated successfully"));
});

export const updateSelfRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const normalizedRole = role === "owner" ? "vendor" : role;

  if (!["traveler", "vendor", "owner"].includes(role)) {
    throw new ApiError(400, "Invalid role. Select either 'traveler' (User) or 'vendor'/'owner' (Owner).");
  }

  let user = req.user;
  if (!user && req.auth?.userId) {
    user = await User.findOne({ clerkId: req.auth.userId });
  }

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  const isAdmin = getAdminEmails().includes(user.email.toLowerCase());
  const finalRole = isAdmin ? 'admin' : normalizedRole;

  user.role = finalRole;
  await user.save();

  try {
    if (user.clerkId && process.env.CLERK_SECRET_KEY) {
      await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: { role: finalRole },
      });
    }
  } catch (error) {
    console.error("Failed to update Clerk user metadata:", error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, `Account role set to ${finalRole}`));
});
