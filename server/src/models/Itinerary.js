import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  activities: [
    {
      type: String,
    },
  ],
  meals: [
    {
      type: String,
    },
  ],
  optional: {
    type: Boolean,
    default: false,
  },
});

const itinerarySchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourPackage",
      required: true,
    },
    days: [daySchema],
  },
  {
    timestamps: true,
  }
);

export const Itinerary = mongoose.model("Itinerary", itinerarySchema);
