import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 1,
  },
});

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    roomTypes: [roomTypeSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Hotel = mongoose.model("Hotel", hotelSchema);
