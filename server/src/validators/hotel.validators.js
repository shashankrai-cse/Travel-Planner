import { z } from "zod";

const roomTypeSchema = z.object({
  name: z.string().min(1, "Room type name is required"),
  pricePerNight: z.number().min(0, "Price per night must be positive"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  totalRooms: z.number().min(1, "Total rooms must be at least 1"),
});

export const createHotelSchema = z.object({
  name: z.string().min(2, "Hotel name is required"),
  destination: z.string().min(1, "Destination ID is required"),
  address: z.string().min(5, "Address is required"),
  starRating: z.number().min(1).max(5).optional().default(3),
  amenities: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  roomTypes: z.array(roomTypeSchema).min(1, "At least one room type is required"),
});

export const updateHotelSchema = createHotelSchema.partial();
