import prisma from "../config/prisma.js";
import ApiError from "../utils/api.js";
import type { UserInput } from "../validators/user.validate.js";

const userLogin = async (input: UserInput) => {
  const { email } = input;


  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  return user;
};

export default userLogin;