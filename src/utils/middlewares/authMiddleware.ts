import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get as _get } from "lodash";

import { JwtAttributes, JwtTypes } from "@src/interfaces";

import { jwtService, userService } from "@src/services";

import { getLogger } from "../logger";

const logger = getLogger("authMiddleware");

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  logger.debug("get auth token");
  const encryptedJwt = req.cookies["auth-token"];

  if (!encryptedJwt) {
    const err = new Error("No auth token provided");
    err["code"] = StatusCodes.UNAUTHORIZED;
    return next(err);
  }

  let decryptedJwt: JwtAttributes;
  try {
    decryptedJwt = await jwtService.verify(encryptedJwt, JwtTypes.Authentication);
  } catch (err) {
    err["code"] = StatusCodes.UNAUTHORIZED;
    return next(err);
  }

  const userId = _get(decryptedJwt, "userData.id");
  logger.debug("looking for user by id: ", userId);
  const userAttributes = await userService.readUserById(userId);

  if (!userAttributes) {
    const err = new Error("Authenticated user not found");
    err["code"] = StatusCodes.NOT_FOUND;
    return next(err);
  }

  if (!userAttributes.isEmailVerified) {
    const err = new Error("Authenticated user is not verified");
    err["code"] = StatusCodes.FORBIDDEN;
    return next(err);
  }

  req["user"] = userAttributes;
  req["authToken"] = encryptedJwt;
  return next();
}
