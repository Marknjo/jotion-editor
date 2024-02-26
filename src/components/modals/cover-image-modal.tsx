'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

import { useCoverImage } from '@/hooks/use-cover-image';
import { useState } from 'react';
import { useEdgeStore } from '@/components/providers/edgestore-provider';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@convex/_generated/dataModel';
import { SingleImageDropzone } from '../global/single-image-dropzone';

export const CoverImageModal = () => {
  const update = useMutation(api.documents.update);
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);

      setFile(file);

      let res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res?.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semi-bold'>Cover Image</h2>
        </DialogHeader>

        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
