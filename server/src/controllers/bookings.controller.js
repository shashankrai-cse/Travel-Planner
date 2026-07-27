import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Booking } from "../models/Booking.js";
import { TourPackage } from "../models/TourPackage.js";
import { Hotel } from "../models/Hotel.js";
import { createBookingSchema } from "../validators/booking.validators.js";
import { sendEmail } from "../services/email.service.js";

export const createBooking = asyncHandler(async (req, res) => {
  const validatedData = createBookingSchema.parse(req.body);

  const tourPackage = await TourPackage.findById(validatedData.package);
  if (!tourPackage) {
    throw new ApiError(404, "Tour package not found");
  }

  // Calculate pricing
  const basePrice = tourPackage.basePrice * validatedData.travelers.length;

  let hotelPrice = 0;
  if (validatedData.hotel && validatedData.roomType) {
    const hotel = await Hotel.findById(validatedData.hotel);
    const room = hotel?.roomTypes?.find((r) => r.name === validatedData.roomType);
    if (room) {
      hotelPrice = room.pricePerNight * tourPackage.durationDays;
    }
  }

  const addOnsPrice = validatedData.addOns.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = basePrice + hotelPrice + addOnsPrice;

  const booking = await Booking.create({
    user: req.user._id,
    package: validatedData.package,
    hotel: validatedData.hotel || null,
    roomType: validatedData.roomType || null,
    startDate: new Date(validatedData.startDate),
    endDate: new Date(validatedData.endDate),
    travelers: validatedData.travelers,
    addOns: validatedData.addOns,
    totalPrice,
    status: "pending",
    paymentStatus: "unpaid",
  });

  const populated = await Booking.findById(booking._id)
    .populate("package")
    .populate("hotel");

  // Send confirmation email asynchronously
  sendEmail({
    to: req.user.email,
    subject: `Wayfarer Booking Confirmation - #${booking._id}`,
    text: `Your booking for ${tourPackage.title} is initiated. Total: $${totalPrice}.`,
  }).catch((err) => console.error("Failed to send email:", err));

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Booking created successfully"));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("package")
    .populate("hotel")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "User bookings retrieved successfully"));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("package")
    .populate("hotel")
    .populate("user", "name email");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Ensure user owns this booking or is an admin/vendor
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role === "traveler") {
    throw new ApiError(403, "Unauthorized to view this booking");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking retrieved successfully"));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role === "traveler") {
    throw new ApiError(403, "Unauthorized to cancel this booking");
  }

  booking.status = "cancelled";
  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("package")
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "All bookings retrieved for admin"));
});
