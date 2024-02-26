import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';
import React from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@clerk/clerk-react';

type Props = {
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
  id?: Id<'documents'>;
  documentIcon?: string;
  expanded?: boolean;
  onExpand?: () => void;
  active?: boolean;
  isSearch?: boolean;
  level?: number;
};

export const Item = ({
  onClick,
  label,
  icon: Icon,
  active,
  id,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: Props) => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const { user } = useUser();

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!id) return;

    const promise = archive({ id }).then(() => router.push('/documents'));

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note move to trash',
      error: 'Failed to archive note',
    });
  };

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();

    onExpand?.();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) return;

    const promise = create({ title: 'Untitled', parentDocument: id }).then(
      (docId) => {
        if (!expanded) {
          onExpand?.();
        }

        router.push(`/documents/${docId}`);
      }
    );

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New Note created!',
      error: 'Failed to create a new note',
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role='button'
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        {
          'bg-primary/5 text-primary': active,
        }
      )}>
      {!!id && (
        <div
          role='button'
          className='h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1'
          onClick={handleExpand}>
          <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
        </div>
      )}

      {documentIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>{documentIcon}</div>
      ) : (
        <>
          <Icon className='shrink-0 size-[18px] mr-2 text-muted-foreground' />
        </>
      )}

      <span className='truncate'>{label}</span>

      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1  rounded border bg-muted px-1.5 font-mono text--[10px] font-medium text-muted-foreground opacity-1000'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      )}

      {!!id && (
        <div className='ml-auto flex items-center gap-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role='button'
                className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'>
                <MoreHorizontal />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className='w-60'
              align='start'
              side='right'
              forceMount>
              <DropdownMenuItem onClick={onArchive}>
                <Trash className='h-4 w-4 mr-2' />
                Delete
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className='text-xs text-muted-foreground p-2'>
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            role='button'
            onClick={onCreate}
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'>
            <Plus className='h-4 w-4 text-muted-foreground' />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      className='flex gap-x-2 py-[3px]'>
      <Skeleton className='h-4 w-4' />
      <Skeleton className='h-4 w-[30%]' />
    </div>
  );
};
