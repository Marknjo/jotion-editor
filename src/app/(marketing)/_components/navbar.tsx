'use client';

import { useConvexAuth } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import Link from 'next/link';
import { useScrollTop } from '@/hooks/use-scroll-top';

import { ModeToggle } from '@/components/global/mode-toggle';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/global/spinner';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        'z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6',
        {
          'border-b shadow-sm': scrolled,
        }
      )}>
      <Logo />

      <div className='md:ml-auto flex md:justify-end justify-between w-full items-center gap-x-2'>
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            <Button variant='ghost' size='sm' asChild>
              <SignInButton mode='modal'>Login</SignInButton>
            </Button>

            <Button size='sm' asChild>
              <SignInButton mode='modal'>Get Jotion Free</SignInButton>
            </Button>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/documents'>Enter Jotion</Link>
            </Button>

            <UserButton afterSignOutUrl='/' />
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};
