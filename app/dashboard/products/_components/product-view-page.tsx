import { ScrollArea } from '@/components/ui/scroll-area';
import ProductsForm from './product-form';

export default function ProductsViewPage() {
  return (
    <>
      <div className="flex-1 space-y-4 p-8">
        <ProductsForm />
      </div>
    </>
  );
}
