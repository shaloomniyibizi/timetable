import { z } from 'zod';
export const RoomSchema = z.object({
  name: z
    .string({ required_error: 'room name is required' })
    .min(1, 'Room name is required')
    .min(2, 'Room name must be more than 2 characters'),
  capacity: z
    .string({ required_error: 'room code is required' })
    .min(1, 'Room capacity is required'),
  supervisorId: z
    .string({ required_error: 'room code is required' })
    .min(1, 'Room capacity is required'),
});
export type RoomSchemaType = z.infer<typeof RoomSchema>;
