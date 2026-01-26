import { z } from 'zod';

export const applyCompanionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z.string().email('Invalid email address').trim(),
    specialties: z.array(z.string().min(1)).min(1, 'At least one specialty is required'),
    experience: z.string().min(1, 'Experience is required').trim(),
    bio: z.string().min(1, 'Bio is required').trim(),
  }),
});

export const getCompanionsQuerySchema = z.object({
  query: z.object({
    availability: z.string().optional(),
    specialty: z.string().optional(),
    language: z.string().optional(),
    minPrice: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  }),
});

