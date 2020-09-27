import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  constructor(public message: string, public code = StatusCodes.NOT_FOUND) {
    super(message);
  }
}
