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
import { editRoom } from '@/lib/actions/room.action';
import { getTrainers } from '@/lib/actions/trainer.action';
import { RoomSchema, RoomSchemaType } from '@/lib/validation/room';

import { zodResolver } from '@hookform/resolvers/zod';
import { Room } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  room: Room;
}
const EditRoomForm = ({ room }: Props) => {
  const { update } = useSession();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  const { mutate: EditRoom, isPending } = useMutation({
    mutationFn: async (values: RoomSchemaType) => {
      return await editRoom(values, room.id);
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
        queryKey: ['rooms'],
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
      name: room.name || undefined,
      capacity: room?.capacity || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: RoomSchemaType) {
    EditRoom(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Room Updation</CardTitle>
            <CardDescription>
              update your room information to secure your account.
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
          </CardContent>
          <CardFooter className='border-t px-6 py-4'>
            <SubmitButton isLoading={isPending}>Update Room</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditRoomForm;
