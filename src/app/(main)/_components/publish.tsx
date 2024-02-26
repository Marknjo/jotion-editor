import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Copy, ExternalLinkIcon, Globe } from 'lucide-react';
import Link from 'next/link';

import { Doc } from '@convex/_generated/dataModel';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { useOrigin } from '@/hooks/use-origin';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';

type Props = {
  initialData: Doc<'documents'>;
};
export const Publish = ({ initialData }: Props) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => {
      setIsSubmitting(false);
    });

    toast.promise(promise, {
      loading: 'Publishing note...',
      success: 'Note published',
      error: 'Failed to publish',
    });
  };

  const onUnPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => {
      setIsSubmitting(false);
    });

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished',
      error: 'Failed to unpublished',
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish
          {initialData.isPublished && (
            <Globe className='size-4 ml-2 text-sky-500' />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-72' align='end' alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Globe className='text-sky-500 animate-pulse size-4' />

              <p className='text-xs font-medium text-sky-500'>
                This note is live on the web
              </p>
            </div>

            <div className='flex items-center'>
              <input
                className='flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate'
                value={url}
                disabled
              />

              <Button
                onClick={onCopy}
                disabled={copied}
                className='h-8 rounded-none p-2'>
                {copied ? (
                  <Check className='size-4' />
                ) : (
                  <Copy className='size-4' />
                )}
              </Button>
              <Button
                onClick={onCopy}
                disabled={copied}
                className='h-8 rounded-l-none p-2'
                variant='outline'
                asChild>
                <Link href={url} target='_blank' referrerPolicy='no-referrer'>
                  <ExternalLinkIcon className='size-4' />
                </Link>
              </Button>
            </div>

            <Button
              size='sm'
              className='w-full text-xs'
              disabled={isSubmitting}
              onClick={onUnPublish}>
              Unpublish
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <Globe className='size-8 text-muted-foreground mb-2' />

            <p className='text-sm font-medium mb-2'>Publish this note</p>

            <span className='text-xs text-muted-foreground mb-4'>
              Share your work with others
            </span>

            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className='w-full text-xs'
              size='sm'>
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
