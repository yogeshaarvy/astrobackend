import { ScrollArea } from '@/components/ui/scroll-area';
import CategoryForm from './categories-form';

export default function CategoryViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <CategoryForm />
      </div>
    </ScrollArea>
  );
}
