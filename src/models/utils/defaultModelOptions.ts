import { DestroyOptions, Model } from "sequelize";

export const defaultModelOptions = {
  paranoid: true,
  updatedAt: "lastUpdatedAt",
  hooks: {
    beforeDestroy: async (instance: Model): Promise<void> => {
      await instance.update({ isDeleted: true });
    },
    beforeBulkDestroy: async (options: DestroyOptions<unknown>): Promise<void> => {
      // eslint-disable-next-line no-param-reassign
      options.individualHooks = true;
    },
  },
};
