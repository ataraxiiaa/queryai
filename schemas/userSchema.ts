import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(1, "City is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});