import React from 'react';
import Category from './_components/categories';

import { ScrollArea } from '@/components/ui/scroll-area';

const page = () => {
  return (
    <ScrollArea className="h-full">
      <Category />
    </ScrollArea>
  );
};

export default page;
