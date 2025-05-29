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
import { searchParams } from '@/lib/searchparams';
import {
  deleteHoroscopeDetail,
  IHoroscopeDetail
} from '@/redux/slices/horoscope/horoscopeDetailSlice';
import { AppDispatch } from '@/redux/store';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface CellActionProps {
  data: IHoroscopeDetail;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const horoscopesignId = searchParams.get('horoscopesignId') || '';
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onConfirm = async () => {
    dispatch(deleteHoroscopeDetail(data?._id || ''));
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
            onClick={() =>
              router.push(
                `/dashboard/horosope/detail/edit?id=${data._id}&&horoscopesignId=${horoscopesignId}`
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
