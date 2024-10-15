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
import { Input } from '@/components/ui/input';
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
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/utils/uploadthing';
import {
  OnboardingSchema,
  OnboardingSchemaType,
} from '@/lib/validation/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { onboarding } from '../_actions/onboarding.actions';

interface Props {
  user: User;
}

const OnboardingForm = ({ user }: Props) => {
  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const { update } = useSession();

  const [files, setFiles] = useState<File[]>([]);

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => await getDepartments(),
  });

  const queryClient = useQueryClient();

  const { mutate: onboardingUser, isPending } = useMutation({
    mutationFn: async (values: OnboardingSchemaType) => {
      const blob = values.image as string;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url;
        }
      }
      console.log(values);
      return await onboarding(values);
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        update();
        toast.success(data.success);
        router.push('/');
      }

      // After creating a transaction, we need to invalidate the overview query which will fetch data in the home page
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<OnboardingSchemaType>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      departmentId: undefined,
      onboarded: true,
      image: user?.image || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: OnboardingSchemaType) {
    onboardingUser(values);
  }
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-lg mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-semibold'>
              ⚙️ Onboarding
            </CardTitle>
            <CardDescription>Fill the missing information</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem className='flex items-center justify-center gap-4'>
                  <FormLabel>
                    {field.value ? (
                      <Image
                        src={field.value}
                        alt='profile_icon'
                        width={96}
                        height={96}
                        priority
                        className='h-28 w-28 rounded-full object-contain'
                      />
                    ) : (
                      <ImageIcon />
                    )}
                  </FormLabel>
                  <FormControl className='text-base-semibold flex-1 text-gray-200'>
                    <Input
                      type='file'
                      accept='image/*'
                      placeholder='Edit profile image'
                      className=''
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='name'
              placeholder='Enter Full Name'
              label='Full Name'
              disabled
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='email'
              placeholder='Enter email address'
              label='Email address'
              disabled
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
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <SubmitButton isLoading={isPending}>Continue</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default OnboardingForm;
