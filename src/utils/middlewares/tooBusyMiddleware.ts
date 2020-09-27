import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import toobusy from "toobusy-js";

import { is } from "../is";

toobusy.maxLag(300);
toobusy.interval(500);

export function tooBusyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const free = is.falsy(toobusy());

  if (free) {
    return next();
  }

  const error = new Error("I'm busy right now, sorry.");
  error["code"] = StatusCodes.SERVICE_UNAVAILABLE;
  delete error.stack;
  return next(error);
}
