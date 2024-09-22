import { z } from 'zod';
export const ModuleSchema = z.object({
  name: z
    .string({ required_error: 'Module name is required' })
    .min(1, 'Module name is required')
    .min(3, 'Module name must be more than 8 characters'),
  code: z
    .string({ required_error: 'Module code is required' })
    .min(1, 'Module code is required')
    .min(3, 'Module code must be more than 8 characters'),
  yearOfStudy: z
    .string({ required_error: 'Module yearOfStudy is required' })
    .min(1, 'Module yearOfStudy is required')
    .min(3, 'Module yearOfStudy must be more than 8 characters'),
  level: z
    .string({ required_error: 'Module level is required' })
    .min(1, 'Module level is required')
    .min(3, 'Module level must be more than 8 characters'),
  trainerId: z
    .string({ required_error: 'Module trainerId is required' })
    .min(1, 'Module trainerId is required')
    .min(3, 'Module trainerId must be more than 8 characters'),
});
export type ModuleSchemaType = z.infer<typeof ModuleSchema>;
