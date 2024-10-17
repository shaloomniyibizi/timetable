'use server';

import { db } from '@/lib/database/db';

import { getUserByEmail, getUserById } from '@/lib/data/user';
import {
  EditTrainerSchemaType,
  TrainerSchema,
  TrainerSchemaType,
} from '@/lib/validation/trainer';
import bcrypt from 'bcryptjs';
import { currentUser } from '../user.auth';

export const getTrainers = async () => {
  const trainers = await db.trainer.findMany({
    include: {
      user: true,
      department: true,
      modules: true,
    },
  });
  return trainers;
};
export const getTrainerByDepartment = async () => {
  const user = await currentUser();
  const train = await db.trainer.findFirst({
    where: { userId: user?.id },
  });
  const trainer = await db.trainer.findMany({
    where: { departmentId: train?.departmentId },
    include: {
      user: true,
      department: true,
      modules: true,
    },
  });
  return trainer;
};
export const getTrainerById = async (trainerId: string) => {
  const trainer = await db.trainer.findUnique({
    where: { id: trainerId },
    include: {
      user: true,
      department: true,
      modules: true,
    },
  });
  return trainer;
};
export const getTrainerByUserId = async (userId: string) => {
  const trainer = await db.trainer.findUnique({
    where: { userId },
    include: {
      user: true,
      department: true,
      modules: true,
    },
  });
  return trainer;
};

export const addTrainer = async (values: TrainerSchemaType) => {
  const validatedFields = TrainerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name, email, phoneNumber, password, departmentId, role } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingTrainer = await getUserByEmail(email);

  if (existingTrainer) {
    return { error: 'Email already in use!' };
  }

  const addTrainer = await db.$transaction(async (txt) => {
    const newTrainer = await txt.user.create({
      data: {
        email,
        phoneNumber,
        name,
        password: hashedPassword,
        role,
        emailVerified: new Date(), // manual email verification
      },
    });
    //update trainer notification
    await txt.trainer.create({
      data: {
        userId: newTrainer.id,
        departmentId,
      },
    });
    return newTrainer;
  });
  if (!addTrainer) return { error: 'Fail to add New trainer !' };

  return {
    success: 'Trainer AddTrainered Successfully 👍',
  };
};

export const editTrainer = async (
  values: EditTrainerSchemaType,
  id: string
) => {
  const dbUser = await getUserById(id);

  if (!dbUser) {
    return { error: 'This user does no more exist' };
  }

  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      return { error: 'Email already in use!' };
    }
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: 'User Account Updated !' };
};

export async function DeleteTrainer(id: string) {
  const trainer = await db.trainer.findUnique({
    where: {
      id,
    },
  });

  if (!trainer) return { error: 'This trainer does not exit any more !' };

  //Delete trainer from db
  const deltrainer = await db.$transaction(async (txt) => {
    const tr = await txt.trainer.delete({
      where: {
        id,
      },
    });

    const user = await txt.user.delete({
      where: {
        id: tr.userId,
      },
    });

    return tr;
  });

  if (!deltrainer) return { error: 'Fail to delete trainer !' };
  return { success: 'Trainer deleted successfully!' };
}

export type GetTrainersType = Awaited<ReturnType<typeof getTrainers>>;
export type GetTrainerByIdType = Awaited<ReturnType<typeof getTrainerById>>;
