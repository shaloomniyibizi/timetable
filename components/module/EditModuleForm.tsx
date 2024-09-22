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
import { editModule } from '@/lib/actions/module.action';
import { getTrainers } from '@/lib/actions/trainer.action';
import { ModuleSchema, ModuleSchemaType } from '@/lib/validation/module';

import { zodResolver } from '@hookform/resolvers/zod';
import { Module } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  module: Module;
}
const EditModuleForm = ({ module }: Props) => {
  const { update } = useSession();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  const { mutate: EditModule, isPending } = useMutation({
    mutationFn: async (values: ModuleSchemaType) => {
      return await editModule(values, module.id);
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
        queryKey: ['modules'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<ModuleSchemaType>({
    resolver: zodResolver(ModuleSchema),
    defaultValues: {
      name: module.name || undefined,
      code: module?.code || undefined,
      level: module?.level || undefined,
      trainerId: module?.trainerId || undefined,
      yearOfStudy: module?.yearOfStudy || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: ModuleSchemaType) {
    EditModule(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Module Updation</CardTitle>
            <CardDescription>
              update your module information to secure your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='name'
              placeholder='Enter Module Name'
              label='Module Name'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='code'
              placeholder='Enter Module Code'
              label='Module Code'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='yearOfStudy'
              placeholder='Enter Year Of Study'
              label='Enter Year Of Study'
              disabled={isPending}
            />
            <FormField
              control={form.control}
              name='trainerId'
              render={({ field }) => (
                <FormItem className='w-full flex-1'>
                  <FormLabel>Trainer</FormLabel>
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
                          <SelectLabel>Trainer</SelectLabel>
                          {trainers?.map((trainer, i) => (
                            <SelectItem key={trainer.id + i} value={trainer.id}>
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
              name='level'
              render={({ field }) => (
                <FormItem className='w-full flex-1'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Module level' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Module Level</SelectLabel>
                          <SelectItem value='Level 6 Year 1'>
                            <p>Level 6 Year 1</p>
                          </SelectItem>
                          <SelectItem value='Level 7 Year 1'>
                            <p>Level 7 Year 1</p>
                          </SelectItem>
                          <SelectItem value='Level 7 Year 2'>
                            <p>Level 7 Year 2</p>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <SubmitButton isLoading={isPending}>Update Module</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditModuleForm;
