import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MidBanner from './_components/midbanner';

const page = () => {
  return (
    <ScrollArea className="h-full">
      <MidBanner />
    </ScrollArea>
  );
};

export default page;
