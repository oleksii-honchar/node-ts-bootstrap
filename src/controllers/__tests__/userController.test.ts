import { get as _get } from "lodash";
import { Response, Request } from "express";
import faker from "faker";

import { RequestBody, FullRequest, RequestParams } from "@src/interfaces";
import { dbService, userService } from "@src/services";
import { getFakeUser } from "@src/services/seeds";
import { userController } from "../userController";

describe("[INTEGRATION] userController", () => {
  beforeAll(async () => {
    await dbService.connect();
    await dbService.initAllModels();
  });

  beforeEach(async () => {
    await dbService.sequelize.query("drop table if exists Users, UserRoles cascade");
    await dbService.sequelize.sync({ force: true });
  });

  test.skip("register not existing user", () => {
    const req = <Request>{
      body: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const res = <Response>{};
    const nextSpy = jest.fn();

    userController.register(req, res, nextSpy);

    const statusCode = _get(res, "statusCode");

    expect(statusCode).toBe(200);
    // expect(body.version).toBe(`${mockPackage.name}:${mockPackage.version}`);
    expect(nextSpy.mock.calls.length).toBe(1);
  });

  test.skip("register with missed email", () => {
    const req = <FullRequest<RequestBody>>{};
    const res = <Response>{};
    const nextSpy = jest.fn();

    userController.register(req, res, nextSpy);

    const statusCode = _get(res, "statusCode");

    expect(statusCode).toBe(200);
    // expect(body.version).toBe(`${mockPackage.name}:${mockPackage.version}`);
    expect(nextSpy.mock.calls.length).toBe(1);
  });

  test("delete user should return 204 when deleted", async () => {
    const newUser = getFakeUser(100);
    const userAttributes = await userService.registerUser(newUser);

    const nextSpy = jest.fn();

    const req = <RequestParams>{
      params: {
        userId: userAttributes.id,
      },
    };
    const res = <Response>{};

    await userController.deleteUser(<FullRequest<RequestParams>>(<unknown>req), res, nextSpy);
    const { statusCode } = res;

    expect(statusCode).toBe(204);
  });

  test("delete user should return 404 when user doesn't exist", async () => {
    const nextSpy = jest.fn();

    const req = <RequestParams>{
      params: {
        userId: faker.random.uuid(),
      },
    };
    const res = <Response>{};

    await userController.deleteUser(<FullRequest<RequestParams>>(<unknown>req), res, nextSpy);
    const { statusCode } = res;

    expect(statusCode).toBe(404);
  });

  test("delete multiple users should return 204 when at least one user deleted", async () => {
    const userAttributes = await userService.registerUser(getFakeUser(100));

    const nextSpy = jest.fn();

    const req = {
      body: [userAttributes.id, faker.random.uuid(), faker.random.uuid()],
    };
    const res = <Response>{};

    await userController.deleteUsers(<FullRequest<RequestParams>>(<unknown>req), res, nextSpy);
    const { statusCode } = res;

    expect(statusCode).toBe(204);
  });

  test("delete multiple users should return 404 when none is deleted", async () => {
    const nextSpy = jest.fn();

    const req = <Request>{
      body: [faker.random.uuid(), faker.random.uuid(), faker.random.uuid()],
    };
    const res = <Response>{};

    await userController.deleteUsers(<FullRequest<RequestParams>>(<unknown>req), res, nextSpy);
    const { statusCode } = res;

    expect(statusCode).toBe(404);
  });
});
