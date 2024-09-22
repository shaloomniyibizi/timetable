import { Role } from '@prisma/client';
import { z } from 'zod';
export const TrainerSchema = z.object({
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
  departmentId: z.string({ required_error: 'Department is required' }),
  role: z.enum([Role.DAS, Role.HOD, Role.TRAINER]),
});
export type TrainerSchemaType = z.infer<typeof TrainerSchema>;

export const EditTrainerSchema = z.object({
  image: z.string().optional(),

  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),

  role: z.enum([Role.DAS, Role.HOD, Role.TRAINER]),
  phoneNumber: z.string().min(2, {
    message: 'technologies must be at least 2 characters.',
  }),
});
export type EditTrainerSchemaType = z.infer<typeof EditTrainerSchema>;
