import { DataTypes, Model, ModelCtor, Sequelize } from "sequelize";

import { DefaultModelAttributes, UserDomainAttributes } from "../interfaces";

import { defaultModelFields, defaultModelId, defaultModelOptions } from "./utils";

export interface UserModelAttributes extends Partial<DefaultModelAttributes>, UserDomainAttributes {}

export type UserInstance = Model<UserModelAttributes>;

class UserModel {
  public model!: ModelCtor<UserInstance>;
  public initModel({ sequelize }: { sequelize: Sequelize }): ModelCtor<UserInstance> {
    const userModel = sequelize.define<UserInstance>(
      "User",
      {
        id: defaultModelId,
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        encryptedPassword: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isEmailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        ...defaultModelFields,
      },
      {
        ...defaultModelOptions,
        indexes: [
          {
            unique: true,
            fields: ["email"],
          },
        ],
      }
    );
    this.model = userModel;
    return userModel;
  }
}

export const userModel = new UserModel();
