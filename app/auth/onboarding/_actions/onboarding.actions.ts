"use server";

import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/emails";
import { generateVerificationToken } from "@/lib/tokens";
import { currentUser } from "@/lib/userAuth";
import {
  OnboardingSchema,
  OnboardingSchemaType,
} from "@/lib/validations/onboarding";
import {
  getUserByEmail,
  getUserById,
} from "../../../(protected)/dashboard/users/_actions/user.actions";

export const onboarding = async (values: OnboardingSchemaType) => {
  const validatedFields = OnboardingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    departmentId,
    fieldId,
    bio,
    email,
    image,
    name,
    onboarded,
    collegeId,
  } = validatedFields.data;
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (user.isOAuth) {
    values.email = user.email!;
  }

  // update user
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      departmentId,
      collegeId,
      bio,
      email,
      image,
      name,
      onboarded,
      fieldId,
    },
  });

  return { success: "Successfully onboarded !" };
};
