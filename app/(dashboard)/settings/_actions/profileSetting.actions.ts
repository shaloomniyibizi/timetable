'use server';

import { getUserByEmail, getUserById } from '@/lib/data/user';
import { db } from '@/lib/database/db';
import { currentUser } from '@/lib/user.auth';
import { ProfileSettingSchemaType } from '@/lib/validation/user';

export const ProfileSetting = async (values: ProfileSettingSchemaType) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }
  }

  if (user.isOAuth) {
    values.email = user.email!;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: 'User Account Updated !' };
};
