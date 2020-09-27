import http from "http";
import { UserDomainJsonAttributes } from "@src/domains/User";

export interface DefaultModelAttributes {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  deletedAt: string;
  isDeleted: boolean;
}

export interface CustomModelAttributes {
  createdBy: string;
  lastUpdatedBy: string;
  deletedBy: string;
}

export interface NewModelAttributes extends Partial<DefaultModelAttributes>, CustomModelAttributes {}

export interface GenericError extends Error {
  code?: number;
}

export interface Domain {
  toJSON(): Record<string, unknown>;
}

export interface RequestBody {
  token?: string;
}

export interface RequestBodyWithToken extends RequestBody {
  token: string;
}

export interface RequestWithToken extends Express.Request {
  authToken: string;
}

export interface RequestBodyWithTokenAndPassword extends RequestBody {
  token: string;
  password: string;
}

export interface RequestBodyWithEmail extends RequestBody {
  email: string;
}

export interface RequestBodyWithAuth extends RequestBody {
  email: string;
  password: string;
}

export interface RequestQueryParams {
  userId?: string;
  userEmail?: string;
}

export interface RequestParams {
  params: RequestQueryParams;
}

export interface FullRequest<T> extends http.IncomingMessage, Express.Request {
  body: T;
}

export interface AuthenticateResult {
  authToken: string;
  userAttributes: UserDomainJsonAttributes;
}
