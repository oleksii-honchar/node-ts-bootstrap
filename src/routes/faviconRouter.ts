import { Router } from "express";
import path from "path";

import { STATIC_ASSETS_PATH } from "@src/constants";

export const faviconRouter = Router();

faviconRouter.get("/favicon.ico", (req, res) => {
  const filePath = path.join(STATIC_ASSETS_PATH, "favicon.ico");
  res.sendFile(filePath);
});
