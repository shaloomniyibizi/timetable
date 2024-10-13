'use server';

import { db } from '@/lib/database/db';

import { RoomSchema, RoomSchemaType } from '@/lib/validation/room';
import { currentUser } from '../user.auth';

export const getRooms = async () => {
  const rooms = await db.room.findMany();
  return rooms;
};
export const getRoomById = async (roomId: string) => {
  const room = await db.room.findUnique({
    where: { id: roomId },
  });
  return room;
};

export const addRoom = async (values: RoomSchemaType) => {
  const validatedFields = RoomSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name, capacity } = validatedFields.data;

  const existingRoom = await db.room.findFirst({
    where: { name },
  });

  if (existingRoom) {
    return { error: 'Room already in use!' };
  }

  const newRoom = await db.room.create({
    data: {
      name,
      capacity,
    },
  });

  if (!newRoom) return { error: 'Fail to add New room !' };

  return {
    success: 'Room Added Successfully 👍',
  };
};

export const editRoom = async (values: RoomSchemaType, id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const room = await db.room.update({
    where: { id },
    data: {
      ...values,
    },
  });

  return { success: 'User Account Updated !' };
};

export async function DeleteRoom(id: string) {
  const room = await db.room.findUnique({
    where: {
      id,
    },
  });

  if (!room) return { error: 'This room does not exit any more !' };

  //Delete room from db
  const delroom = await db.room.delete({
    where: {
      id,
    },
  });

  if (!delroom) return { error: 'Fail to delete room !' };
  return { success: 'Room deleted successfully!' };
}

export type GetRoomsType = Awaited<ReturnType<typeof getRooms>>;
export type GetRoomByIdType = Awaited<ReturnType<typeof getRoomById>>;
