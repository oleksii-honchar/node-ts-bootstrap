import crypto, { createCipheriv, createDecipheriv } from "crypto";

import { getLogger } from "@src/utils/logger";

const logger = getLogger("CipherService");

function tryWithCatch(logHeader: string, fn: () => string): string {
  try {
    return fn();
  } catch (e) {
    logger.error(logHeader, e);
  }

  return "";
}

export class CipherService {
  private readonly algorithm = "aes-256-cbc";
  // private algorithm = "aes-256-cbc";
  private readonly iv: string;

  private readonly apiSecretKey: string;

  constructor(apiSecretKey: string) {
    this.apiSecretKey = apiSecretKey;
    this.iv = apiSecretKey.substr(0, 16);

    this.generateHash = this.generateHash.bind(this);
  }

  public async generateHash(payload: string): Promise<string> {
    const hash = crypto.createHash("sha256");
    hash.update(payload);
    return hash.digest("base64");
  }

  public encrypt(payload: string): string {
    return tryWithCatch(".encrypt()", () => {
      logger.debug("encrypt()");
      const cipher = createCipheriv(this.algorithm, this.apiSecretKey, this.iv);
      logger.debug("encrypt()", "cipher created");

      let encrypted = cipher.update(payload, "utf8", "base64");
      encrypted += cipher.final("base64");

      const encoded = encodeURIComponent(encrypted);
      logger.debug("encrypt()", "content encrypted");
      return encoded;
    });
  }

  public decrypt(payload: string): string {
    return tryWithCatch(".decrypt()", () => {
      logger.debug("decrypt()", "decipher created");
      const decipher = createDecipheriv(this.algorithm, this.apiSecretKey, this.iv);

      const decoded = decodeURIComponent(payload);
      const ecnryptedBuffer = Buffer.from(decoded, "base64");
      let decrypted = decipher.update(ecnryptedBuffer, "base64", "utf8");

      logger.debug("decrypt()", "decrypted first chunk");

      decrypted += decipher.final("utf8");
      logger.debug("decrypt()", "decrypted final chunk");

      return decrypted.toString();
    });
  }
}

export const cipherService = new CipherService(process.env.SVC_SECRET_KEY as string);
