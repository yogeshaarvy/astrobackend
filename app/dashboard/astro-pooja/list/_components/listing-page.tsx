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
  fetchAstropoojaList,
  IAstropoojaList,
  setAstropoojaListData
} from '@/redux/slices/astropooja/list';
import AstropoojaListTable from './list-tables';

export default function AstropoojaListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    astropoojaList: {
      loading: ListLoading,
      data: astropoojaListData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.astropoojaList);

  useEffect(() => {
    dispatch(fetchAstropoojaList({ page, pageSize }));
    dispatch(setAstropoojaListData(null));
  }, [dispatch, page, pageSize]);

  const astropoojaList: IAstropoojaList[] = astropoojaListData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchAstropoojaList({ page, pageSize, keyword, field, active }));
  };

  const handleExport = async () => {
    dispatch(
      fetchAstropoojaList({
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
      const allAstropoojaList = response.payload?.astropoojaList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'astropujaList';

      const ws = XLSX.utils.json_to_sheet(
        allAstropoojaList?.map((row: any) => {
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
          <Heading title={`Astro-Puja List (${totalCount})`} description="" />
          <div className="flex gap-5">
            <Button variant="default" onClick={handleExport}>
              Export All
            </Button>

            <Link
              href={'/dashboard/astro-pooja/list/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <AstropoojaListTable
          data={astropoojaList}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
