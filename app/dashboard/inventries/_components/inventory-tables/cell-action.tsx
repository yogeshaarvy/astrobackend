'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IInventory, deleteInventory } from '@/redux/slices/inventoriesSlice';
import { IProducts } from '@/redux/slices/productSlice';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
interface CellActionProps {
  data: IProducts;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const onConfirm = async () => {
    // dispatch(deleteInventory(data?._id || ''));
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              if (data?.productype === 'variableproduct') {
                if (
                  data?.stockManagement?.stock_management_level ===
                  'product_level'
                ) {
                  router.push(
                    `/dashboard/inventries/product?productid=${
                      data._id
                    }&producttype=${data.productype}&stock_management=${data
                      ?.stockManagement
                      ?.stock_management_level}&productname=${data?.name}&variantid=${''}`
                  );
                } else {
                  router.push(
                    `/dashboard/inventries/product?productid=${data._id}&variantid=${data?.variants[0]?._id}&producttype=${data.productype}&stock_management=${data?.stockManagement?.stock_management_level}&productname=${data?.name}`
                  );
                }
              } else {
                router.push(
                  `/dashboard/inventries/product?productid=${
                    data._id
                  }&variantid=${''}&producttype=${
                    data.productype
                  }&productname=${data?.name}`
                );
              }
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Product Inventories
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
