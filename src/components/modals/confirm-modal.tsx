import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

type Props = {
  redirectTo?: string;
  children: ReactNode;
  onConfirm: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ConfirmModal = ({ children, onConfirm, redirectTo }: Props) => {
  const router = useRouter();

  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    onConfirm(event);

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='flex flex-row justify-center items-center gap-3'>
          <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction className='mt-2' onClick={handleConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
