import z from "zod";

export const userDataSchema = z.object({
  sex: z
    .enum(["MALE", "FEMALE"])
    .optional()
    .refine((val) => !val || val === "MALE" || val === "FEMALE", {
      message: "Sex must be MALE or FEMALE",
    }),
  city: z.string().max(50, "City is too long").optional(),
  country: z.string().max(50, "Country is too long").optional(),
  phoneNumber: z.string().max(20, "Phone number is too long").optional(),
  primaryLanguage: z
    .string()
    .max(30, "Primary language is too long")
    .optional(),
  otherLanguages: z.string().max(100, "Other languages is too long").optional(),
  schools: z.string().max(100, "Schools is too long").optional(),
  jobs: z.string().max(100, "Jobs is too long").optional(),
  hobbies: z.string().max(100, "Hobbies is too long").optional(),
});

export const userUpdateSchema = z.object({
  login: z.string().min(1, "Login is required").optional(),
  email: z.email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  name: z.string().min(1, "Name is required").optional(),
  lastname: z.string().min(1, "Lastname is required").optional(),
  dateOfBirth: z.iso.date().optional(),
  userData: userDataSchema.optional(),
});
