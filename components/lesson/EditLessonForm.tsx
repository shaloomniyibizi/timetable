'use client';

import { Fragment } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';

import { editLesson } from '@/lib/actions/lesson.action';
import { getTrainers } from '@/lib/actions/trainer.action';
import { LessonSchema, LessonSchemaType } from '@/lib/validation/lesson';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { getModules } from '@/lib/actions/module.action';
import { getRooms } from '@/lib/actions/room.action';
import { DAYS_OF_WEEK_IN_ORDER } from '@/lib/constants';
import { Lesson } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CustomFormField, { FormFieldType } from '../shared/CustomFormField';
import SubmitButton from '../shared/SubmitButton';

interface Props {
  lesson: Lesson;
}
const EditLessonForm = ({ lesson }: Props) => {
  const { update } = useSession();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => await getModules(),
  });
  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => await getRooms(),
  });
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
      toast.error(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      day: undefined,
      startTime: lesson.startTime || undefined,
      endTime: lesson.endTime || undefined,
      moduleId: lesson.moduleId || undefined,
      trainerId: lesson.trainerId || undefined,
      roomId: lesson.roomId || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: LessonSchemaType) {
    EditLesson(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex gap-6 flex-col max-w-6xl mx-auto py-4'
      >
        <div className='grid grid-cols-[auto,1fr] gap-y-6 gap-x-4'>
          <Fragment>
            <FormField
              control={form.control}
              name={`day`}
              render={({ field }) => (
                <FormItem className='w-full flex-1'>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Day' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Day</SelectLabel>
                          {DAYS_OF_WEEK_IN_ORDER?.map((day, i) => (
                            <SelectItem key={day + i} value={day}>
                              <p>{day}</p>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col gap-2'>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='startTime'
                placeholder='Enter Start Time'
                label='Start Time'
                disabled={isPending}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='endTime'
                placeholder='Enter Start Time'
                label='Start Time'
                disabled={isPending}
              />
              <FormField
                control={form.control}
                name={`trainerId`}
                render={({ field }) => (
                  <FormItem className='w-full flex-1'>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select your Trainer' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Trainers</SelectLabel>
                            {trainers?.map((trainer, i) => (
                              <SelectItem
                                key={trainer.user.name + i}
                                value={trainer.id}
                              >
                                <p>{trainer.user.name}</p>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`moduleId`}
                render={({ field }) => (
                  <FormItem className='w-full flex-1'>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select your Module' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Modules</SelectLabel>
                            {modules?.map((module, i) => (
                              <SelectItem
                                key={module.name + i}
                                value={module.id}
                              >
                                <p>{module.name}</p>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`roomId`}
                render={({ field }) => (
                  <FormItem className='w-full flex-1'>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select Room' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Rooms</SelectLabel>
                            {rooms?.map((room, i) => (
                              <SelectItem key={room.name + i} value={room.id}>
                                <p>{room.name}</p>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Fragment>
        </div>

        <div className='flex gap-2 justify-end'>
          <SubmitButton className='max-w-sm' isLoading={isPending}>
            Update Lesson
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default EditLessonForm;
