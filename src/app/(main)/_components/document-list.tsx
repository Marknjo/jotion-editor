import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GenericId } from 'convex/values';
import { FileIcon } from 'lucide-react';
import { useQuery } from 'convex/react';

import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { Item } from './item';
import { cn } from '@/lib/utils';

type Props = {
  parentDocumentId?: Id<'documents'>;
  level?: number;
  data?: Doc<'documents'>;
};

export const DocumentList = ({ parentDocumentId, level = 0, data }: Props) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />

        {level === 0 && (
          <>
            <Item.Skeleton />
          </>
        )}
      </>
    );
  }

  const onRedirect = (documentId: GenericId<'documents'>) => {
    router.push(`/documents/${documentId}`);
  };

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn('hidden text-sm font-medium text-muted-foreground/80', {
          'last:block': expanded,
          hidden: level === 0,
        })}>
        No Pages inside
      </p>

      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />

          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
