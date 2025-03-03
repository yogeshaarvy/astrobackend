import { ScrollArea } from '@/components/ui/scroll-area';
import PromoForm from './promo-form';

export default function TaxViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <PromoForm />
      </div>
    </ScrollArea>
  );
}
