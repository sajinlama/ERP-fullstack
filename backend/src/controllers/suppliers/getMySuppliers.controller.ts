import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import ApiError from "../../utils/api.js";
import { getMySuppliers } from "../../services/suppliers/getMySuppliers.service.js";


export const getMySuppliersController = asyncHandler(
  async (req: Request, res: Response) => {
    // Read from header or query param
    const userId = (req.headers["x-user-id"] as string) || req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "Missing user ID identifier");
    }

    const suppliers = await getMySuppliers(userId);

    res.status(200).json(
      new ApiResponse(200, suppliers, "User suppliers retrieved successfully")
    );
  }
);