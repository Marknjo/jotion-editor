import React from 'react';
import { Navbar } from './_components/navbar';

type Props = {
  children: React.ReactNode;
};

function MarketingLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className='min-h-full pt-40 dark:bg-[#1f1f1f]'>{children}</main>
    </>
  );
}
export default MarketingLayout;
