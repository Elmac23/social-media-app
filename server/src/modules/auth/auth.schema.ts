import z from 'zod';

export const loginSchema = z.object({
  loginOrEmail: z.string().min(1, 'Login or email is required'),
  password: z.string(),
});

export const registerSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required'),
  lastname: z.string().min(1, 'Lastname is required'),
  dateOfBirth: z.iso.date(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
