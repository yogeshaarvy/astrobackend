import { ScrollArea } from '@/components/ui/scroll-area';
import DepartmentForm from './department-form';

export default function DepartmentViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <DepartmentForm />
      </div>
    </ScrollArea>
  );
}
