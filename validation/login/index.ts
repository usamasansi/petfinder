import { TFunction } from "i18next";
import { z } from "zod";

export type LoginFormData = {
  email: string;
  password: string;
};

export const LoginSchema = (t: TFunction<"translation", undefined>) =>
  z.object({
    email: z.string().email(t("emailValidationMessage")),
    password: z.string().min(8, t("passwordValidationMin8Message")),
  });
