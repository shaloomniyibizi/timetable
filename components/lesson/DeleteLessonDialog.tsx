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
import { DeleteLesson } from '@/lib/actions/lesson.action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface DeleteLessonDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  lessonId: string;
}
function DeleteLessonDialog({
  open,
  setOpen,
  lessonId,
}: DeleteLessonDialogProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteLesson,
    onSuccess: async (data) => {
      toast.success(data.success);

      queryClient.invalidateQueries({
        queryKey: ['lessons'],
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
            lesson
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteMutation.mutate(lessonId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteLessonDialog;
