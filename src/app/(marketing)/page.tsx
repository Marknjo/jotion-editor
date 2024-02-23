import { Button } from '@/components/ui/button';
import { Heading } from './_components/heading';
import { Heros } from './_components/heros';
import { Footer } from './_components/footer';

export default function MarketingPage() {
  return (
    <div className='min-h-full flex flex-col'>
      <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 p-10'>
        <Heading />

        <Heros />

        <Footer />
      </div>
    </div>
  );
}
