'use server';

import { redirect } from 'next/navigation';
import { db } from '../database/db';
import { currentUser } from '../user.auth';
import { departmentSchema, departmentSchemaType } from '../validation';

export const addDepartment = async (values: departmentSchemaType) => {
  const parsedBody = departmentSchema.safeParse(values);

  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser();

  if (!user) redirect('/login');

  const { name, HODId } = parsedBody.data;
  const department = await db.department.create({
    data: {
      name,
      hod: {
        connect: {
          id: HODId,
        },
      },
    },
  });

  return department;
};
export const getDepartments = async () => {
  const department = await db.department.findMany();
  return department;
};
export const getDepartmentById = async (id: string) => {
  const department = await db.department.findUnique({ where: { id } });
  return department;
};
export const DeleteDepartment = async (id: string) => {
  const department = await db.department.delete({
    where: {
      id,
    },
  });

  if (!department) return { error: 'Fail to delete depatment' };
  return { success: `${department.name} Department Deleted successfully` };
};

export type GetDepartmentsType = Awaited<ReturnType<typeof getDepartments>>;
