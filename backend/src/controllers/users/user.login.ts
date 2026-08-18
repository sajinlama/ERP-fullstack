import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { CreateUserSchema, loginUser } from "../../validators/user.validate.js";
import userLogin from "../../services/users/userLogin.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const UserLogin = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = loginUser.parse(req.body);

 
  const user = await userLogin(validatedData);

  res.status(200).json(
    new ApiResponse(200, user, "Login successful")
  );
});

export default UserLogin;