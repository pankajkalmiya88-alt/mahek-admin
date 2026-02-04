import { useStore } from 'zustand';

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
import { confirmationStore } from '@/store/store';
import { cn } from '@/lib/utils';

export const ModalType = {
  DESTRUCTIVE: 'destructive',
} as const;

const Confirmation = () => {
  const { open, data, closeConfirmation } = useStore(confirmationStore);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{data?.title ?? 'Are you sure?'}</AlertDialogTitle>

          <AlertDialogDescription>
            {data?.description ?? 'Do you want to continue?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={() => closeConfirmation(false)}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className={cn({
              'border border-destructive bg-white text-destructive hover:bg-destructive hover:text-white cursor-pointer':
                data?.type === ModalType.DESTRUCTIVE,
            })}
            onClick={() => closeConfirmation(true)}
          >
            {data?.type === ModalType.DESTRUCTIVE ? 'Delete' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Confirmation;
