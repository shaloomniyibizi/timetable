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
import { DeleteTrainer } from '@/lib/actions/trainer.action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface DeleteTrainerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  trainerId: string;
}
function DeleteTrainerDialog({
  open,
  setOpen,
  trainerId,
}: DeleteTrainerDialogProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteTrainer,
    onSuccess: async (data) => {
      toast.success(data.success);

      queryClient.invalidateQueries({
        queryKey: ['trainers'],
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
            trainer
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteMutation.mutate(trainerId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTrainerDialog;
