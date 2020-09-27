import joi, { ObjectSchema } from "@hapi/joi";

import { ERROR_REASONS } from "@src/constants";
import { defaultSchemas } from "@src/domains/utils";
import { defaultModelFieldsValues } from "@src/models/utils";
import { UserDomainAttributes } from "./user-domain.interface";

export class UserDomainAttributesSchema {
  private readonly baseSchema: ObjectSchema;
  private readonly schemaForNew: ObjectSchema;
  private readonly schemaForExisting: ObjectSchema;

  constructor() {
    this.baseSchema = joi.object({
      email: joi.string().email().required(),
      firstName: joi.string().min(2).max(200).required(),
      lastName: joi.string().min(2).max(200).required(),
    });

    this.schemaForNew = this.baseSchema
      .append({
        password: joi.string().min(3).max(30).required(),
      })
      .options({
        stripUnknown: true,
      });

    this.schemaForExisting = this.baseSchema
      .append({
        id: defaultSchemas.id.required(),

        encryptedPassword: joi.string().min(3).max(200).required(),
        isEmailVerified: joi.bool().required(),
        companyPositions: joi.array(),
        userRole: joi.object().allow(null),

        createdAt: defaultSchemas.createdAt,
        createdBy: defaultSchemas.createdBy,
        deletedAt: defaultSchemas.deletedAt,
        isDeleted: defaultSchemas.isDeleted,
        lastUpdatedAt: defaultSchemas.lastUpdatedAt,
        lastUpdatedBy: defaultSchemas.lastUpdatedBy,
      })
      .options({
        stripUnknown: true,
      });

    this.validateNew = this.validateNew.bind(this);
    this.validateExisting = this.validateExisting.bind(this);
  }

  public validateNew(data: unknown): unknown {
    const { value, error } = this.schemaForNew.validate(data);

    if (error) {
      throw {
        reason: ERROR_REASONS.VALIDATION,
        message: error,
      };
    }

    return value;
  }

  public validateExisting(data: unknown): UserDomainAttributes {
    const { value, error } = this.schemaForExisting.validate(data);

    if (error) {
      throw {
        reason: ERROR_REASONS.VALIDATION,
        message: error,
      };
    }

    return value;
  }

  public getDefaults(): UserDomainAttributes {
    return {
      email: "",
      firstName: "",
      lastName: "",
      isEmailVerified: false,
      encryptedPassword: "",
      ...defaultModelFieldsValues,
    };
  }
}
