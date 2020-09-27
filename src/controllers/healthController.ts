import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { getLogger } from "@src/utils/logger";

import { dbService } from "@src/services";

const logger = getLogger("healthController");

async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
  const isConnected = await dbService.isConnected();
  const dbStatus = isConnected ? "CONNECTED" : "NOT CONNECTED";

  logger.debug("req details", {
    reqHeaders: req.headers,
    referer: req.headers["referer"],
    protocol: req.protocol,
    secure: req.secure,
  });

  res.body = {
    apiLoadStatus: "[TBD]",
    dbConnectionStatus: dbStatus,
  };
  res.statusCode = StatusCodes.OK;
  next();
}

export const healthController = { get };
