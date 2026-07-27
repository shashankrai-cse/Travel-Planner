import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Itinerary } from "../models/Itinerary.js";
import { updateItinerarySchema } from "../validators/itinerary.validators.js";

export const getItineraryByPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const itinerary = await Itinerary.findOne({ package: packageId });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found for this package");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, itinerary, "Itinerary retrieved successfully"));
});

export const updateItineraryByPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const validatedData = updateItinerarySchema.parse(req.body);

  const itinerary = await Itinerary.findOneAndUpdate(
    { package: packageId },
    { $set: { days: validatedData.days } },
    { new: true, upsert: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, itinerary, "Itinerary updated successfully"));
});
