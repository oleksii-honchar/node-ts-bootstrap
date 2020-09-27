import faker from "faker";

import { PlainObject } from "@src/interfaces";

export function getFakeUser(idx: number): PlainObject {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `boot-${idx}@harakirimail.com`,
    password: `qwerty123`,
  };
}

function generateFakeUsers(): Array<PlainObject> {
  let users = new Array(10).fill(0);
  users = users.map((val, idx) => getFakeUser(idx));

  return users;
}

export const userSeeds = [...generateFakeUsers()];
