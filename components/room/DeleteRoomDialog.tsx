'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DeleteRoom } from '@/lib/actions/room.action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface DeleteRoomDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  roomId: string;
}
function DeleteRoomDialog({ open, setOpen, roomId }: DeleteRoomDialogProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteRoom,
    onSuccess: async (data) => {
      toast.success(data.success);

      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      });
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can not ne undone. This will permenently delete this
            room
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteMutation.mutate(roomId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteRoomDialog;
