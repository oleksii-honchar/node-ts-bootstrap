import Bunyan from "bunyan";

export function logEnvVariable(varName: string, logger: Bunyan): void {
  logger.info(`[${varName} = ${process.env[varName]}]`);
}
