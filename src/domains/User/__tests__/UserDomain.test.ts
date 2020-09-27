// import { getFakeUser } from "@src/services/seeds";

// import { has as _has } from "lodash";

import { dbService, userService } from "@src/services";
// import { UserDomain } from "@src/domains";

describe.skip("[INTEGRATION] UserDomain", () => {
  beforeAll(async () => {
    await dbService.connect();
    await dbService.initAllModels();
  });

  beforeEach(async () => {
    await dbService.sequelize.query("drop table if exists Users, UserRoles cascade");
    await dbService.sequelize.sync({ force: true });
  });
});
