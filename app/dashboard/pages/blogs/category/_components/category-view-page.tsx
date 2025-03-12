import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import CategoryForm from './category-form';

export default function CategoryViewPage() {
  return (
    <ScrollArea>
      <div className="flex-1 space-x-4 p-8">
        <CategoryForm />
      </div>
    </ScrollArea>
  );
}
