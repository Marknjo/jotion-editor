'use client';

import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { Spinner } from '@/components/global/spinner';
import { Navigation } from './_components/navigation';
import { SearchCommand } from '@/components/global/search-command';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className='h-full flex dark:bg-[#1f1f1f]'>
      <Navigation />

      <main className='h-full flex-1 overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};
export default MainLayout;
