import { Router, Request, Response, NextFunction } from "express";
import url from "url";
import path from "path";
import { StatusCodes } from "http-status-codes";

import { is } from "./utils/is";

import { apiRouter } from "./routes/apiRouter";
import { faviconRouter } from "./routes/faviconRouter";

const mountPoint = process.env.SVC_MOUNT_POINT;
export const mainRouter = Router();

mainRouter.use(faviconRouter);

mainRouter.use(<string>mountPoint, [
  apiRouter,
  (req: Request, res: Response, next: NextFunction) => {
    if (is.nullOrUndefined(req.route)) {
      res.statusCode = StatusCodes.NOT_FOUND;
    }

    return next();
  },
]);

mainRouter.use("*", (req, res, next) => {
  if (req.route || res.statusCode === StatusCodes.NOT_FOUND || res.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    return next();
  }

  if (path.extname(url.parse(req.originalUrl).pathname || "")) {
    res.statusCode = StatusCodes.NOT_FOUND;
    return next();
  }

  return next();
});
