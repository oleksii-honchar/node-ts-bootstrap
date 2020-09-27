import { get } from "lodash";
import faker from "faker";
import { Request, Response } from "express";
import pkg from "package.json";
import { versionController } from "../versionController";

jest.mock("package.json", () => ({
  name: faker.random.word(),
  version: `${faker.random.number()}`,
}));

describe("versionController: Adds name and version to response", () => {
  test("respond with actual pkg.name + pkg.version", () => {
    const res = <Response>{};
    const reqData = {};
    const nextSpy = jest.fn();

    versionController.get(<Request>(<unknown>reqData), res, nextSpy);

    const statusCode = get(res, "statusCode");
    const body = get(res, "body");

    expect(statusCode).toBe(200);
    expect(body.version).toBe(`${pkg.name}:${pkg.version}`);
    expect(nextSpy.mock.calls.length).toBe(1);
  });
});
