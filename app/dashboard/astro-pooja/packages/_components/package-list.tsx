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
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  fetchAstroPackageList,
  type IAstroPackage,
  setAstroPackageData
} from '@/redux/slices/astropooja/package';
import AstroPackageTable from './package-tables';

export default function AstroPackagePage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const astropoojaId = searchParams.get('astropoojaId') || '';
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = Number.parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    astroPackageList: {
      loading: astroPackageLoading,
      data: astropoojaPackage = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.astroPackage);

  useEffect(() => {
    dispatch(fetchAstroPackageList({ page, pageSize, astropoojaId }));
    dispatch(setAstroPackageData(null));
  }, [page, pageSize]);

  const astroPackage: IAstroPackage[] = astropoojaPackage;

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
    }
    // dispatch(fetchAstroPackageList({ page, pageSize, keyword, field, active,astropoojaId }))
  };

  const handleExport = async () => {
    dispatch(
      fetchAstroPackageList({
        page,
        pageSize,
        keyword,
        field,
        active,
        astropoojaId,
        exportData: true
      })
    ).then((response: any) => {
      if (response?.error) {
        toast.error("Can't Export The Data Something Went Wrong");
      }
      const allAstroPackage = response.payload?.astroPackageList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'astro_package';

      const ws = XLSX.utils.json_to_sheet(
        allAstroPackage?.map((row: any) => {
          const id = row?._id || 'N/A';
          const active = row?.active || 'false';
          const createdAt = row?.createdAt
            ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                hour12: false
              })
            : 'N/A';
          const updatedAt = row?.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString('en-GB', {
                hour12: false
              })
            : 'N/A';
          const title = row?.title || 'N/A';
          const desccription = row?.desccription || 'N/A';
          const price = row?.price || `N/A`;

          return {
            ID: id,
            title: title,
            desccription: desccription,
            price: price,
            Created_At: createdAt,
            Updated_At: updatedAt
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
          <Heading
            title={`Astro-Puja Package (${totalCount})`}
            description=""
          />
          <div className="flex gap-5">
            <Button variant="default" onClick={handleExport}>
              Export All
            </Button>
            <Link
              href={`/dashboard/astro-pooja/packages/add?astropoojaId=${astropoojaId}`}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <AstroPackageTable
          data={astroPackage}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
