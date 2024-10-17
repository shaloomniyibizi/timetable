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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { addRoom } from '@/lib/actions/room.action';
import { getTrainers } from '@/lib/actions/trainer.action';
import { RoomSchema, RoomSchemaType } from '@/lib/validation/room';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import SubmitButton from '../shared/SubmitButton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const AddRoomForm = () => {
  const { update } = useSession();
  const router = useRouter();

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  const queryClient = useQueryClient();

  const { mutate: AddRoom, isPending } = useMutation({
    mutationFn: async (values: RoomSchemaType) => {
      return await addRoom(values);
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
        queryKey: ['room'],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<RoomSchemaType>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: '',
      capacity: '',
      supervisorId: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: RoomSchemaType) {
    AddRoom(values);
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
              ⚙️ Add new room
            </CardTitle>
            <CardDescription>
              Provide all information to add new room.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='name'
              placeholder='Enter Room Name'
              label='Room Name'
              disabled={isPending}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='capacity'
              placeholder='Enter Room Capacity'
              label='Room Capacity'
              disabled={isPending}
            />
            <FormDescription>Number of student in room</FormDescription>

            <FormField
              control={form.control}
              name='supervisorId'
              render={({ field }) => (
                <FormItem className='w-full flex-1 mt-2'>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Room Supervisor' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Supervisors</SelectLabel>
                          {trainers?.map((tainer, i) => (
                            <SelectItem key={tainer.id + i} value={tainer.id}>
                              <p>{tainer.user.name}</p>
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
            <SubmitButton isLoading={isPending}>
              {isPending ? <BeatLoader /> : 'Add Room'}
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddRoomForm;
