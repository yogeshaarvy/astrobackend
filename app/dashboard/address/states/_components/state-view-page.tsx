import { ScrollArea } from '@/components/ui/scroll-area';
import StateForm from './state-form';

export default function StateViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <StateForm />
      </div>
    </ScrollArea>
  );
}
