import prisma from "../../config/prisma.js";
import ApiError from "../../utils/api.js";

export interface UserLoginInput {
  email: string;
}

const userLogin = async (input: UserLoginInput) => {
  const { email } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  return user;
};

export default userLogin;