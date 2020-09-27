import joi from "@hapi/joi";
import { Request } from "express";

import { getLogger, Logger } from "@src/utils/logger";

import { defaultSchemas } from "@src/domains/utils";
import { is } from "@src/utils/is";

import { ERROR_MESSAGES, ERROR_REASONS } from "@src/constants";
import {
  AuthenticateResult,
  isUserDomainAttributes,
  JwtAttributes,
  JwtTypes,
  JwtUserData,
  RequestBody,
  RequestBodyWithAuth,
  RequestBodyWithEmail,
  RequestBodyWithToken,
  RequestBodyWithTokenAndPassword,
  RequestWithToken,
  UserDomainJsonAttributes,
} from "@src/interfaces";

import { UserDomain, UserDomainAttributes } from "@src/domains/User";

import { userRepository } from "@src/repositories";

import { mailerService } from "@src/services/mailerService";
import { cipherService } from "@src/services/cipherService";
import { jwtService } from "@src/services/jwtService";

export class UserService {
  private logger: Logger = getLogger("UserService");

  public async authenticate(body: RequestBodyWithAuth): Promise<AuthenticateResult> {
    const logHeader = "authenticate()";

    this.logger.info(logHeader, "initial validation");

    const { email, password } = body;
    const { error } = joi.string().email().validate(email);

    if (error) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: error,
      };
    }

    this.logger.info(logHeader, "find user...");
    const userDomain = <UserDomain>await this.readUserByEmail(email, { instance: true });
    UserService.throwNotFoundIfNotExists(userDomain);

    this.logger.info(logHeader, "validate provided and existing pwd");
    await userDomain.validatePassword(password, cipherService.generateHash);

    if (!userDomain.isEmailVerified) {
      throw {
        reason: ERROR_REASONS.EMAIL_NOT_VERIFIED,
        message: ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
      };
    }

    this.logger.info(logHeader, "generate auth token...");
    const authJwt = jwtService.generate({
      type: JwtTypes.Authentication,
      userData: <JwtUserData>userDomain.toJSON(),
    });

    this.logger.debug("authenticate()", { authJwt });

    return { authToken: authJwt, userAttributes: userDomain.toJSON() };
  }

  public async count(): Promise<number> {
    return userRepository.count();
  }

  public static throwNotFoundIfNotExists(user?: UserDomainJsonAttributes | UserDomainAttributes | UserDomain | null): void {
    if (!user) {
      throw {
        reason: ERROR_REASONS.NOT_FOUND,
        message: ERROR_MESSAGES.ENTITY_DOES_NOT_EXIST,
      };
    }
  }

  public static throwAlreadyExistsIfExists(
    user: UserDomainJsonAttributes | UserDomainAttributes | UserDomain | null
  ): void {
    if (user) {
      throw {
        reason: ERROR_REASONS.ALREADY_EXISTS,
        message: ERROR_MESSAGES.ALREADY_EXISTS,
      };
    }
  }

  public async confirmEmailVerification(body: RequestBodyWithToken): Promise<void> {
    const { token } = body;

    if (is.empty(token)) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: ERROR_MESSAGES.TOKEN_MISSED,
      };
    }

    let decryptedJwt: JwtAttributes;
    try {
      decryptedJwt = jwtService.verify(token, JwtTypes.EmailVerification);
    } catch (e) {
      throw {
        reason: ERROR_REASONS.EMAIL_VERIFICATION_FAILED,
        message: e.message,
      };
    }

    this.logger.debug({ decryptedJwt });

    const id = <string>(decryptedJwt.userData as UserDomainAttributes).id;
    const userAttributes = await this.readUserById(id, { raw: true });
    UserService.throwNotFoundIfNotExists(userAttributes);

    const userDomain = new UserDomain();
    userDomain.initExisting(userAttributes as UserDomainAttributes);

    if (userDomain.isEmailVerified) {
      const msg = ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED;
      this.logger.error(msg);
      throw {
        reason: ERROR_REASONS.EMAIL_VERIFICATION_FAILED,
        message: msg,
      };
    }

    userDomain.confirmEmailVerified();

    try {
      await userRepository.updateUserById(userDomain.id, userDomain.attributes);
    } catch (err) {
      this.logger.error(err.errors);
      throw {
        reason: ERROR_REASONS.ATTRIBUTE_IS_NOT_UNIQUE,
        message: err.errors,
      };
    }
  }

  public async validateResetPasswordToken(body: RequestBodyWithToken): Promise<JwtAttributes> {
    const { token } = body;

    if (is.empty(token)) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: ERROR_MESSAGES.TOKEN_MISSED,
      };
    }

    let decryptedJwt: JwtAttributes;
    try {
      decryptedJwt = jwtService.verify(token, JwtTypes.ResetPassword);
    } catch (e) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: e.message,
      };
    }

    this.logger.debug({ decryptedJwt });
    return decryptedJwt;
  }

  public async validateAuthToken(req: Request): Promise<UserDomainJsonAttributes> {
    let token = ((req.body as unknown) as RequestBodyWithToken).token || ((req as unknown) as RequestWithToken).authToken;

    if (is.empty(token)) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: ERROR_MESSAGES.TOKEN_MISSED,
      };
    }

    token = decodeURIComponent(token); // in case of body param it come encoded

    let decryptedJwt: JwtAttributes;
    try {
      decryptedJwt = jwtService.verify(token, JwtTypes.Authentication);
    } catch (e) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: e.message,
      };
    }

    this.logger.debug({ decryptedJwt });
    return decryptedJwt.userData;
  }

  public async registerUser(attributes: RequestBody): Promise<UserDomainJsonAttributes> {
    const logHeader = "registerUser()";

    this.logger.debug(logHeader, "start");

    const email = (attributes as UserDomainAttributes)?.email ?? null;

    if (!email) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: ERROR_MESSAGES.EMAIL_NOT_PROVIDED,
      };
    }

    this.logger.debug(logHeader, "check if already exists by email...");
    const userAttributes = await userRepository.getByEmail(email);
    UserService.throwAlreadyExistsIfExists(userAttributes);

    const newUserDomain = new UserDomain();
    await newUserDomain.initNew(attributes, cipherService.generateHash);
    const newUserData = await userRepository.createUser(newUserDomain.attributes);
    newUserDomain.update(newUserData);

    this.logger.debug(logHeader, "new user created");

    // TODO: remove when email verification page will be ready
    // await this.sendEmailConfirmationRequest(newUserDomain.attributes);

    // const userCount = await userRepository.count();

    this.logger.debug(logHeader, "finish");
    return newUserDomain.toJSON();
  }

  public async sendEmailConfirmationRequest(payload: UserDomainAttributes | RequestBodyWithEmail): Promise<void> {
    let attributes: UserDomainAttributes;

    if (isUserDomainAttributes(payload)) {
      attributes = payload;
    } else {
      attributes = <UserDomainAttributes>await this.readUserByEmail(payload.email);
    }

    const emailJwt = jwtService.generate({
      type: JwtTypes.EmailVerification,
      userData: <JwtUserData>attributes,
    });

    await mailerService.sendVerificationEmail(attributes, emailJwt);
  }

  public async sendResetPasswordRequest(payload: RequestBodyWithEmail): Promise<void> {
    const attributes = <UserDomainAttributes>await this.readUserByEmail(payload.email);

    const emailJwt = jwtService.generate({
      type: JwtTypes.ResetPassword,
      userData: <JwtUserData>attributes,
    });

    await mailerService.sendResetPasswordEmail(attributes, emailJwt);
  }

  public async readUserById(
    id: string,
    options: { raw?: boolean; instance?: boolean } = {
      raw: false,
      instance: false,
    }
  ): Promise<UserDomain | UserDomainAttributes | UserDomainJsonAttributes | null> {
    const { error } = defaultSchemas.id.validate(id);

    if (error) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: error,
      };
    }

    const userAttributes = await userRepository.getById(id);
    if (!userAttributes) {
      return userAttributes;
    }

    const userDomain = new UserDomain();
    userDomain.initExisting(userAttributes);

    if (options.instance) return userDomain;
    return options.raw ? userDomain.attributes : userDomain.toJSON();
  }

  public async deleteUserById(id: string): Promise<number | null> {
    const { error } = defaultSchemas.id.validate(id);

    if (error) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: error,
      };
    }

    const count = await userRepository.deleteById(id);
    return count;
  }

  public async deleteUsersByIds(ids: Array<string>): Promise<number | null> {
    const { error } = joi.array().items(defaultSchemas.id).validate(ids);

    if (error) {
      throw {
        reason: ERROR_REASONS.VALIDATION_NOT_PASSED,
        message: error,
      };
    }

    const count = await userRepository.deleteByIds(ids);
    return count;
  }

  public async readUserByEmail(
    email: string,
    options: { instance?: boolean } = { instance: false }
  ): Promise<UserDomainAttributes | UserDomain | null> {
    const logHeader = "getUserByEmail()";

    this.logger.info(logHeader, `looking for user by email: ${email}`);
    const userAttributes = await userRepository.getByEmail(email);
    if (!userAttributes) {
      return userAttributes;
    }

    this.logger.info(logHeader, "create userDomain using obtained data...");
    const userDomain = new UserDomain();
    userDomain.initExisting(userAttributes);

    return options.instance ? userDomain : userDomain.attributes;
  }

  public async listAllUsers(): Promise<Array<UserDomainAttributes>> {
    const usersAttributes = await userRepository.listAllUsers();

    const payload = <UserDomainAttributes[]>usersAttributes.map((userAttributes: UserDomainAttributes) => {
      const userDomain = new UserDomain();
      userDomain.initExisting(userAttributes);

      return userDomain.toJSON();
    });

    return payload;
  }

  public async resetPassword(payload: RequestBodyWithTokenAndPassword): Promise<void> {
    const jwt = await this.validateResetPasswordToken(payload);

    const userDomain = <UserDomain>await this.readUserById(jwt.userData.id, { instance: true });
    UserService.throwNotFoundIfNotExists(userDomain);

    await userDomain.updatePassword(payload.password, cipherService.generateHash);
    await userRepository.updateUserById(userDomain.id, userDomain.attributes);

    await mailerService.sendResetPasswordNotificationEmail(userDomain.toJSON());
  }
}

export const userService = new UserService();
