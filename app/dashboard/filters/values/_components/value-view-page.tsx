import { ScrollArea } from '@/components/ui/scroll-area';
import ValuesForm from './value-form';

export default function ValuesViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <ValuesForm />
      </div>
    </ScrollArea>
  );
}
