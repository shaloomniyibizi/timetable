import { z } from 'zod';

export const timeTable = z.object({
  lessonId: z.number().min(1, 'Required'),
  roomId: z.number().min(1, 'Required'),
  timeSlotId: z.number().min(1, 'Required'),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive('Duration must be greater than 0')
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
});
