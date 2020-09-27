import { DataTypes } from "sequelize";

export const defaultModelFields = {
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  lastUpdatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  // createdAt added automatically by sequelize
  // updatedAt added automatically by sequelize
  // deletedAt added automatically by sequelize in paranoid mode
};

export const defaultModelFieldsValues = {
  createdBy: null,
  lastUpdatedBy: null,
  isDeleted: false,
};
