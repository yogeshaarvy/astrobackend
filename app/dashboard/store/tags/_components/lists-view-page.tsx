import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import TagsForm from './lists-form';

export default function ListViewPage() {
  return (
    <>
      {/* <ScrollArea> */}
      <div className="flex-1 space-x-4 p-8">
        <TagsForm />
      </div>
      {/* </ScrollArea> */}
    </>
  );
}
