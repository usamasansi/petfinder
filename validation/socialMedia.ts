import { z } from "zod";

export const SocialMediaSchema = (t: (key: string) => string) =>
  z.object({
    postMessage: z
      .string()
      .min(1, { message: t("postMessageRequired") })
      .max(280, { message: t("postMessageTooLong") }),
    platforms: z
      .object({
        facebook: z.boolean(),
        instagram: z.boolean(),
        twitter: z.boolean(),
        linkedin: z.boolean(),
      })
      .refine(
        (data) => Object.values(data).some((value) => value),
        { message: t("selectAtLeastOnePlatform") }
      ),
  });

export type SocialMediaFormData = z.infer<ReturnType<typeof SocialMediaSchema>>;