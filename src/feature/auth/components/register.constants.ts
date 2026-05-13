import { z } from "zod";

export type RegisterTranslator = (key: string) => string;

export function createRegisterSchema(t: RegisterTranslator) {
  return z
    .object({
      fullName: z.string().min(1, t("validation.fullNameRequired")),
      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .email(t("validation.emailInvalid")),
      username: z
        .string()
        .min(1, t("validation.usernameRequired"))
        .min(3, t("validation.usernameMin")),
      password: z
        .string()
        .min(1, t("validation.passwordRequired"))
        .min(8, t("validation.passwordMin")),
      confirmPassword: z.string().min(1, t("validation.confirmRequired")),
      agreeTerms: z
        .boolean()
        .refine((v) => v === true, t("validation.termsRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.confirmMismatch"),
    });
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export const REGISTER_DEFAULT_VALUES: RegisterFormValues = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};
