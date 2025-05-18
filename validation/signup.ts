import { TFunction } from "i18next";
import { z } from "zod";

export type SignUpFormData = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  rememberUser: boolean;
};

export const SignUpSchema = (t: TFunction<"translation", undefined>) =>
  z.object({
    email: z.string().email(t("emailValidationMessage")),
    username: z
      .string()
      .min(3, t("usernameValidationMin3Message", { defaultValue: "Username must be at least 3 characters" }))
      .max(20, t("usernameValidationMax20Message", { defaultValue: "Username must be at most 20 characters" }))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t("usernameValidationAlphanumericMessage", { defaultValue: "Username must be alphanumeric (letters, numbers, and underscores only)" })
      ),
    password: z.string().min(8, t("passwordValidationMin8Message")),
    firstName: z
      .string()
      .min(2, t("firstNameValidationMin2Message", { defaultValue: "First name must be at least 2 characters" })),
    lastName: z
      .string()
      .min(2, t("lastNameValidationMin2Message", { defaultValue: "Last name must be at least 2 characters" })),
    phoneNumber: z
      .string()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        t("phoneNumberValidationMessage", { defaultValue: "Invalid phone number format" })
      ),
    rememberUser: z.boolean().default(false),
  });