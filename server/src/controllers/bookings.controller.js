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

  let tourPackage = null;

  // 1. Try finding package by ObjectId if valid 24-char hex string
  if (validatedData.package && /^[0-9a-fA-F]{24}$/.test(validatedData.package)) {
    tourPackage = await TourPackage.findById(validatedData.package);
  }

  // 2. Try finding package by slug or title if not found by ObjectId
  if (!tourPackage && validatedData.package) {
    tourPackage = await TourPackage.findOne({
      $or: [{ slug: validatedData.package }, { title: validatedData.package }],
    });
  }

  // 3. Fallback to the first available package in database if none matched or fallback ID sent
  if (!tourPackage) {
    tourPackage = await TourPackage.findOne();
  }

  if (!tourPackage) {
    throw new ApiError(
      404,
      "No tour packages currently exist in the system. Please create a package first or seed the database."
    );
  }

  // Calculate pricing based on tour package
  const travelersCount = Math.max(1, validatedData.travelers.length);
  const basePrice = (tourPackage.basePrice || 1499) * travelersCount;

  let hotelPrice = 0;
  if (validatedData.hotel && validatedData.roomType) {
    const hotel = await Hotel.findById(validatedData.hotel);
    const room = hotel?.roomTypes?.find((r) => r.name === validatedData.roomType);
    if (room) {
      hotelPrice = room.pricePerNight * (tourPackage.durationDays || 5);
    }
  }

  const addOnsPrice = (validatedData.addOns || []).reduce((sum, item) => sum + (item.price || 0), 0);
  const totalPrice = basePrice + hotelPrice + addOnsPrice;

  const booking = await Booking.create({
    user: req.user._id,
    package: tourPackage._id,
    hotel: validatedData.hotel || null,
    roomType: validatedData.roomType || null,
    startDate: new Date(validatedData.startDate),
    endDate: new Date(validatedData.endDate),
    travelers: validatedData.travelers,
    addOns: validatedData.addOns || [],
    totalPrice,
    status: "confirmed",
    paymentStatus: "paid",
  });

  const populated = await Booking.findById(booking._id)
    .populate("package")
    .populate("hotel");

  // Send confirmation email asynchronously
  sendEmail(req.user.email, {
    id: booking._id,
    total: totalPrice,
    subject: `Wayfarer Booking Confirmation - #${booking._id}`,
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

  // Ensure user owns this booking or is an admin/vendor/owner
  const isOwnerOrAdmin = ["admin", "vendor", "owner"].includes(req.user.role);
  if (booking.user._id.toString() !== req.user._id.toString() && !isOwnerOrAdmin) {
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

  const isOwnerOrAdmin = ["admin", "vendor", "owner"].includes(req.user.role);
  if (booking.user.toString() !== req.user._id.toString() && !isOwnerOrAdmin) {
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
    .json(new ApiResponse(200, bookings, "All bookings retrieved for admin/vendor"));
});
