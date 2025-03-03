import { ScrollArea } from '@/components/ui/scroll-area';
import BrandForm from './brand-form';

export default function BrandViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BrandForm />
      </div>
    </ScrollArea>
  );
}
