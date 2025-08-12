import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import AstroPackageForm from './package-form';

export default function PackageViewPage() {
  return (
    <ScrollArea>
      <div className="flex-1 space-x-4 p-8">
        <AstroPackageForm />
      </div>
    </ScrollArea>
  );
}
