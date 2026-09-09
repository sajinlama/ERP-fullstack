
import prisma from '../../config/prisma.js';

import type { UserInput } from '../../validators/user.validate.js';

export const createUser = async (input: UserInput) => {
  // Check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Create the user
  return await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
    },
  });
};

