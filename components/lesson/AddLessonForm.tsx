'use client';

import { Plus, X } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

import { addLesson } from '@/lib/actions/lesson.action';
import { getModules } from '@/lib/actions/module.action';
import { getTrainers } from '@/lib/actions/trainer.action';
import { DAYS_OF_WEEK_IN_ORDER } from '@/lib/constants';
import { timeToInt } from '@/lib/utils';
import { LessonSchemaa, LessonSchemaaType } from '@/lib/validation/lesson';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Availability = {
  startTime: string;
  endTime: string;
  day: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
  moduleId: string;
  trainerId: string;
};

const AddLessonForm = ({
  schedule,
}: {
  schedule?: {
    availabilities: Availability[];
  };
}) => {
  const [successMessage, setSuccessMessage] = useState<string>();

  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => await getModules(),
  });
  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  // 1. Define your form.
  const form = useForm<LessonSchemaaType>({
    resolver: zodResolver(LessonSchemaa),
    defaultValues: {
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.startTime);
      }),
    },
  });

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({ name: 'availabilities', control: form.control });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.day
  );

  // 2. Define a submit handler.
  async function onSubmit(values: LessonSchemaaType) {
    const data = await addLesson(values);

    if (data?.error) {
      form.setError('root', {
        message: 'There was an error saving your schedule',
      });
    } else {
      setSuccessMessage(data.success);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex gap-6 flex-col max-w-6xl mx-auto py-4'
      >
        {form.formState.errors.root && (
          <div className='text-destructive text-sm'>
            {form.formState.errors.root.message}
          </div>
        )}
        {successMessage && (
          <div className='text-green-500 text-sm'>{successMessage}</div>
        )}
        <div className='grid grid-cols-[auto,1fr] gap-y-6 gap-x-4'>
          {DAYS_OF_WEEK_IN_ORDER.map((day) => (
            <Fragment key={day}>
              <div className='capitalize text-sm font-semibold'>
                {day.substring(0, 3)}
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  type='button'
                  className='size-6 p-1'
                  variant='outline'
                  onClick={() => {
                    addAvailability({
                      day,
                      startTime: '08:00',
                      endTime: '09:20',
                      trainerId: '',
                      moduleId: '',
                    });
                  }}
                >
                  <Plus className='size-full' />
                </Button>
                {groupedAvailabilityFields[day]?.map((field, labelIndex) => (
                  <div className='flex flex-col gap-1' key={field.id}>
                    <div className='flex gap-2 items-center'>
                      <FormField
                        control={form.control}
                        name={`availabilities.${field.index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className='w-24'
                                aria-label={`${day} Start Time ${
                                  labelIndex + 1
                                }`}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      -
                      <FormField
                        control={form.control}
                        name={`availabilities.${field.index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className='w-24'
                                aria-label={`${day} End Time ${labelIndex + 1}`}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`availabilities.${field.index}.trainerId`}
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
                        name={`availabilities.${field.index}.moduleId`}
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
                      <Button
                        type='button'
                        className='size-6 p-1'
                        variant='destructiveGhost'
                        onClick={() => removeAvailability(field.index)}
                      >
                        <X />
                      </Button>
                    </div>
                    <FormMessage>
                      {
                        form.formState.errors.availabilities?.at?.(field.index)
                          ?.root?.message
                      }
                    </FormMessage>
                    <FormMessage>
                      {
                        form.formState.errors.availabilities?.at?.(field.index)
                          ?.startTime?.message
                      }
                    </FormMessage>
                    <FormMessage>
                      {
                        form.formState.errors.availabilities?.at?.(field.index)
                          ?.endTime?.message
                      }
                    </FormMessage>
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>

        <div className='flex gap-2 justify-end'>
          <Button disabled={form.formState.isSubmitting} type='submit'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddLessonForm;
