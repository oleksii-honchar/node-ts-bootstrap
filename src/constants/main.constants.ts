import path from "path";

import { getLogger } from "@src/utils/logger";

const logger = getLogger("main-constants");

export const STATIC_ASSETS_PATH = path.join(process.cwd(), "/src/assets");

logger.debug(`STATIC_ASSETS_PATH = ${STATIC_ASSETS_PATH}`);
