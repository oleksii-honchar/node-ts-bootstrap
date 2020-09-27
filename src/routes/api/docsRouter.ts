import { Router, static as serveStatic } from "express";
import path from "path";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

import { getLogger } from "../../utils/logger";
import { is } from "../../utils/is";
import { STATIC_ASSETS_PATH } from "../../constants";

export const docsRouter = Router();
const logger = getLogger("/docs");

docsRouter.all("/swagger.json", (req, res) => {
  const filePath = path.join(STATIC_ASSETS_PATH, "../swagger.json");
  logger.debug(`docs json: ${filePath}`);

  if (fs.existsSync(filePath)) {
    logger.debug("file exists");
  } else {
    logger.warn("file DOESN'T exists");
  }

  res.statusCode = StatusCodes.OK;
  res.sendFile(filePath);
});

const docsPath = path.join(STATIC_ASSETS_PATH, "docs");
docsRouter.get("*", serveStatic(docsPath), (req, res, next) => {
  if (is.nullOrUndefined(req.route)) {
    res.statusCode = StatusCodes.NOT_FOUND;
  }

  return next();
});
