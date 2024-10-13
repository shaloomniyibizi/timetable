'use client';

import CustomFormField, {
  FormFieldType,
} from '@/components/shared/CustomFormField';
import SubmitButton from '@/components/shared/SubmitButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { editLesson } from '@/lib/actions/lesson.action';
import { getTrainers } from '@/lib/actions/trainer.action';
import { LessonSchema, LessonSchemaType } from '@/lib/validation/lesson';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lesson } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  lesson: Lesson;
}
const EditLessonForm = ({ lesson }: Props) => {
  const { update } = useSession();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  const { mutate: EditLesson, isPending } = useMutation({
    mutationFn: async (values: LessonSchemaType) => {
      return await editLesson(values, lesson.id);
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        update();
        toast.success(data.success);
        router.refresh();
        router.back();
      }
      queryClient.invalidateQueries({
        queryKey: ['lessons'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      name: lesson.name || undefined,
      capacity: lesson?.capacity || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: LessonSchemaType) {
    EditLesson(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Lesson Updation</CardTitle>
            <CardDescription>
              update your lesson information to secure your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='name'
              placeholder='Enter Lesson Name'
              label='Lesson Name'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='capacity'
              placeholder='Enter Lesson Capacity'
              label='Lesson Capacity'
              disabled={isPending}
            />
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <SubmitButton isLoading={isPending}>Update Lesson</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditLessonForm;
