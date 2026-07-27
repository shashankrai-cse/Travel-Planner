import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { createPaymentIntent } from "../services/payment.service.js";

export const handleCreatePaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const intent = await createPaymentIntent(booking.totalPrice, "usd", {
    bookingId: booking._id.toString(),
    userId: req.user._id.toString(),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        clientSecret: intent.client_secret || `mock_secret_${Date.now()}`,
        amount: booking.totalPrice,
      },
      "Payment intent created"
    )
  );
});

export const handleConfirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentIntentId, paymentMethod } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  await booking.save();

  const paymentRecord = await Payment.create({
    booking: booking._id,
    user: req.user._id,
    amount: booking.totalPrice,
    stripePaymentIntentId: paymentIntentId || `pi_mock_${Date.now()}`,
    paymentMethod: paymentMethod || "card",
    status: "succeeded",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { booking, payment: paymentRecord },
      "Payment confirmed successfully"
    )
  );
});
