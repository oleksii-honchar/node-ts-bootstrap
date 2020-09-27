import { Response } from "express";

import { is } from "@src/utils/is";

/*
Check if res has data to be sent by finalResponder
 */
export function isResponsePrepared(res: Response): boolean {
  return is.truthy(res.response) || is.truthy(res.body) || is.truthy(res.template);
}
