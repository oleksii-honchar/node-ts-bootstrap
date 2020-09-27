import { Router } from "express";

import { keepAuthTokenMiddleware, rateLimitMiddleware } from "@src/utils/middlewares";
import { docsRouter, healthRouter, swaggerEditorRouter, userRouter, versionRouter } from "./api";

export const apiRouter = Router();

apiRouter.use(rateLimitMiddleware, keepAuthTokenMiddleware, [healthRouter, userRouter, versionRouter]);

if (process.env.SVC_ENABLE_API_DOCS === "true") {
  apiRouter.use("/docs", docsRouter);
  apiRouter.use("/swagger-editor", swaggerEditorRouter);
}
