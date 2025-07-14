import { ScrollArea } from '@/components/ui/scroll-area';
import TypesForm from './types-form';

export default function TypesViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <TypesForm />
      </div>
    </ScrollArea>
  );
}
