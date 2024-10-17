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
import { editTrainer } from '@/lib/actions/trainer.action';
import { useCurrentRole } from '@/lib/hooks';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/utils/uploadthing';
import {
  EditTrainerSchema,
  EditTrainerSchemaType,
} from '@/lib/validation/trainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  user: User;
}
const EditTrainerForm = ({ user }: Props) => {
  const { update } = useSession();
  const currentRole = useCurrentRole();
  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const [files, setFiles] = useState<File[]>([]);

  const queryClient = useQueryClient();

  const { mutate: EditTrainer, isPending } = useMutation({
    mutationFn: async (values: EditTrainerSchemaType) => {
      const blob = values.image as string;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url;
        }
      }
      console.log(values);
      return await editTrainer(values, user.id);
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
        queryKey: ['dashboard', 'usersProfile'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<EditTrainerSchemaType>({
    resolver: zodResolver(EditTrainerSchema),
    defaultValues: {
      name: user.name || undefined,
      email: user?.email || undefined,
      phoneNumber: user?.phoneNumber || undefined,
      image: user?.image || undefined,
      role: user?.role || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: EditTrainerSchemaType) {
    EditTrainer(values);
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              only {currentRole} update your Profile information to secure your
              account.
            </CardDescription>
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
            {currentRole === 'DAS' && (
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='w-full flex-1'>
                    <FormLabel>Trainer Role</FormLabel>
                    <FormControl>
                      <Select
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
            )}
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <SubmitButton isLoading={isPending}>Update Trainer</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditTrainerForm;
