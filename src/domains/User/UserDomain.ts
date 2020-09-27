import _ from "lodash";

import { ERROR_MESSAGES, ERROR_REASONS } from "@src/constants";

import { is } from "@src/utils/is";

import { UserAuthenticationInterface, UserDomainAttributes, UserDomainJsonAttributes } from "./user-domain.interface";
import { UserDomainAttributesSchema } from "./UserDomainAttributesSchema";
import type { PlainObject } from "../../interfaces";

export class UserDomain {
  public attributes: UserDomainAttributes;
  private schema: UserDomainAttributesSchema;

  constructor() {
    this.schema = new UserDomainAttributesSchema();
    this.attributes = <UserDomainAttributes>this.schema.getDefaults();
  }

  get id(): string {
    return this.attributes.id || "";
  }

  get isEmailVerified(): boolean {
    return this.attributes.isEmailVerified || false;
  }

  public async initNew(data: unknown, encrypt: (string) => Promise<string>): Promise<void> {
    if (!is.function(encrypt)) {
      throw {
        reason: ERROR_REASONS.VALIDATION,
        message: new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
      };
    }

    const attrs = <Partial<UserDomainAttributes & UserAuthenticationInterface>>this.schema.validateNew(data);
    const pwd = attrs.password;
    const encryptedPwd = await encrypt(pwd);

    delete attrs.password;
    attrs.encryptedPassword = encryptedPwd;

    this.attributes = {
      ...this.attributes,
      ...attrs,
      isEmailVerified: true, // TODO: remove ASAP
    };
  }

  public initExisting(data: PlainObject): void {
    // we will have CompanyPositions.* and UserRoles.* here
    // so let's transform it in a proper look
    const transformed = this.transformAssociations(data);

    this.attributes = <UserDomainAttributes>this.schema.validateExisting(transformed);
  }

  private transformAssociations(data: PlainObject): PlainObject {
    const associations = ["CompanyPositions", "UserRole"];
    const associationKeys = ["companyPositions", "userRole"];

    let res = _.transform(
      data,
      (result, value, key) => {
        _.set(result, key, value);
        return result;
      },
      {}
    );

    res = _.mapKeys(res, (value, key) => {
      const idx = associations.indexOf(key);
      if (idx >= 0) return associationKeys[idx];
      return key;
    });

    return res;
  }

  public toJSON(): UserDomainJsonAttributes {
    const res = _.omit(this.attributes, ["encryptedPassword"]);
    return <UserDomainJsonAttributes>res;
  }

  public update(data: UserDomainAttributes): void {
    const values = <UserDomainAttributes>this.schema.validateExisting(data);

    this.attributes = {
      ...this.attributes,
      ...values,
    };
  }

  public async updatePassword(password: string, encrypt: (string) => Promise<string>): Promise<void> {
    if (!is.function(encrypt)) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR),
      };
    }

    this.attributes.encryptedPassword = await encrypt(password);
  }

  public confirmEmailVerified(): void {
    this.attributes.isEmailVerified = true;
  }

  public async validatePassword(payload: string, encrypt: (string) => Promise<string>): Promise<void> {
    const encryptedPwd = await encrypt(payload);

    if (encryptedPwd !== this.attributes.encryptedPassword) {
      throw {
        reason: ERROR_REASONS.WRONG_PASSWORD,
        message: ERROR_MESSAGES.WRONG_PASSWORD,
      };
    }
  }
}
