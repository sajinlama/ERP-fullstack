import { Router } from "express";
import updateSupplers from "../../controllers/suppliers/updateSuppliers.js";
import getAllSupplires from "../../controllers/suppliers/getAllSuppliers.js";
import { getMySuppliersController } from "../../controllers/suppliers/getMySuppliers.controller.js";
import newSupplierController from "../../controllers/suppliers/createSuppliers.js";


const router:Router = Router();

router.post("/createsSuppliers",newSupplierController);
router.put("/updateSuppliers",updateSupplers);
router.get("/getSupplires",getAllSupplires);
router.get("/my-suppliers", getMySuppliersController);
    
export default router;