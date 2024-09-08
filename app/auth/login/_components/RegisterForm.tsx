'use client';
import Link from 'next/link';

import CustomFormField, {
  FormFieldType,
} from '@/components/shared/CustomFormField';
import { Social } from '@/components/shared/Social';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { register } from '@/lib/actions/user.action';
import { RegisterSchema, RegisterSchemaType } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
const RegisterForm = () => {
  const queryClient = useQueryClient();
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('User Registered Successfully 👍');
      } else {
        toast.success(data.error);
      }
      form.reset();
      // After creating a transaction, we need to invalidate the overview query which will fetch data in the home page
      queryClient.invalidateQueries({
        queryKey: ['userSession'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });
  // 1. Define your form.
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: RegisterSchemaType) {
    registerUser(values);
  }
  return (
    <Card className='border-none'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col'
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='name'
              autoCapitalize='none'
              autoComplete='name'
              autoCorrect='off'
              disabled={isPending}
              placeholder='Enter full name'
              label='Full name'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='email'
              placeholder='Enter your email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              label='Email'
              type='email'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='phoneNumber'
              label='Phone Number'
              disabled={isPending}
              autoCapitalize='none'
              autoComplete='phone'
              autoCorrect='off'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='password'
              placeholder='Enter your password'
              label='Password'
              type='password'
              disabled={isPending}
              autoCapitalize='none'
              autoComplete='none'
              autoCorrect='off'
            />
            <Button disabled={isPending} type='submit' className='mt-4 w-full'>
              {isPending ? <BeatLoader /> : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='grid gap-4'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>
        <Social />
        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='#' className='underline'>
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
