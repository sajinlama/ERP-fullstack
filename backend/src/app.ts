import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import { router } from "./routes/route.index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", router);

// 4. 404 Not FoundCatch-all
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 5. Global Error Handler (MUST be the last middleware)
app.use(errorHandler);

export default app;