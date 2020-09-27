import { userModel, UserModelAttributes } from "@src/models";
import { UserDomainAttributes } from "@src/interfaces";

class UserRepository {
  public async createUser(userAttributes: UserDomainAttributes): Promise<UserDomainAttributes> {
    const user = await userModel.model.create(userAttributes);
    return user.get({ plain: true });
  }

  public count(): Promise<number> {
    return userModel.model.count();
  }

  public async getByEmail(email: string): Promise<UserDomainAttributes | null> {
    const user = await userModel.model.findOne({
      where: { email },
      raw: false,
    });

    if (!user) return null;

    const record = user.get() as UserModelAttributes;
    return record as UserDomainAttributes;
  }

  public async getById(id: string): Promise<UserDomainAttributes | null> {
    const user = await userModel.model.findOne({
      where: { id },
      raw: false,
    });

    if (!user) return null;

    const record = user.get() as UserModelAttributes;
    return record as UserDomainAttributes;
  }

  public async deleteById(id: string): Promise<number> {
    const count = await userModel.model.destroy({
      where: { id },
      cascade: true,
      force: true, // TODO: remove it asap
    });

    return count;
  }

  public async deleteByIds(ids: Array<string>): Promise<number> {
    const count = await userModel.model.destroy({
      where: { id: ids },
      cascade: true,
      force: true, // TODO: remove it asap
    });

    return count;
  }

  public async listAllUsers(): Promise<Array<UserDomainAttributes>> {
    const allModelsData = await userModel.model.findAll({
      raw: false,
    });

    const records = allModelsData.map((item) => {
      return item.get();
    });

    return records;
  }

  public async updateUserById(id: string, userAttributes: UserDomainAttributes): Promise<UserDomainAttributes> {
    const user = await userModel.model.update(userAttributes, { where: { id }, returning: true });
    return user[1][0].get({ plain: true });
  }
}

export const userRepository = new UserRepository();
