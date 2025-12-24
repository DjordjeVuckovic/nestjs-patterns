import {z} from 'zod';
export const FindProducts = z.object({
  limit: z.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
  name: z.string().min(1).max(255).optional(),
})

export type FindProducts = z.infer<typeof FindProducts>;