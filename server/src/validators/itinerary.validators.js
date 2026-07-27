import { z } from "zod";

const daySchema = z.object({
  dayNumber: z.number().min(1, "Day number is required"),
  title: z.string().min(2, "Day title is required"),
  description: z.string().min(5, "Description is required"),
  activities: z.array(z.string()).optional().default([]),
  meals: z.array(z.string()).optional().default([]),
  optional: z.boolean().optional().default(false),
});

export const updateItinerarySchema = z.object({
  days: z.array(daySchema).min(1, "At least one day itinerary is required"),
});
