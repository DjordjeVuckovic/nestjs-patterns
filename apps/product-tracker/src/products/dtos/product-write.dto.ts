import { z } from 'zod';
export const CreateProduct = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  categoryIds: z.array(z.uuid()).optional(),
});

export type CreateProduct = z.infer<typeof CreateProduct>;