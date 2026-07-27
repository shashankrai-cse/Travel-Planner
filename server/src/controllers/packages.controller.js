import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { TourPackage } from "../models/TourPackage.js";
import { Itinerary } from "../models/Itinerary.js";
import { createPackageSchema, updatePackageSchema } from "../validators/package.validators.js";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getPackages = asyncHandler(async (req, res) => {
  const { destination, minPrice, maxPrice, duration } = req.query;
  const filter = {};

  if (destination) {
    filter.destination = destination;
  }
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }
  if (duration) {
    filter.durationDays = Number(duration);
  }

  const packages = await TourPackage.find(filter)
    .populate("destination", "name country slug")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "Tour packages retrieved successfully"));
});

export const getPackageBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const tourPackage = await TourPackage.findOne({
    $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
  })
    .populate("destination")
    .populate("itinerary");

  if (!tourPackage) {
    throw new ApiError(404, "Tour package not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tourPackage, "Tour package retrieved successfully"));
});

export const createPackage = asyncHandler(async (req, res) => {
  const validatedData = createPackageSchema.parse(req.body);
  const slug = slugify(validatedData.title);

  const existing = await TourPackage.findOne({ slug });
  if (existing) {
    throw new ApiError(400, `Tour package with title "${validatedData.title}" already exists`);
  }

  const tourPackage = await TourPackage.create({
    ...validatedData,
    slug,
    createdBy: req.user?._id,
  });

  // Auto-initialize an Itinerary document for this package if not created yet
  const days = Array.from({ length: tourPackage.durationDays }).map((_, idx) => ({
    dayNumber: idx + 1,
    title: `Day ${idx + 1}: Overview`,
    description: `Day ${idx + 1} itinerary details for ${tourPackage.title}.`,
    activities: ["Arrival & Check-in"],
    meals: ["Breakfast"],
    optional: false,
  }));

  const itinerary = await Itinerary.create({
    package: tourPackage._id,
    days,
  });

  tourPackage.itinerary = itinerary._id;
  await tourPackage.save();

  const populated = await TourPackage.findById(tourPackage._id)
    .populate("destination")
    .populate("itinerary");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Tour package and itinerary created successfully"));
});

export const updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updatePackageSchema.parse(req.body);

  if (validatedData.title) {
    validatedData.slug = slugify(validatedData.title);
  }

  const tourPackage = await TourPackage.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true }
  ).populate("destination").populate("itinerary");

  if (!tourPackage) {
    throw new ApiError(404, "Tour package not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tourPackage, "Tour package updated successfully"));
});

export const deletePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tourPackage = await TourPackage.findByIdAndDelete(id);

  if (!tourPackage) {
    throw new ApiError(404, "Tour package not found");
  }

  // Delete linked itinerary
  await Itinerary.deleteMany({ package: id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tour package deleted successfully"));
});
