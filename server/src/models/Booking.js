import mongoose from "mongoose";

const travelerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const addOnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourPackage",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    roomType: {
      type: String,
      default: "",
    },
    travelers: [travelerSchema],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    addOns: [addOnSchema],
    priceBreakdown: {
      base: { type: Number, required: true },
      hotel: { type: Number, default: 0 },
      addOns: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);
