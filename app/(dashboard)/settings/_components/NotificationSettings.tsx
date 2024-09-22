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
  ProfileSettingSchema,
  ProfileSettingSchemaType,
} from '@/lib/validation/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<ProfileSettingSchemaType>({
    resolver: zodResolver(ProfileSettingSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      image: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: ProfileSettingSchemaType) {
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast.success('well done ');
    console.log(values);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          update your Notification information to secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='image'
              placeholder='image'
              label='Image'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='fullName'
              placeholder='Enter Full Name'
              label='Full Name'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='email'
              placeholder='Enter email address'
              label='Email address'
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='phoneNumber'
              placeholder='Enter Phone Number'
              label='Phone Number'
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className='border-t px-6 py-4'>
        <SubmitButton isLoading={isLoading}>Save</SubmitButton>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
