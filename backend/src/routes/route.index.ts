import { Router } from "express";
import authRoutes from "./user/user.router.js";
import supplierRoutes from "./suppliers/suppliers.routes.js";
import approveRoutes from "./approval/approval.Routes.js";




export const router:Router = Router();

router.use("/auth",authRoutes);
router.use("/suppliers",supplierRoutes);
router.use("/approver", approveRoutes); 