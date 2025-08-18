import { ScrollArea } from '@/components/ui/scroll-area';
// import TypesForm from './types-form';
import SlidersForm from './sliders-form';

export default function SlidersViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <SlidersForm />
      </div>
    </ScrollArea>
  );
}
