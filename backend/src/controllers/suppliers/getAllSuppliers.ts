import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import getAllSuppliers from "../../services/suppliers/getAllSuppliers.service.js";

export const getAllSuppliersController = asyncHandler(async (req: Request, res: Response) => {
  const suppliers = await getAllSuppliers();

  res.status(200).json(
    new ApiResponse(200, suppliers, "Suppliers fetched successfully")
  );
});

export default getAllSuppliersController;