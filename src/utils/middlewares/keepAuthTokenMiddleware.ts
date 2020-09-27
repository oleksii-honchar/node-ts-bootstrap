import { NextFunction, Request, Response } from "express";
import { JwtTypes } from "@src/interfaces";
import { jwtService } from "@src/services";
import { getLogger } from "../logger";

const logger = getLogger("keepAuthTokenMiddleware");

export async function keepAuthTokenMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  logger.debug("get auth token");
  const encryptedJwt = req.cookies["auth-token"];

  if (!encryptedJwt) {
    // nothing to do with
    logger.debug("no token found. continue");
    return next();
  }

  try {
    await jwtService.verify(encryptedJwt, JwtTypes.Authentication);
  } catch (err) {
    // we shouldn't do anything - token just wrong - will not replicate it to response
    logger.debug("token not valid. continue");
    return next();
  }

  // here we gonna renew token TTL. If no request appear before end of TTL - it will naturally expire
  // it is kinda of seamless token-renew strategy
  // in later middlewares token can be removed, e.g. when signing out
  const jwtTtl = parseInt(process.env.JWT_TTL_SECONDS as string, 10);

  res.cookie("auth-token", encryptedJwt, {
    expires: new Date(Date.now() + jwtTtl * 1000),
    httpOnly: true,
  });

  logger.debug("token replicated for response. continue");

  req["authToken"] = encryptedJwt;
  return next();
}
