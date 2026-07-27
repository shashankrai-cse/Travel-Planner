import mongoose from "mongoose";

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    maxGroupSize: {
      type: Number,
      required: true,
      min: 1,
    },
    includedServices: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    startDates: [
      {
        type: Date,
      },
    ],
    itinerary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const TourPackage = mongoose.model("TourPackage", tourPackageSchema);
