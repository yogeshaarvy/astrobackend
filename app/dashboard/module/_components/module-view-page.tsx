
import { ScrollArea } from '@/components/ui/scroll-area';
import ModuleForm from './module-form';

export default function ModuleViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <ModuleForm />
      </div>
    </ScrollArea>
  );
}
