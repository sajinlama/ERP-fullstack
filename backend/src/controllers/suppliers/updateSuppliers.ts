import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { UpdateSupplierSchema } from "../../validators/suppliers.validate.js";
import updateSupplier from "../../services/suppliers/update.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const updateSuppliers = asyncHandler(async (req: Request, res: Response) => {
  // Validate against the partial update schema
  const validData = UpdateSupplierSchema.parse(req.body);

  // Pass validated data to the update service
  const data = await updateSupplier(validData);

  res.status(200).json(
    new ApiResponse(200, data, "Supplier updated successfully")
  );
});

export default updateSuppliers;