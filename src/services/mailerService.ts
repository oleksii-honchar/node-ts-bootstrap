import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import hbs from "handlebars";

import { EMAIL_TEMPLATES, EMAIL_SUBJECTS, USER_MANAGEMENT_URLS } from "@src/constants";

import { getLogger } from "@src/utils/logger";
import { EmailOptions, CompiledTemplatesInterface, UserDomainAttributes, UserDomainJsonAttributes } from "@src/interfaces";
import { jwtService } from "./jwtService";

class MailerService {
  private logger = getLogger("services/mailer-service");
  private transporter: nodemailer.Transporter;
  private compiledTemplates: CompiledTemplatesInterface = {};

  constructor() {
    this.transporter = this.setupTransporter();
  }

  private setupTransporter() {
    this.logger.debug("creating mailing transporter");

    const { SVC_MAILER_HOST, SVC_MAILER_PORT, SVC_MAILER_ACCOUNT_USER, SVC_MAILER_ACCOUNT_PASSWORD } = process.env;

    let options = {};
    if ((SVC_MAILER_HOST || "").indexOf("gmail") > 0) {
      this.logger.debug("setup transport to use Gmail SMTP");

      options = {
        service: "gmail",
        host: SVC_MAILER_HOST,
        port: Number(SVC_MAILER_PORT),
        secure: true,
        auth: {
          type: "login",
          user: SVC_MAILER_ACCOUNT_USER,
          pass: SVC_MAILER_ACCOUNT_PASSWORD,
        },
      };
    } else {
      this.logger.debug("setup transport for general SMTP");

      options = {
        host: SVC_MAILER_HOST,
        port: Number(SVC_MAILER_PORT),
        secure: false, // true if port 465
        auth: {
          user: SVC_MAILER_ACCOUNT_USER,
          pass: SVC_MAILER_ACCOUNT_PASSWORD,
        },
      };
    }

    const transporter = nodemailer.createTransport(options);

    return transporter;
  }

  private async getTemplate(templateName: string) {
    if (this.compiledTemplates[templateName]) {
      return this.compiledTemplates[templateName];
    }

    const htmlBuffer = await fs.readFile(path.join(__dirname, `../templates/${templateName}.hbs`));
    const htmlString = htmlBuffer.toString();

    const template = hbs.compile(htmlString);
    this.compiledTemplates[templateName] = template;

    return template;
  }

  private async send(mailOptions: EmailOptions): Promise<void> {
    const mailTemplate = await this.getTemplate(mailOptions.template);
    const html = mailTemplate(mailOptions.data);

    const { SVC_MAILER_FROM_ADDRESS } = process.env;
    const options = {
      from: SVC_MAILER_FROM_ADDRESS,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html,
    };
    this.logger.debug("sending email with next options: ", options);
    return this.transporter.sendMail(options);
  }

  public async sendVerificationEmail(userAttributes: UserDomainAttributes, token: string): Promise<void> {
    return this.send({
      to: userAttributes.email as string,
      subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
      template: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
      data: {
        firstName: userAttributes.firstName,
        lastName: userAttributes.lastName,
        emailVerificationUrl: `${USER_MANAGEMENT_URLS.EMAIL_VERIFICATION}?token=${token}`,
        expireInMinutes: jwtService.tokenTtl / 60,
      },
    });
  }

  public async sendResetPasswordEmail(userAttributes: UserDomainAttributes, token: string): Promise<void> {
    return this.send({
      to: userAttributes.email as string,
      subject: EMAIL_SUBJECTS.RESET_PASSWORD,
      template: EMAIL_TEMPLATES.RESET_PASSWORD,
      data: {
        firstName: userAttributes.firstName,
        lastName: userAttributes.lastName,
        resetPasswordUrl: `${USER_MANAGEMENT_URLS.RESET_PASSWORD}?token=${token}`,
        expireInMinutes: jwtService.tokenTtl / 60,
      },
    });
  }

  public async sendResetPasswordNotificationEmail(userAttributes: UserDomainJsonAttributes): Promise<void> {
    return this.send({
      to: userAttributes.email as string,
      subject: EMAIL_SUBJECTS.RESET_PASSWORD_NOTIFICATION,
      template: EMAIL_TEMPLATES.RESET_PASSWORD_NOTIFICATION,
      data: {
        firstName: userAttributes.firstName,
        lastName: userAttributes.lastName,
      },
    });
  }
}

export const mailerService = new MailerService();
