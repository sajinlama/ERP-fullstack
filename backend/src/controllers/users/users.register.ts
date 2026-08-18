import type { Request, Response } from 'express';
import { CreateUserSchema } from '../../validators/user.validate.js';
import { asyncHandler } from '../../utils/ayncWrapper.js';
import { createUser } from '../../services/users/userCreate.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const createUserController = asyncHandler(async (req: Request, res: Response) => {
 
  const validatedData = CreateUserSchema.parse(req.body);

  const newUser = await createUser(validatedData);


  res.status(201).json(
    new ApiResponse(201, newUser, "User created successfully")
  );
});

export default createUserController;