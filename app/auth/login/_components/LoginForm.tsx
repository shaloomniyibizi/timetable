'use client';
import Link from 'next/link';

import { FormError } from '@/components/forms/FormError';
import { FormSuccess } from '@/components/forms/FormSuccess';
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
import { login } from '@/lib/actions/user.action';
import { LoginSchema, LoginSchemaType } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
const LoginForm = () => {
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';
  const [showTwoFactor, setShowTwoFactor] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess(data) {
      if (data?.error) {
        form.reset();
        toast.error(data.error);
        setError(data.error);
      }

      if (data?.success) {
        form.reset();
        update();
        toast.success(data.success);
        setSuccess(data.success);
      }

      if (data?.twoFactor) {
        setShowTwoFactor(true);
      }
      // After creating a transaction, we need to invalidate the overview query which will fetch data in the home page
      queryClient.invalidateQueries({
        queryKey: ['userSession'],
      });
    },
  });

  // 1. Define your form.
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: LoginSchemaType) {
    mutate(values);
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
            className='flex flex-col gap-4'
          >
            {showTwoFactor && (
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                id='twofactor'
                control={form.control}
                name='email'
                placeholder='Login email'
                label='Email'
                type='number'
                autoCapitalize='none'
                autoComplete='twofactor'
                autoCorrect='off'
                disabled={isPending}
              />
            )}
            {!showTwoFactor && (
              <>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name='email'
                  placeholder='Login email'
                  label='Email'
                  type='email'
                  disabled={isPending}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name='password'
                  placeholder='Login password'
                  label='Password'
                  type='password'
                  disabled={isPending}
                />
                <Button
                  size='sm'
                  variant='link'
                  asChild
                  className='-mt-4 w-fit px-0 text-end font-normal'
                >
                  <Link href='/reset'>Forgot password?</Link>
                </Button>
              </>
            )}
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type='submit' className='w-full'>
              {showTwoFactor ? (
                <>{isPending ? <BeatLoader /> : 'Confirm'}</>
              ) : (
                <>{isPending ? <BeatLoader /> : 'Login'}</>
              )}
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

export default LoginForm;
