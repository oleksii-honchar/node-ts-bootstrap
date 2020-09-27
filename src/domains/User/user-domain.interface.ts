import { keys as _keys, pick as _pick } from "lodash";

export interface UserDomainAttributes {
  id?: string;
  email: string;
  encryptedPassword: string;
  firstName: string;
  lastName: string;
  isEmailVerified?: boolean;
}

export interface UserDomainJsonAttributes extends Partial<UserDomainAttributes> {
  id: string;
  encryptedPassword?: string;
}

export function isUserDomainAttributes(payload: UserDomainAttributes | unknown): payload is UserDomainAttributes {
  const trimmed = _pick(payload as UserDomainAttributes, [
    "email",
    "firstName",
    "lastName",
    "encryptedPassword",
    "isEmailVerified",
  ]);
  const keys = _keys(trimmed);
  return keys.length === 5;
}

export interface UserAuthenticationInterface {
  email: string;
  password: string;
}
