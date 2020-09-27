export class ApiError extends Error {
  public error: unknown;

  public code: number;

  constructor(public message: string, code: number, error: unknown) {
    super();

    this.error = error;
    this.code = code;
  }
}
