import { getFakeUser } from "@src/services/seeds";

import { UserDomainAttributesSchema } from "../UserDomainAttributesSchema";

describe("[UNIT] UserDomainAttributesSchema", () => {
  test("create schema instance", () => {
    const schema = new UserDomainAttributesSchema();

    expect(schema).toBeInstanceOf(UserDomainAttributesSchema);
  });

  test("validate new", () => {
    const schema = new UserDomainAttributesSchema();
    const newUser = getFakeUser(100);

    const res = schema.validateNew(newUser);
    expect(res).toEqual(newUser);
  });
});
