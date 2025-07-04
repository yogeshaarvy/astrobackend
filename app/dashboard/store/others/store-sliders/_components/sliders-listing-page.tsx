'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  fetchSlidersList,
  ISliders,
  setSliderData
} from '@/redux/slices/slidersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import SlidersTable from './sliders-tables';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export default function SliderListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  const {
    slidersListState: {
      loading: slidersListLoading,
      data: cData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.slider);

  useEffect(() => {
    dispatch(fetchSlidersList({ page, pageSize }));
    dispatch(setSliderData(null));
  }, [page, pageSize, dispatch]);

  const sliders: ISliders[] = cData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchSlidersList({ page, pageSize, keyword, field, active }));
  };

  const handleExport = async () => {
    dispatch(
      fetchSlidersList({
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
      const allsliderList = response.payload?.slider;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'Slider';

      const ws = XLSX.utils.json_to_sheet(
        allsliderList?.map((row: any) => {
          const id = row?._id || 'N/A';
          const active = row?.active || 'false';
          const sequence = row?.sequence || `N/A`;

          return {
            ID: id,
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
          <Heading title={`Sliders List (${totalCount})`} description="" />
          <div className="flex gap-5">
            {/* <Button variant="default" onClick={handleExport}>
              Export All
            </Button> */}

            <Link
              href={'/dashboard/store/others/store-sliders/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <SlidersTable
          data={sliders}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
