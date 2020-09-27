import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import pkg from "package.json";

function get(req: Request, res: Response, next: NextFunction): void {
  const packageName = pkg.name || "not specified";
  const packageVersion = pkg.version || "not specified";
  res.body = { version: `${packageName}:${packageVersion}` };
  res.statusCode = StatusCodes.OK;
  next();
}

export const versionController = { get };
