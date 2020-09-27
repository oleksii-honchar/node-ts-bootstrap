import { UserDomainAttributes } from "@src/domains/User";

export enum JwtTypes {
  Authentication = "Authentication",
  EmailVerification = "Email verification",
  ResetPassword = "Reset password",
}

export interface JwtUserData extends Partial<UserDomainAttributes> {
  id: string;
}

export interface JwtAttributes {
  type: JwtTypes;
  userData: JwtUserData;
}
