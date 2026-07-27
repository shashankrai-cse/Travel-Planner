import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Review } from "../models/Review.js";
import { z } from "zod";

const createReviewSchema = z.object({
  package: z.string().min(1, "Package ID is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
});

export const getReviewsByPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const reviews = await Review.find({ package: packageId })
    .populate("user", "name avatarUrl")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews retrieved successfully"));
});

export const createReview = asyncHandler(async (req, res) => {
  const validatedData = createReviewSchema.parse(req.body);

  const review = await Review.create({
    user: req.user._id,
    package: validatedData.package,
    rating: validatedData.rating,
    comment: validatedData.comment,
  });

  const populated = await Review.findById(review._id).populate("user", "name avatarUrl");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Review created successfully"));
});
