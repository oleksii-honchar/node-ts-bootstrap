import { TemplateDelegate } from "handlebars";

export interface EmailOptions {
  to: string;
  subject: string;
  data: Record<string, unknown>;
  template: string;
}

export interface CompiledTemplatesInterface {
  [key: string]: TemplateDelegate;
}

export interface EmailVerificationOptions {
  email: string;
  firstName: string;
  lastName: string;
}
