import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { CreateSupplierSchema } from "../../validators/suppliers.validate.js"; 
import { ApiResponse } from "../../utils/apiResponse.js";
import { createSupplier } from "../../services/suppliers/CreateSuppliers.service.js";

export const newSupplierController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = CreateSupplierSchema.parse(req.body);

  const supplier = await createSupplier(validatedData);

  res.status(201).json(
    new ApiResponse(201, supplier, "Supplier created successfully")
  );
});

export default newSupplierController;