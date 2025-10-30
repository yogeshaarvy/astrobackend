'use client';

import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IConsultationsOrdersList } from '@/redux/slices/consultations/consultationsOrdersSlice';

interface CellActionProps {
  data: IConsultationsOrdersList;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const handleViewOrder = () => {
    window.open(
      `/dashboard/orders/consultation/view?id=${data?.orderId}`,
      '_blank'
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleViewOrder}
      className="hover:bg-muted"
      aria-label="View Order"
    >
      <Eye className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
};
