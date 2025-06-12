import { ScrollArea } from '@/components/ui/scroll-area';
import RequestForm from './requested-form';

export default function TaxViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <RequestForm />
      </div>
    </ScrollArea>
  );
}
