import prisma from '../../config/prisma.js';
import type { UserInput } from '../../validators/user.validate.js';

export const createUser = async (input: UserInput) => {
  return await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
    },
  });
};