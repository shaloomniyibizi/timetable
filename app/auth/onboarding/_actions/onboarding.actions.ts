'use server';

import { getUserByEmail, getUserById } from '@/lib/data/user';
import { db } from '@/lib/database/db';
import { sendVerificationEmail } from '@/lib/emails';
import { generateVerificationToken } from '@/lib/tokens';
import { currentUser } from '@/lib/user.auth';
import {
  OnboardingSchema,
  OnboardingSchemaType,
} from '@/lib/validation/onboarding';

export const onboarding = async (values: OnboardingSchemaType) => {
  const validatedFields = OnboardingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { departmentId, email, image, name, onboarded } = validatedFields.data;
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

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Verification email sent!' };
  }

  if (user.isOAuth) {
    values.email = user.email!;
  }

  const record = db.$transaction(async (txt) => {
    // update user
    const updatedUser = await txt.user.update({
      where: { id: dbUser.id },
      data: {
        email,
        image,
        name,
        onboarded,
      },
    });
    if (updatedUser) {
      const trainer = await txt.trainer.create({
        data: {
          departmentId,
          userId: updatedUser.id,
        },
      });
    }
  });

  return { success: 'Successfully onboarded !' };
};
