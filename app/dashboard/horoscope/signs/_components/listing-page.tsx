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
  fetchHoroscopeList,
  IHoroscope,
  setHoroscopeListData
} from '@/redux/slices/home/horoscope';
import HoroscopeTable from './list-tables';
import HoroscopeListTable from './list-tables';

export default function HoroscopeListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    horoscopeList: {
      loading: ListLoading,
      data: horoscopeData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.horoscope);

  useEffect(() => {
    dispatch(fetchHoroscopeList({ page, pageSize }));
    dispatch(setHoroscopeListData(null));
  }, [dispatch, page, pageSize]);

  const horoscopeList: IHoroscope[] = horoscopeData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchHoroscopeList({ page, pageSize, keyword, field, active }));
  };

  const handleExport = async () => {
    dispatch(
      fetchHoroscopeList({
        page,
        pageSize,
        keyword,
        field,
        active,
        exportData: true
      })
    ).then((response: any) => {
      if (response?.error) {
        toast.error("Can't Export The Data Something Went Wrong");
      }
      const allHoroscopeList = response.payload?.horoscope;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'Horoscope';

      const ws = XLSX.utils.json_to_sheet(
        allHoroscopeList?.map((row: any) => {
          const id = row?._id || 'N/A';
          const active = row?.active || 'false';
          const title = row?.title || 'N/A';
          const sequence = row?.sequence || `N/A`;

          return {
            ID: id,
            Title: title,
            Active: active,
            Sequence: sequence
          };
        })
      );

      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const data = new Blob([excelBuffer], { type: fileType });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName + fileExtension;
      a.click();
    });
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Horoscope List (${totalCount})`} description="" />
          <div className="flex gap-5">
            {/* <Button variant="default" onClick={handleExport}>
              Export All
            </Button> */}

            <Link
              href={'/dashboard/horoscope/signs/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <HoroscopeListTable
          data={horoscopeList}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
