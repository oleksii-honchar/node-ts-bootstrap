import { Response, NextFunction, Request } from "express";
import { StatusCodes } from "http-status-codes";

import {
  AuthenticateResult,
  FullRequest,
  RequestBody,
  RequestBodyWithToken,
  RequestBodyWithEmail,
  RequestBodyWithTokenAndPassword,
  RequestBodyWithAuth,
  RequestParams,
  UserDomainJsonAttributes,
  UserDomainAttributes,
} from "@src/interfaces";

import { getLogger } from "@src/utils/logger";
import { ERROR_REASONS } from "@src/constants";

import { userService } from "@src/services";

const logger = getLogger("controllers/user");

async function register(req: FullRequest<RequestBody>, res: Response, next: NextFunction): Promise<void> {
  let data;
  try {
    data = await userService.registerUser(req.body);
  } catch (e) {
    logger.error("register()", e);

    switch (e.reason) {
      case ERROR_REASONS.VALIDATION:
        e.code = StatusCodes.UNPROCESSABLE_ENTITY;
        break;
      case ERROR_REASONS.ALREADY_EXISTS:
        e.code = StatusCodes.CONFLICT;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = data;
  res.statusCode = StatusCodes.CREATED;
  return next();
}

async function readUser(req: FullRequest<RequestParams>, res: Response, next: NextFunction): Promise<void> {
  let userAttributes;
  try {
    userAttributes = <UserDomainJsonAttributes>(
      await userService.readUserById(((req as unknown) as RequestParams).params.userId as string)
    );
  } catch (e) {
    logger.error("readUser()", e);

    switch (e.reason) {
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  if (userAttributes) {
    res.body = userAttributes;
    res.statusCode = StatusCodes.OK;
  } else {
    res.statusCode = StatusCodes.NOT_FOUND;
  }

  return next();
}

async function readUserByEmail(req: FullRequest<RequestParams>, res: Response, next: NextFunction): Promise<void> {
  let userAttributes;
  try {
    userAttributes = <UserDomainJsonAttributes>(
      await userService.readUserByEmail(((req as unknown) as RequestParams).params.userEmail as string)
    );
  } catch (e) {
    logger.error("readUserByEmail()", e);

    switch (e.reason) {
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  if (userAttributes) {
    res.body = userAttributes;
    res.statusCode = StatusCodes.OK;
  } else {
    res.statusCode = StatusCodes.NOT_FOUND;
  }

  return next();
}

async function deleteUser(req: FullRequest<RequestParams>, res: Response, next: NextFunction): Promise<void> {
  let deletedUsersCount: number | null = 0;

  try {
    deletedUsersCount = await userService.deleteUserById(((req as unknown) as RequestParams).params.userId as string);
  } catch (e) {
    logger.error("deleteUser()", e);

    switch (e.reason) {
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  if (deletedUsersCount === 0) {
    res.body = "User not found";
    res.statusCode = StatusCodes.NOT_FOUND;
  } else {
    res.body = "OK";
    res.statusCode = StatusCodes.NO_CONTENT;
  }

  return next();
}

async function deleteUsers(req: FullRequest<RequestParams>, res: Response, next: NextFunction): Promise<void> {
  let deletedUsersCount: number | null = 0;

  try {
    deletedUsersCount = await userService.deleteUsersByIds((req.body as unknown) as Array<string>);
  } catch (e) {
    logger.error("deleteUser()", e);

    switch (e.reason) {
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  if (deletedUsersCount === 0) {
    res.body = "Users not found";
    res.statusCode = StatusCodes.NOT_FOUND;
  } else {
    res.body = "OK";
    res.statusCode = StatusCodes.NO_CONTENT;
  }

  return next();
}

async function listAllUsers(req: FullRequest<RequestBody>, res: Response, next: NextFunction): Promise<void> {
  let usersAttributesList: Array<UserDomainAttributes>;
  try {
    usersAttributesList = await userService.listAllUsers();
  } catch (e) {
    logger.error("listAllUsers()", e);

    switch (e.reason) {
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  if (!usersAttributesList) {
    res.statusCode = StatusCodes.NOT_FOUND;
    return next();
  }

  res.body = usersAttributesList;
  res.statusCode = StatusCodes.OK;
  return next();
}

async function sendEmailConfirmationRequest(
  req: FullRequest<RequestBodyWithEmail>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.sendEmailConfirmationRequest(req.body);
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.NOT_FOUND:
        e.code = StatusCodes.NOT_FOUND;
        break;
      case ERROR_REASONS.EMAIL_ALREADY_VERIFIED:
        e.code = StatusCodes.CONFLICT;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = "OK";
  res.statusCode = StatusCodes.OK;
  return next();
}

async function verifyEmail(req: FullRequest<RequestBodyWithToken>, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.confirmEmailVerification(req.body);
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.EMAIL_VERIFICATION_FAILED:
        e.code = StatusCodes.FORBIDDEN;
        break;
      case ERROR_REASONS.EMAIL_ALREADY_VERIFIED:
        e.code = StatusCodes.CONFLICT;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = "OK";
  res.statusCode = StatusCodes.OK;
  return next();
}

async function sendResetPasswordRequest(
  req: FullRequest<RequestBodyWithEmail>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.sendResetPasswordRequest(req.body);
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.NOT_FOUND:
        e.code = StatusCodes.NOT_FOUND;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = "OK";
  res.statusCode = StatusCodes.OK;
  return next();
}

async function validateResetPasswordToken(
  req: FullRequest<RequestBodyWithToken>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.validateResetPasswordToken(req.body);
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.VALIDATION_NOT_PASSED:
        e.code = StatusCodes.FORBIDDEN;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = "OK";
  res.statusCode = StatusCodes.OK;
  return next();
}

async function validateAuthToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  let userAttributes: UserDomainJsonAttributes;
  try {
    userAttributes = await userService.validateAuthToken(req);
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.VALIDATION_NOT_PASSED:
        e.code = StatusCodes.FORBIDDEN;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = userAttributes;
  res.statusCode = StatusCodes.OK;
  return next();
}

async function removeAuthToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.clearCookie("auth-token");
  res.body = "OK";
  res.statusCode = StatusCodes.OK;
  return next();
}

async function resetPassword(
  req: FullRequest<RequestBodyWithTokenAndPassword>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.resetPassword(req.body);
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.VALIDATION_NOT_PASSED:
        e.code = StatusCodes.FORBIDDEN;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  res.body = "OK";
  res.statusCode = StatusCodes.OK;
  return next();
}

async function authenticate(req: FullRequest<RequestBodyWithAuth>, res: Response, next: NextFunction): Promise<void> {
  let authToken: string;
  let userAttributes: UserDomainJsonAttributes;
  try {
    ({ authToken, userAttributes } = <AuthenticateResult>await userService.authenticate(req.body));
  } catch (e) {
    switch (e.reason) {
      case ERROR_REASONS.VALIDATION_NOT_PASSED:
        e.code = StatusCodes.FORBIDDEN;
        break;
      case ERROR_REASONS.WRONG_PASSWORD:
        e.code = StatusCodes.UNAUTHORIZED;
        break;
      case ERROR_REASONS.EMAIL_NOT_VERIFIED:
        e.code = StatusCodes.UNAUTHORIZED;
        break;
      default:
        e.code = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
    return next(e);
  }

  const jwtTtl = parseInt(process.env.JWT_TTL_SECONDS as string, 10);

  res.body = userAttributes;
  res.statusCode = StatusCodes.OK;
  res.cookie("auth-token", authToken, {
    expires: new Date(Date.now() + jwtTtl * 1000),
    httpOnly: true,
  });
  return next();
}

export const userController = {
  authenticate,
  deleteUser,
  deleteUsers,
  listAllUsers,
  readUser,
  readUserByEmail,
  register,
  removeAuthToken,
  resetPassword,
  sendResetPasswordRequest,
  sendEmailConfirmationRequest,
  validateResetPasswordToken,
  validateAuthToken,
  verifyEmail,
};
