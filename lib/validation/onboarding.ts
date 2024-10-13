import { z } from 'zod';

export const OnboardingSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
  departmentId: z.string(),
  onboarded: z.optional(z.boolean()),
  image: z.optional(z.string().url()),
});

export type OnboardingSchemaType = z.infer<typeof OnboardingSchema>;
