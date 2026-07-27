import { z } from "zod";

export const createDestinationSchema = z.object({
  name: z.string().min(2, "Destination name is required"),
  country: z.string().min(2, "Country is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string().url()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
});

export const updateDestinationSchema = createDestinationSchema.partial();
