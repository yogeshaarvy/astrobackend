import React from 'react';
import Sales from './_components/sales';

import { ScrollArea } from '@/components/ui/scroll-area';

const page = () => {
  return (
    <ScrollArea className="h-full">
      <Sales />
    </ScrollArea>
  );
};

export default page;
