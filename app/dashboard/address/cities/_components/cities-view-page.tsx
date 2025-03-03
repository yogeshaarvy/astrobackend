import { ScrollArea } from '@/components/ui/scroll-area';
import CitiesForm from './cities-form';

export default function CitiesViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <CitiesForm />
      </div>
    </ScrollArea>
  );
}
