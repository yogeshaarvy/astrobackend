'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { fetchSlidersList, ISliders } from '@/redux/slices/slidersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import SlidersTable from './sliders-tables';

export default function SliderListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  // Fetching query params from the URL
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  // Selector for sliders state
  const {
    slidersListState: {
      loading: slidersListLoading,
      data: cData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.slider);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    dispatch(fetchSlidersList({ page, pageSize, keyword, field, status }));
    // dispatch(setTypesData(null));
  }, [page, pageSize, keyword, field, status, dispatch]);

  const sliders: ISliders[] = cData;
  // Handle search action
  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field are required');
      return;
    }
    dispatch(fetchSlidersList({ page, pageSize, keyword, field, status }));
  };

  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pr-4">
          <Heading title={`Sliders`} description="" />

          <div className="flex items-center">
            {/* Export Button */}
            <Button className="mx-5 py-4" variant="default">
              Export
            </Button>

            {/* Add New Link */}
            <Link
              href={'/dashboard/home/sliders/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>

        <Separator />

        {/* Sliders Table */}
        <SlidersTable
          data={sliders as ISliders[]}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
