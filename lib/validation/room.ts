import { z } from 'zod';
export const RoomSchema = z.object({
  name: z
    .string({ required_error: 'room name is required' })
    .min(1, 'room name is required')
    .min(2, 'room name must be more than 2 characters'),
  capacity: z
    .number({ required_error: 'room code is required' })
    .min(1, 'room code is required')
    .min(3, 'room code must be more than 2 characters'),
});
export type RoomSchemaType = z.infer<typeof RoomSchema>;
