import { ScrollArea } from '@/components/ui/scroll-area';

import FaqForm from './productfaq-form';
import ProductFaqForm from './productfaq-form';

export default function ProductFaqViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <ProductFaqForm />
      </div>
    </ScrollArea>
  );
}
