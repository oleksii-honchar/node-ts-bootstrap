import jwt from "jsonwebtoken";

import { JwtAttributes, JwtTypes } from "@src/interfaces";
import { getLogger } from "@src/utils/logger";
import { CipherService, cipherService } from "./cipherService";

class JwtService {
  private logger = getLogger("JwtService");
  public readonly tokenTtl: number;
  private readonly apiSecretKey: string;
  private readonly cipher: CipherService;

  constructor(apiSecretKey: string, tokenTtl: number, cipher: CipherService) {
    this.tokenTtl = tokenTtl;
    this.apiSecretKey = apiSecretKey;
    this.cipher = cipher;
  }

  public generate(jwtAttributes: JwtAttributes) {
    this.logger.debug("generate()", { jwtAttributes });

    const token = jwt.sign(jwtAttributes, this.apiSecretKey, {
      expiresIn: this.tokenTtl,
    });
    this.logger.debug("generate()", "token signed");

    const encryptedToken = this.cipher.encrypt(token);

    this.logger.debug("encryptedToken created");

    return encryptedToken;
  }

  public verify(encryptedJwtToken: string, type: JwtTypes) {
    this.logger.debug("verify()", "encryptedJwtToken: ", encryptedJwtToken);

    const decryptedToken = this.cipher.decrypt(encryptedJwtToken);

    this.logger.debug("token decrypted. Now verify.");

    const decoded = <JwtAttributes>jwt.verify(decryptedToken, this.apiSecretKey);

    this.logger.debug("token verified. Now matching types.");

    if (type !== decoded.type) {
      const msg = `token type not valid. Expected [${type}] got [${decoded.type}]`;
      this.logger.error("verify()", msg);

      throw new Error("JWT types do not match");
    }
    this.logger.debug("token type successfully matched to:", type);

    return decoded;
  }
}

export const jwtService = new JwtService(
  process.env.SVC_SECRET_KEY as string,
  parseInt(process.env.JWT_TTL_SECONDS as string, 10),
  cipherService
);
