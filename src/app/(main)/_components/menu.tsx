import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  documentId: Id<'documents'>;
};
export const Menu = ({ documentId }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note trashed',
      error: 'Failed to move note to the trash!',
    });

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-60'
        align='end'
        alignOffset={8}
        forceMount>
        <DropdownMenuItem
          onClick={onArchive}
          role='button'
          className='cursor-pointer'>
          <Trash className='size-4 mr-2' />
          Delete
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className='text-xs text-muted-foreground p-2'>
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className='size-6 mr-2 mt-2' />;
};
