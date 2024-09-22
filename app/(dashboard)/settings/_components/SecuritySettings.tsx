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
import {
  SecuritySettingsSchema,
  SecuritySettingsSchemaType,
} from '@/lib/validation/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { SecuritySettings } from '../_actions/securitySettings.actions';

const SecuritySettingForm = () => {
  const { update } = useSession();

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<SecuritySettingsSchemaType>({
    resolver: zodResolver(SecuritySettingsSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const queryClient = useQueryClient();

  const { mutate: SecuritySetting, isPending } = useMutation({
    mutationFn: SecuritySettings,
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

      // After creating a transaction, we need to invalidate the overview query which will fetch data in the home page
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'usersSecurity'],
      });
    },

    onError: (e) => {
      console.log(`Error: ${e}`);
      toast.error('Something went wrong!');
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: SecuritySettingsSchemaType) {
    SecuritySetting(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              update your security information to secure your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='password'
              placeholder='password'
              label='Password'
              type='password'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='newPassword'
              placeholder='Enter New Password'
              label='New Password'
              type='password'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='confirmPassword'
              placeholder='Enter confirmation Password '
              label='Confirm Password '
              type='password'
            />
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <SubmitButton isLoading={isPending}>Update</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SecuritySettingForm;
