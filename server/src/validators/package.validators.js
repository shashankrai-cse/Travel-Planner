import { z } from "zod";

export const createPackageSchema = z.object({
  title: z.string().min(3, "Title is required"),
  destination: z.string().min(1, "Destination ID is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.number().min(0, "Base price must be positive"),
  durationDays: z.number().min(1, "Duration must be at least 1 day"),
  maxGroupSize: z.number().min(1, "Max group size must be at least 1"),
  includedServices: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  startDates: z.array(z.string()).optional().default([]),
});

export const updatePackageSchema = createPackageSchema.partial();
