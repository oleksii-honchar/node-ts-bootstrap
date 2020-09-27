import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

import { getLogger } from "../logger";

const logger = getLogger("request");

const MAX_BODY_SIZE = 400;

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const headerName = "x-request-id";
  const id = req.headers[headerName] || uuid();

  req.logger = logger.child({
    id,
    type: "request",
  });

  res.setHeader(headerName, id);
  req.logger.info({ req }, "start request");

  res.on("finish", () => {
    const body = JSON.stringify(res.body) || res.statusMessage;
    const bodySize = body.length;

    if (bodySize > MAX_BODY_SIZE) {
      res.body = `${body.substring(0, MAX_BODY_SIZE)}\n<content trimmed to [${MAX_BODY_SIZE}] from [${bodySize}]>\n`;
    }

    req.logger.info({ res }, "end request");
  });

  next();
}
