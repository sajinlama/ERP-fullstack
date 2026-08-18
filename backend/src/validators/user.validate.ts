import { z } from 'zod';
import { Role,Country,SupplierStatus } from '../generated/prisma/index.js';



export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(Role),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  role: true,
});

// Schema for updating an existing User
export const UpdateUserSchema = CreateUserSchema.partial();



// Infer TypeScript types directly from Zod schemas
export type UserInput = z.infer<typeof CreateUserSchema>;
