'use server';

import { db } from '@/lib/database/db';

import {
  LessonSchemaa,
  LessonSchemaaType,
  LessonSchemaType,
} from '@/lib/validation/lesson';
import { currentUser } from '../user.auth';

export const getLessons = async () => {
  const lessons = await db.lesson.findMany({
    include: {
      module: true,
      room: true,
      trainer: {
        include: {
          user: true,
        },
      },
    },
  });
  return lessons;
};
export const getLessonById = async (lessonId: string) => {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
  });
  return lesson;
};

export const addLesson = async (values: LessonSchemaaType) => {
  const { success, data } = LessonSchemaa.safeParse(values);

  if (!success) {
    return { error: true };
  }

  const { availabilities } = data;

  const newLesson = await db.lesson.createMany({
    data: availabilities,
  });

  if (!newLesson) return { error: 'Fail to add New lesson !' };

  return {
    success: 'Lesson Added Successfully 👍',
  };
};

export const editLesson = async (values: LessonSchemaType, id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const lesson = await db.lesson.update({
    where: { id },
    data: {
      ...values,
    },
  });

  if (!lesson) {
    return { error: 'Fail Updated !' };
  }

  return { success: 'Lesson Updated !' };
};

export async function DeleteLesson(id: string) {
  const lesson = await db.lesson.findUnique({
    where: {
      id,
    },
  });

  if (!lesson) return { error: 'This lesson does not exit any more !' };

  //Delete lesson from db
  const dellesson = await db.lesson.delete({
    where: {
      id,
    },
  });

  if (!dellesson) return { error: 'Fail to delete lesson !' };
  return { success: 'Lesson deleted successfully!' };
}

export type GetLessonsType = Awaited<ReturnType<typeof getLessons>>;
export type GetLessonByIdType = Awaited<ReturnType<typeof getLessonById>>;
