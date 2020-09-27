import http from "http";
import tooBusy from "toobusy-js";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { PlainObject } from "@src/interfaces";
import { logEnvVariable } from "./utils/logEnvVariable";

import { getLogger } from "./utils/logger";

import { mainRouter } from "./mainRouter";
import { dbService } from "./services";
import { errorResponder, finalResponder } from "./utils/responders";
import { noCacheMiddleware, tooBusyMiddleware, requestLoggerMiddleware } from "./utils/middlewares";

import pkg from "../package.json";

const logger = getLogger("SVC-DASHBOARD", { ignoreLogLevel: true });

export async function start(envVars?: PlainObject): Promise<void> {
  // in ENV_NAME=test when jest run globalSetup it bring test.env & project.env and pass to start
  // in order to not to put it manually
  if (envVars) {
    Object.keys(envVars).forEach((key) => {
      process.env[key] = envVars[key];
    });
  }

  process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";
  const port = process.env.SVC_PORT || 4000;

  logEnvVariable("ENV_NAME", logger);
  logEnvVariable("LOG_LEVEL", logger);
  logEnvVariable("NODE_ENV", logger);
  logEnvVariable("SEED_MODE", logger);
  logger.info("----------------------------------");
  logEnvVariable("SVC_PORT", logger);
  logEnvVariable("SVC_MOUNT_POINT", logger);
  logger.info("----------------------------------");
  logEnvVariable("SVC_RATE_LIMIT_WINDOW_MINUTES", logger);
  logEnvVariable("SVC_RATE_LIMIT_MAX_REQUESTS", logger);
  logEnvVariable("JWT_TTL_SECONDS", logger);
  logger.info("----------------------------------");
  logEnvVariable("SVC_POSTGRES_DB", logger);
  logEnvVariable("SVC_POSTGRES_HOST", logger);
  logger.info(`[SVC_POSTGRES_PASSWORD = ${process.env.SVC_POSTGRES_PASSWORD ? "OK" : "MISSING!"}]`);
  logEnvVariable("SVC_POSTGRES_PORT", logger);
  logEnvVariable("SVC_POSTGRES_USER", logger);
  logEnvVariable("SVC_SECRET_KEY", logger);
  logger.info("----------------------------------");
  logEnvVariable("SVC_MAILER_HOST", logger);
  logEnvVariable("SVC_MAILER_PORT", logger);
  logEnvVariable("SVC_MAILER_ACCOUNT_USER", logger);
  logEnvVariable("SVC_MAILER_ACCOUNT_PASSWORD", logger);
  logEnvVariable("SVC_MAILER_FROM_ADDRESS", logger);
  logger.info("----------------------------------");
  logger.info(`Starting app [${pkg.name}] ...`);

  const app = express();

  app.set("port", port);
  app.set("x-powered-by", false);
  app.set("query parser", "extended");
  app.set("trust proxy", 1); // https://expressjs.com/en/guide/behind-proxies.html

  app.use(tooBusyMiddleware);
  app.use(cookieParser());
  app.use(requestLoggerMiddleware);
  app.use(bodyParser.json({ limit: "25mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(noCacheMiddleware);

  app.use(mainRouter);

  errorResponder.use(app);
  app.use(finalResponder.router);

  const server = http.createServer(app);

  try {
    await dbService.connect();
    await dbService.initAllModels();
  } catch ({ message }) {
    logger.error(message);
  }

  if (process.env.SEED_MODE === "true") {
    const { seedService } = await import(/* webpackChunkName: "seed-service" */ "./services/seedService");
    await seedService.seedAll();
  }

  server.listen(port);
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    switch (error.code) {
      case "EACCES":
        logger.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        logger.error(`Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? `pipe ${address}` : `port ${address?.port}`;
    logger.info(`Listening on ${bind}`);
  });

  server.on("close", () => {
    logger.info("Server stopped");
  });

  process.on("SIGINT", () => {
    tooBusy.shutdown();
    process.exit();
  });

  process.on("unhandledRejection", (reason, p) => {
    logger.warn("Unhandled Rejection at: Promise", p, "reason:", reason);
  });
}

export async function stop(): Promise<void> {
  logger.info("stop() gracefully stopping app.");

  tooBusy.shutdown();

  logger.info("stop() too busy service stopped.");
  logger.info("stop() Bye-bye 8)");

  process.exit();
}

// do not start in ENV_NAME== test. Jest will start it after globalSetup
if (process.env.ENV_NAME !== "test") {
  setTimeout(start, 3000);
}
