'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import EmployeeNotAllwoed from '@/components/not-allowed';
import { TCurrentEmployee, TCurrentEmployeePermission } from '@/types/globals';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  fetchVastuSliderList,
  IVastuSlider,
  setVastuSliderListData
} from '@/redux/slices/vastushastr/vastuSlider';
import HomeBannerListTable from './list-tables';

export default function VastuSliderListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    vastuSliderList: {
      loading: vastuSliderListLoading,
      data: vastuSliderData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.vastuSlider);

  useEffect(() => {
    dispatch(fetchVastuSliderList({ page, pageSize }));
    dispatch(setVastuSliderListData(null));
  }, [dispatch, page, pageSize]);

  const vastuSliderList: IVastuSlider[] = vastuSliderData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchVastuSliderList({ page, pageSize, keyword, field, active }));
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Vastu Banner List (${totalCount})`} description="" />
          <div className="flex gap-5">
            <Link
              href={'/dashboard/vastu-shastr/slider/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <HomeBannerListTable
          data={vastuSliderList}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
