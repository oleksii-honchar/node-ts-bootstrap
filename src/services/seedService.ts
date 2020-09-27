import { userService } from "@src/services";
import { getLogger } from "../utils/logger";

import { UserDomainJsonAttributes } from "../interfaces";

import { getFakeUser } from "./seeds";

import { dbService } from "./dbService";

class SeedService {
  private readonly logger = getLogger("SeedService");
  private users;

  public async seedAll() {
    this.logger.info("seedAll() start");
    await dbService.dropAllTables();
    await dbService.initAllModels();

    try {
      await this.seedUsers();
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.info("seedAll() finish");
  }

  public async seedUsers() {
    this.logger.info(`seedUsers() with UserRoles & CompanyPositions`);

    const users: Array<UserDomainJsonAttributes> = [];

    const admin0 = getFakeUser(0);
    const adminAttributes0 = await userService.registerUser(admin0);
    users.push(adminAttributes0);

    const admin1 = getFakeUser(1);
    const admin1Attributes = await userService.registerUser(admin1);
    users.push(admin1Attributes);

    this.users = users;
    this.logger.info("seedUsers() finish");
  }
}

export const seedService = new SeedService();
