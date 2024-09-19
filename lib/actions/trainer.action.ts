'use server';

import { db } from '@/lib/database/db';

import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../data/user';
import { TrainerSchema, TrainerSchemaType } from '../validation';

export const getTrainers = async () => {
  const trainers = await db.trainer.findMany({
    include: {
      user: true,
      departments: true,
      modules: true,
    },
  });
  return trainers;
};

export const addTrainer = async (values: TrainerSchemaType) => {
  const validatedFields = TrainerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name, email, phoneNumber, password, departmentId } =
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
        role: 'TRAINER',
        emailVerified: new Date(), // manual email verification
      },
    });
    //update trainer notification
    await txt.trainer.create({
      data: {
        userId: newTrainer.id,
        departments: {
          connect: {
            id: departmentId,
          },
        },
      },
    });
    return newTrainer;
  });
  if (!addTrainer) return { error: 'Fail to add New trainer !' };

  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
  // if (trainer) redirect("/onboarding");

  return {
    success: 'Trainer AddTrainered Successfully 👍',
  };
};

export type GetTrainersType = Awaited<ReturnType<typeof getTrainers>>;
