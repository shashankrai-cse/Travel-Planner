import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";
import { clerkClient } from "../config/clerk.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users retrieved successfully"));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["traveler", "vendor", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role specified. Must be traveler, vendor, or admin.");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update Mongo User
  user.role = role;
  await user.save();

  // Sync to Clerk publicMetadata
  try {
    if (user.clerkId && process.env.CLERK_SECRET_KEY) {
      await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: { role },
      });
    }
  } catch (error) {
    console.error("Failed to update Clerk user metadata:", error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, `User role updated to ${role}`));
});
