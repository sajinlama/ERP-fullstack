import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodIssue } from "zod";
import ApiError from "../utils/api.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let apiError: ApiError;

  if (err instanceof ApiError) {
    apiError = err;
  } else if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue: ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    apiError = new ApiError(400, "Validation Error", formattedErrors);
  } else if (err instanceof Error) {
    const customStatus = (err as { statusCode?: number }).statusCode;
    apiError = new ApiError(customStatus || 500, err.message, [], err.stack);
  } else {
    apiError = new ApiError(500, "Something went wrong");
  }

  res.status(apiError.statusCode).json({
    success: apiError.success,
    statusCode: apiError.statusCode,
    message: apiError.message,
    errors: apiError.errors,
    data: apiError.data,
  });
};