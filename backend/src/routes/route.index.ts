import { Router } from "express";
import authRoutes from "./user/user.router.js";
import SupplierRoutes from "./suppliersRoutes/route.suppliers.js";
import approveRoutes from "./approval/route.js"




export const router:Router = Router();

router.use("/auth",authRoutes);
router.use("/suppliers",SupplierRoutes);
router.use("/approver", approveRoutes); 