'use client';

import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Spinner } from '@/components/global/spinner';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';

type Props = {};
export const Heading = (props: Props) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <header className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
        <span className='underline'>Jotion</span>
      </h1>

      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        Jotion is the connected workspace where <br /> better, faster work
        happens.
      </h3>

      {isLoading && (
        <div className='w-full flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}

      {isAuthenticated && !isLoading && (
        <Link href='/documents'>
          <Button>
            Enter Jotion
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </Link>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button>
            Get Jotion free
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </SignInButton>
      )}
    </header>
  );
};
