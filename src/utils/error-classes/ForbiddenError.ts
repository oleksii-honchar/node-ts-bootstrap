import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends Error {
  constructor(public message: string, public code = StatusCodes.FORBIDDEN) {
    super();
  }
}
