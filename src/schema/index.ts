import z from "zod";

export const formValidationSchema = z.object({
  firstName: z
    .string()
    .nonempty("Le prénom est requise.")
    .min(3, "Le prénom doit comporter au moins 3 caractères"),
  lastName: z
    .string()
    .nonempty("Le nom est requise.")
    .min(3, "Le nom de famille doit comporter au moins 3 caractères"),
  email: z.email().nonempty("L'adresse e-mail est requise."),
  password: z
    .string()
    .min(4, "Le mot du passe doit comporter au moins 4 caractères")
    .refine((arg) => {
      const reg = new RegExp(/[A-Z]/i);
      return arg.match(reg);
    }),
});
