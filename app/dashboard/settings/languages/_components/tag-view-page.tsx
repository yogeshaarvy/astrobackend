import { ScrollArea } from '@/components/ui/scroll-area';
import TagForm from './tag-form';

export default function TagViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <TagForm />
      </div>
    </ScrollArea>
  );
}
