import React from 'react';
import NewArrivals from './newArrivals';

import { ScrollArea } from '@/components/ui/scroll-area';

const page = () => {
  return (
    <ScrollArea className="h-full">
      <NewArrivals />
    </ScrollArea>
  );
};

export default page;
