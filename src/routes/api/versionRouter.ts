import { Router } from "express";

import { versionController } from "@src/controllers/versionController";

export const versionRouter = Router();

versionRouter.get("/version", versionController.get);
