'use server';

import { db } from '@/lib/database/db';

import { ModuleSchema, ModuleSchemaType } from '@/lib/validation/module';
import { currentUser } from '../user.auth';

export const getModules = async () => {
  const modules = await db.module.findMany({
    include: {
      trainer: {
        include: {
          user: true,
        },
      },
    },
  });
  return modules;
};
export const getModuleById = async (moduleId: string) => {
  const module = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      trainer: {
        include: {
          user: true,
        },
      },
    },
  });
  return module;
};

export const addModule = async (values: ModuleSchemaType) => {
  const validatedFields = ModuleSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { code, level, name, trainerId, yearOfStudy } = validatedFields.data;

  const existingModule = await db.module.findFirst({
    where: { name },
  });

  if (existingModule) {
    return { error: 'Module already in use!' };
  }

  const newModule = await db.module.create({
    data: {
      code,
      level,
      name,
      trainerId,
      yearOfStudy,
    },
  });

  if (!newModule) return { error: 'Fail to add New module !' };

  return {
    success: 'Module Added Successfully 👍',
  };
};

export const editModule = async (values: ModuleSchemaType, id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const module = await db.module.update({
    where: { id },
    data: {
      ...values,
    },
  });

  return { success: 'User Account Updated !' };
};

export async function DeleteModule(id: string) {
  const module = await db.module.findUnique({
    where: {
      id,
    },
  });

  if (!module) return { error: 'This module does not exit any more !' };

  //Delete module from db
  const delmodule = await db.module.delete({
    where: {
      id,
    },
  });

  if (!delmodule) return { error: 'Fail to delete module !' };
  return { success: 'Module deleted successfully!' };
}

export type GetModulesType = Awaited<ReturnType<typeof getModules>>;
export type GetModuleByIdType = Awaited<ReturnType<typeof getModuleById>>;
