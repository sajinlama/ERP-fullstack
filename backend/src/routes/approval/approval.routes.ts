import { Router } from "express";
import { requireApprover } from "../../middleware/auth.middleware.js";
import { approveSupplierController, rejectSupplierController } from "../../controllers/SupplierApproval /supplierApproval.js";


const approveRoutes = Router();

// Protect all routes in this router with requireApprover middleware
approveRoutes.use(requireApprover);

approveRoutes.post("/approval", approveSupplierController);
approveRoutes.post("/reject", rejectSupplierController);

export default approveRoutes;