import { Role } from '@prisma/client';
import z from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
  code: z.optional(z.string()),
});
export const RegisterSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(1, 'Name is required')
    .min(3, 'name must be more than 8 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  phoneNumber: z.string().optional(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be less than 32 characters')
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
});

export const SettingsSchema = z.object({
  image: z.optional(z.string().url()),
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
  phoneNumber: z.optional(z.string()),
  role: z.enum([Role.DAS, Role.HOD, Role.TRAINER]),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const departmentSchema = z.object({
  name: z.string().min(2).max(20),
  HODId: z.string(),
});

export type departmentSchemaType = z.infer<typeof departmentSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type SettingsSchemaType = z.infer<typeof SettingsSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type ResetSchemaType = z.infer<typeof ResetSchema>;
