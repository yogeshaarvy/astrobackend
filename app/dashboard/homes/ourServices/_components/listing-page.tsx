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
  fetchOurServicesList,
  IOurServices,
  setOurServicesListData
} from '@/redux/slices/home/ourServices';
import OurServicesListTable from './list-tables';

export default function OurServicesListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    ourServicesList: {
      loading: ListLoading,
      data: ourServicesData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.ourService);

  useEffect(() => {
    dispatch(fetchOurServicesList({ page, pageSize }));
    dispatch(setOurServicesListData(null));
  }, [dispatch, page, pageSize]);

  const ourServicesList: IOurServices[] = ourServicesData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchOurServicesList({ page, pageSize, keyword, field, active }));
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Our Services List (${totalCount})`} description="" />
          <div className="flex gap-5">
            <Link
              href={'/dashboard/homes/ourServices/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <OurServicesListTable
          data={ourServicesList}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
