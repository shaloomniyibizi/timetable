'use client';

import CustomFormField, {
  FormFieldType,
} from '@/components/shared/CustomFormField';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDepartments } from '@/lib/actions/department.action';
import { addTrainer, getTrainerByUserId } from '@/lib/actions/trainer.action';
import { useCurrentUser } from '@/lib/hooks';
import { TrainerSchema, TrainerSchemaType } from '@/lib/validation/trainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';

const AddTrainerForm = () => {
  const { update } = useSession();
  const router = useRouter();
  const currentUser = useCurrentUser();

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => await getDepartments(),
  });
  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainerByUserId(currentUser?.id!),
  });

  const queryClient = useQueryClient();

  const { mutate: AddTrainer, isPending } = useMutation({
    mutationFn: async (values: TrainerSchemaType) => {
      return await addTrainer(values);
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        update();
        router.refresh();
        toast.success(data.success);
        router.back();
      }
      queryClient.invalidateQueries({
        queryKey: ['trainer'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<TrainerSchemaType>({
    resolver: zodResolver(TrainerSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      departmentId: trainers?.departmentId || '',
      role: 'TRAINER',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: TrainerSchemaType) {
    AddTrainer(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto min-w-min'
      >
        <Card className='w-full mt-2'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-semibold'>
              ⚙️ Add new trainer
            </CardTitle>
            <CardDescription>
              Provide all information to add new trainer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='name'
              placeholder='Enter Full Name'
              label='Full Name'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='email'
              placeholder='Enter email address'
              label='Email address'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='phoneNumber'
              placeholder='Enter phoneNumber'
              label='Phone Number'
              disabled={isPending}
            />
            <FormField
              control={form.control}
              name='departmentId'
              render={({ field }) => (
                <FormItem className='w-full flex-1'>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select your Department' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department</SelectLabel>
                          {departments?.map((department, i) => (
                            <SelectItem
                              key={department.name + i}
                              value={department.id}
                            >
                              <p>{department.name}</p>
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
              name='role'
              render={({ field }) => (
                <FormItem className='w-full flex-1'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Select
                      disabled
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Trainer Title' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trainer Role</SelectLabel>
                          <SelectItem value={Role.HOD}>
                            <p>H.O.D</p>
                          </SelectItem>
                          <SelectItem value={Role.TRAINER}>
                            <p>Trainer</p>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='password'
              placeholder='******'
              type='password'
              label='Password'
              disabled={isPending}
            />
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <Button disabled={isPending} type='submit' className='w-full'>
              {isPending ? <BeatLoader /> : 'Add Trainer'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddTrainerForm;
