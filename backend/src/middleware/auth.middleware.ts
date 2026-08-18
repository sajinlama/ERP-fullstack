import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import ApiError from "../utils/api.js";
import { Role } from "../generated/prisma/index.js";

export const requireApprover = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Read userId from a header (e.g. "x-user-id: <UUID_FROM_CREATE_USER>")
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      throw new ApiError(401, "Authentication failed: Missing x-user-id header");
    }

    // Lookup user in DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Role check: Only APPROVER can approve/reject
    if (user.role !== Role.APPROVER) {
      throw new ApiError(403, "Forbidden: Only APPROVER users can perform this action");
    }

    // Attach user to the request object
    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};