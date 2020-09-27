import joi from "@hapi/joi";

export const defaultSchemas = {
  createdAt: joi.date(),
  createdBy: joi.string().uuid().allow(null),
  deletedAt: joi.date().allow(null),
  id: joi.string().uuid(),
  shortId: joi.string().min(6).length(6),
  isDeleted: joi.bool(),
  lastUpdatedAt: joi.date(),
  lastUpdatedBy: joi.string().uuid().allow(null),
};
