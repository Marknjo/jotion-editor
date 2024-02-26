'use client';

import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Title } from './title';
import { Banner } from './banner';
import { Menu } from './menu';
import { Publish } from './publish';

type Props = {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

export const Navbar = ({ isCollapsed, onResetWidth }: Props) => {
  const params = useParams();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
  });

  if (document === undefined) {
    return (
      <nav className='bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between gap-x-4'>
        <Title.Skeleton />

        <div className='flex items-center gap-x-2'>
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  const currentDoc = document as Doc<'documents'>;

  return (
    <>
      <nav className='bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='size-6 text-muted-foreground'
          />
        )}

        <div className='flex items-center justify-between w-full'>
          <Title initialData={currentDoc} />

          <div className='flex items-center gap-x-2'>
            <Publish initialData={currentDoc} />

            <Menu documentId={currentDoc._id} />
          </div>
        </div>
      </nav>

      {currentDoc.isArchived && <Banner documentId={currentDoc._id} />}
    </>
  );
};
