import { Router } from "express";
import newSuppliers from "../../controllers/suppliers/CreateSuppliers.js";
import updateSupplers from "../../controllers/suppliers/updateSuppliers.js";
import getAllSupplires from "../../controllers/suppliers/getAllSuppliers.js";
import { getMySuppliersController } from "../../controllers/suppliers/getMySuppliers.controller.js";


const router:Router = Router();

router.post("/createsSuppliers",newSuppliers);
router.put("/updateSuppliers",updateSupplers);
router.get("/getSupplires",getAllSupplires);
router.get("/my-suppliers", getMySuppliersController);
    
export default router;