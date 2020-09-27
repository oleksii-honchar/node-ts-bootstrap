import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends Error {
  constructor(public message: string, public code = StatusCodes.UNAUTHORIZED) {
    super();
  }
}
