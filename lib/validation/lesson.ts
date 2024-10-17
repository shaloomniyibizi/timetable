import { timeToInt } from '@/lib/utils';
import { z } from 'zod';
import { DAYS_OF_WEEK_IN_ORDER } from '../constants';

export const LessonSchemaa = z.object({
  availabilities: z
    .array(
      z.object({
        day: z.enum(DAYS_OF_WEEK_IN_ORDER),
        moduleId: z.string(),
        trainerId: z.string(),
        roomId: z.string(),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Time must be in the format HH:MM'
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Time must be in the format HH:MM'
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index &&
            a.day === availability.day &&
            timeToInt(a.startTime) < timeToInt(availability.endTime) &&
            timeToInt(a.endTime) > timeToInt(availability.startTime)
          );
        });

        if (overlaps) {
          ctx.addIssue({
            code: 'custom',
            message: 'Availability overlaps with another',
            path: [index],
          });
        }

        if (
          timeToInt(availability.startTime) >= timeToInt(availability.endTime)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: 'End time must be after start time',
            path: [index],
          });
        }
      });
    }),
});

export type LessonSchemaaType = z.infer<typeof LessonSchemaa>;

export const LessonSchema = z.object({
  day: z.enum(DAYS_OF_WEEK_IN_ORDER),
  moduleId: z.string(),
  trainerId: z.string(),
  roomId: z.string(),
  startTime: z
    .string()
    .regex(
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Time must be in the format HH:MM'
    ),
  endTime: z
    .string()
    .regex(
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Time must be in the format HH:MM'
    ),
});

export type LessonSchemaType = z.infer<typeof LessonSchema>;
