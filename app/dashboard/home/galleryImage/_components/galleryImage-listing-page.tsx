'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  fetchGalleryImagesList,
  IGalleryImages,
  setGalleryImagesData
} from '@/redux/slices/store/gallerySlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import GalleryImagesTable from './galleryImage-tables';
import { toast } from 'sonner';

export default function GalleryImageListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  // Selector for sliders state
  const {
    galleryImagesListState: {
      loading: galleryImagesListLoading,
      data: cData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.galleryImage);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    dispatch(fetchGalleryImagesList({ page, pageSize }));
    dispatch(setGalleryImagesData(null));
  }, [page, pageSize, dispatch]);

  const galleryImages: IGalleryImages[] = cData;

  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field are required');
      return;
    }
    dispatch(
      fetchGalleryImagesList({ page, pageSize, keyword, field, active })
    );
  };

  const handleExport = async () => {
    dispatch(
      fetchGalleryImagesList({
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
      const allsliderList = response.payload?.galleryimage;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'Shop_Purpose';

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
      <div className="mr-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pr-4">
          <Heading title={`GalleryImages (${totalCount})`} description="" />

          <div className="flex items-center">
            {/* Export Button */}
            <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export All
            </Button>

            {/* Add New Link */}
            <Link
              href={'/dashboard/home/galleryImage/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>

        <Separator />

        {/* Sliders Table */}
        <GalleryImagesTable
          data={galleryImages as IGalleryImages[]}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
