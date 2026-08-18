import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/ayncWrapper.js";
import { ApproveSupplierSchema, RejectSupplierSchema } from "../../validators/suppliers.validate.js";
import ApiError from "../../utils/api.js";
import { approveSupplierService, rejectSupplierService } from "../../services/suppliers/supplierApproval.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";


export const approveSupplierController = asyncHandler(
  async (req: Request, res: Response) => {
    const approverId = req.user?.userId;
    if (!approverId) {
      throw new ApiError(401, "Authentication required");
    }

    const { supplierId } = ApproveSupplierSchema.parse(req.body);

    const supplier = await approveSupplierService(supplierId, approverId);

    res.status(200).json(
      new ApiResponse(200, supplier, "Supplier approved successfully")
    );
  }
);
export const rejectSupplierController = asyncHandler(
  async (req: Request, res: Response) => {
    const approverId = req.user?.userId;
    if (!approverId) {
      throw new ApiError(401, "Authentication required");
    }

    // 1. Validates supplierId and rejectionReason (throws ZodError if invalid)
    const { supplierId, rejectionReason } = RejectSupplierSchema.parse(req.body);

    // 2. Executes rejection logic
    const supplier = await rejectSupplierService(
      supplierId,
      approverId,
      rejectionReason
    );

    // 3. Return response
    res.status(200).json(
      new ApiResponse(200, supplier, "Supplier rejected successfully")
    );
  }
);