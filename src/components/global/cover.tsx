'use client';

import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@convex/_generated/dataModel';
import { useEdgeStore } from '../providers/edgestore-provider';
import { Skeleton } from '../ui/skeleton';

type Props = {
  url?: string;
  preview?: boolean;
};

export const Cover = ({ url, preview }: Props) => {
  const { edgestore } = useEdgeStore();

  const removerCoverImage = useMutation(api.documents.removerCoverImage);
  const params = useParams();

  const coverImage = useCoverImage();

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }

    removerCoverImage({
      id: params.documentId as Id<'documents'>,
    });
  };

  return (
    <div
      className={cn('relative w-full h-[35vh] group  ', {
        'h-[12vh]': !url,
        'bg-muted': url,
      })}>
      {!!url && <Image src={url} alt='Cover' className='object-cover' fill />}

      {!!url && !preview && (
        <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
          <Button
            onClick={() => {
              coverImage.onReplace(url);
            }}
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'>
            <ImageIcon className='size-4 mr-2' />
            Change cover
          </Button>

          <Button
            onClick={onRemove}
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'>
            <X className='size-4 mr-2' />
            Remove cover
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className='w-full h-[12vh]' />;
};
