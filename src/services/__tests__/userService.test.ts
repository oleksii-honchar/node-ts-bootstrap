import { get as _get } from "lodash";

import { userService } from "@src/services";
import { getFakeUser } from "../seeds";

import { dbService } from "../dbService";

describe("[INTEGRATION] userService", () => {
  beforeAll(async () => {
    await dbService.connect();
    await dbService.initAllModels();
  });

  beforeEach(async () => {
    await dbService.sequelize.query("drop table if exists Users, UserRoles cascade");
    await dbService.sequelize.sync({ force: true });
  });

  test("register not existing user with proper payload", async () => {
    const newUser = getFakeUser(100);

    const userAttributes = await userService.registerUser(newUser);

    expect(_get(userAttributes, "id")).toBeDefined();
    expect(_get(userAttributes, "email")).toEqual(newUser.email);
    expect(_get(userAttributes, "firstName")).toEqual(newUser.firstName);
    expect(_get(userAttributes, "lastName")).toEqual(newUser.lastName);
  });

  test("delete single user by id", async () => {
    const firstUser = getFakeUser(0);
    const userAttrs = await userService.registerUser(firstUser);

    expect(await userService.count()).toBe(1);

    const count = await userService.deleteUserById(userAttrs.id);
    expect(await userService.count()).toBe(0);
    expect(count).toBe(1);
  });

  test("delete multiple users by ids", async () => {
    const firstUser = getFakeUser(0);
    const firstUserAttrs = await userService.registerUser(firstUser);
    const secondUser = getFakeUser(1);
    const secondUserAttrs = await userService.registerUser(secondUser);

    expect(await userService.count()).toBe(2);

    const count = await userService.deleteUsersByIds([firstUserAttrs.id, secondUserAttrs.id]);
    expect(await userService.count()).toBe(0);
    expect(count).toBe(2);
  });
});
