import { DataTypes } from "sequelize";

export const defaultModelId = {
  allowNull: false,
  defaultValue: DataTypes.UUIDV1,
  primaryKey: true,
  type: DataTypes.UUID,
};
