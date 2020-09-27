import { Router, Request, Response } from "express";

import { is } from "@src/utils/is";
import { StatusCodes } from "http-status-codes";

const router = Router();

function sendResponse(req: Request, res: Response) {
  if (res.template) {
    return res.render(res.template, res.opts);
  }

  const { response, body } = res;

  if (!response && !body) {
    res.statusCode = StatusCodes.NOT_FOUND;
    return res.json(`${req.url} not found`);
  }

  if (req.accepts("json") !== "json" || is.string(body)) {
    return res.send(response || body);
  }

  return res.json(response || body);
}

router.use((req, res) => {
  sendResponse(req, res);
});

export const finalResponder = { router };
