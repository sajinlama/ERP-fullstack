import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { CreateUserSchema } from "../../validators/user.validate.js";
import userLogin from "../../services/userLogin.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const UserLogin = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = CreateUserSchema.parse(req.body);

 
  const user = await userLogin(validatedData);

  res.status(200).json(
    new ApiResponse(200, user, "Login successful")
  );
});

export default UserLogin;