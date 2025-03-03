import { ScrollArea } from '@/components/ui/scroll-area';

import FaqForm from './faq-form';

export default function FaqViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <FaqForm />
      </div>
    </ScrollArea>
  );
}
