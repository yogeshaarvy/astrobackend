import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import HoroscopeDetailForm from './package-form';

export default function PackageViewPage() {
  return (
    <ScrollArea>
      <div className="flex-1 space-x-4 p-8">
        <HoroscopeDetailForm />
      </div>
    </ScrollArea>
  );
}
