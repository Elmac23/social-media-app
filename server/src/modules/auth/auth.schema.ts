import z from 'zod';

export const loginSchema = z.object({
  loginOrEmail: z.string().min(1, 'Login or email is required'),
  password: z.string(),
  otp: z.string().length(6).optional(),
});

export const confirmEmailSchema = z.object({
  token: z.string(),
  email: z.email(),
});

export const resenedConfirmEmailSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required'),
  lastname: z.string().min(1, 'Lastname is required'),
  dateOfBirth: z.iso.date(),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type LoginDto = z.infer<typeof loginSchema> & { deviceId: string };
export type ConfirmEmailDto = z.infer<typeof confirmEmailSchema>;
export type ResendConfirmEmailDro = z.infer<typeof resenedConfirmEmailSchema>;
export type RegisterDto = z.infer<typeof registerSchema> & { deviceId: string };
