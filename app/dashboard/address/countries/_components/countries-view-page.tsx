import { ScrollArea } from '@/components/ui/scroll-area';
// import TypesForm from './types-form';
import CountriesForm from './countries-form';

export default function CountriesViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <CountriesForm />
      </div>
    </ScrollArea>
  );
}
