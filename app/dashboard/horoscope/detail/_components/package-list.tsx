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
  fetchHoroscopeDetailList,
  type IHoroscopeDetail,
  setHoroscopeDetailData
} from '@/redux/slices/horoscope/horoscopeDetailSlice';
import HoroscopeDetailTable from './package-tables';

export default function HoroscopeDetailPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const horoscopesignId = searchParams.get('horoscopesignId') || '';
  console.log('Horocope list id in ui', horoscopesignId);
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = Number.parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    horoscopeDetailList: {
      loading: horoscopeDetailLoading,
      data: Horoscope = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.horoscopeDetail);

  useEffect(() => {
    dispatch(fetchHoroscopeDetailList({ page, pageSize, horoscopesignId }));
    dispatch(setHoroscopeDetailData(null));
  }, [page, pageSize]);

  const HoroscopeDetail: IHoroscopeDetail[] = Horoscope;

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
    }
    // dispatch(fetchAstroPackageList({ page, pageSize, keyword, field, active,astropoojaId }))
  };

  const handleExport = async () => {
    dispatch(
      fetchHoroscopeDetailList({
        page,
        pageSize,
        keyword,
        field,
        active,
        horoscopesignId,
        exportData: true
      })
    ).then((response: any) => {
      if (response?.error) {
        toast.error("Can't Export The Data Something Went Wrong");
      }
      const allHoroscopeDetail = response.payload?.horoscopeDetailList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'horoscope_detail';

      const ws = XLSX.utils.json_to_sheet(
        allHoroscopeDetail?.map((row: any) => {
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

          return {
            ID: id,
            title: title,
            desccription: desccription,
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
          <Heading title={`Horoscope Detail (${totalCount})`} description="" />
          <div className="flex gap-5">
            <Button variant="default" onClick={handleExport}>
              Export All
            </Button>
            <Link
              href={`/dashboard/horoscope/detail/add?horoscopesignId=${horoscopesignId}`}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <HoroscopeDetailTable
          data={HoroscopeDetail}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
