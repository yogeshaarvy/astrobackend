import { ScrollArea } from '@/components/ui/scroll-area';
import CourseForm from './course-form';

export default function CourseViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <CourseForm />
      </div>
    </ScrollArea>
  );
}
