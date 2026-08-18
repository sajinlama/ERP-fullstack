import { Router } from "express";
import { requireApprover } from "../../middleware/auth.middleware.js";
import { approveSupplierController, rejectSupplierController } from "../../controllers/SupplierApproval /supplierApproval.js";


const router = Router();

// Protect all approval routes with the approver role check
router.use(requireApprover);

router.post("/approval", approveSupplierController);
router.post("/reject", rejectSupplierController);

export default router;