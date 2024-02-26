'use client';

import React, { ElementRef, useRef, useState } from 'react';
import { ImageIcon, Smile, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import TextAreaAutoSize from 'react-textarea-autosize';

import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { IconsPicker } from './icons-picker';
import { useCoverImage } from '@/hooks/use-cover-image';

type Props = {
  initialData: Doc<'documents'>;
  preview?: boolean;
};

export const Toolbar = ({ initialData, preview }: Props) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const coverImage = useCoverImage();

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const toggleInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);

    update({
      id: initialData._id,
      title: value || 'Untitled',
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({ id: initialData._id });
  };

  return (
    <div className='pl-[54px] group relative'>
      {!!initialData.icon && !preview && (
        <div className='flex items-center gap-x-2 group/icon pt-6'>
          <IconsPicker onChange={onIconSelect}>
            <p className='text-6xl hover:opacity-75 transition'>
              {initialData?.icon || '🔴'}
            </p>
          </IconsPicker>

          <Button
            onClick={onRemoveIcon}
            className='rounded-full  opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs'
            variant='outline'
            size='icon'>
            <X className='size-4' />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className='text-6xl pt-6'>{initialData?.icon}</p>
      )}

      <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
        {!initialData?.icon && !preview && (
          <IconsPicker asChild onChange={onIconSelect}>
            <Button
              size='sm'
              variant='outline'
              className='text-muted-foreground text-xs'>
              <Smile className='size-4 mr-2' />
              Add Icon
            </Button>
          </IconsPicker>
        )}

        {!initialData?.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            size='sm'
            variant='outline'
            className='text-muted-foreground text-xs'>
            <ImageIcon className='size-4 mr-2' />
            Add Cover
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextAreaAutoSize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(event) => onInput(event.target.value)}
          className='text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none'
        />
      ) : (
        <div
          onClick={toggleInput}
          className='pb-[11.5px] text-5xl font-bold break-words outline-none  text-[#3f3f3f] dark:text-[#cfcfcf] '>
          {initialData.title}
        </div>
      )}
    </div>
  );
};
