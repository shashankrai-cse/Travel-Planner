import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Destination } from "../models/Destination.js";
import { createDestinationSchema, updateDestinationSchema } from "../validators/destination.validators.js";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, destinations, "Destinations retrieved successfully"));
});

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const destination = await Destination.findOne({
    $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
  });

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, destination, "Destination retrieved successfully"));
});

export const createDestination = asyncHandler(async (req, res) => {
  const validatedData = createDestinationSchema.parse(req.body);
  const slug = slugify(validatedData.name);

  const existing = await Destination.findOne({ slug });
  if (existing) {
    throw new ApiError(400, `Destination with name "${validatedData.name}" already exists`);
  }

  const destination = await Destination.create({
    ...validatedData,
    slug,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, destination, "Destination created successfully"));
});

export const updateDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateDestinationSchema.parse(req.body);

  if (validatedData.name) {
    validatedData.slug = slugify(validatedData.name);
  }

  const destination = await Destination.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, destination, "Destination updated successfully"));
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findByIdAndDelete(id);

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Destination deleted successfully"));
});
