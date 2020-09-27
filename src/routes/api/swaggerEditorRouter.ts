import { Router, static as serveStatic } from "express";
import path from "path";
import { StatusCodes } from "http-status-codes";

import { is } from "../../utils/is";
import { STATIC_ASSETS_PATH } from "../../constants";

export const swaggerEditorRouter = Router();

swaggerEditorRouter.all("/swagger.json", (req, res, next) => {
  const filePath = path.join(STATIC_ASSETS_PATH, "../swagger.json");
  res.sendFile(filePath);
  return next();
});

const editorPath = path.join(STATIC_ASSETS_PATH, "swagger-editor");
swaggerEditorRouter.get("*", serveStatic(editorPath), (req, res, next) => {
  if (is.nullOrUndefined(req.route)) {
    res.statusCode = StatusCodes.NOT_FOUND;
  }

  return next();
});
