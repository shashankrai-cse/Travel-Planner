import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Hotel } from "../models/Hotel.js";
import { createHotelSchema, updateHotelSchema } from "../validators/hotel.validators.js";

export const getHotels = asyncHandler(async (req, res) => {
  const { destination } = req.query;
  const filter = destination ? { destination } : {};

  const hotels = await Hotel.find(filter)
    .populate("destination", "name country slug")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, hotels, "Hotels retrieved successfully"));
});

export const getHotelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findById(id).populate("destination");

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel retrieved successfully"));
});

export const createHotel = asyncHandler(async (req, res) => {
  const validatedData = createHotelSchema.parse(req.body);

  const hotel = await Hotel.create({
    ...validatedData,
    createdBy: req.user?._id,
  });

  const populated = await Hotel.findById(hotel._id).populate("destination");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Hotel created successfully"));
});

export const updateHotel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateHotelSchema.parse(req.body);

  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true }
  ).populate("destination");

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel updated successfully"));
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findByIdAndDelete(id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Hotel deleted successfully"));
});
