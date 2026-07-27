import { z } from "zod";

const travelerSchema = z.object({
  name: z.string().min(1, "Traveler name is required"),
  age: z.number().min(1, "Traveler age is required"),
  email: z.string().email().optional(),
});

export const createBookingSchema = z.object({
  package: z.string().min(1, "Package ID is required"),
  hotel: z.string().optional(),
  roomType: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  travelers: z.array(travelerSchema).min(1, "At least one traveler is required"),
  addOns: z.array(z.object({ name: z.string(), price: z.number() })).optional().default([]),
});
