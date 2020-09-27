import { StatusCodes } from "http-status-codes";

export class ValidationError extends Error {
  constructor(public message: string, public errors?: unknown, public code = StatusCodes.BAD_REQUEST) {
    super(message);
  }
}
