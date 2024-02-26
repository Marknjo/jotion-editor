import React, { ChangeEvent, useRef, useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  initialData: Doc<'documents'>;
};

export const Title = ({ initialData }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.documents.update);

  const [title, setTitle] = useState(initialData.title || 'Untitled');
  const [isEditing, setIsEditing] = useState(false);

  const toggleInput = () => {
    let timer;

    clearTimeout(timer);

    setTitle(initialData.title);
    setIsEditing(true);
    timer = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    update({
      id: initialData._id,
      title: event.target.value || 'Untitled',
    });
  };

  const onKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className='flex items-center gap-x-1'>
      {!!initialData.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={toggleInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeydown}
          value={title}
          className='h-7 px-2 focus-visible:ring-transparent'
        />
      ) : (
        <Button
          onClick={toggleInput}
          variant='ghost'
          size='sm'
          className='font-normal h-auto p-1'>
          {initialData.title}
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSKeleton() {
  return <Skeleton className='h-6 w-24 rounded-md' />;
};
