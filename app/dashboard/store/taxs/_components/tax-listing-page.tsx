'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TaxTable from './tax-tables';
import { fetchTaxList, ITax, setTaxData } from '@/redux/slices/taxsSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TaxListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  let exportData = 'false';
  const {
    taxListState: {
      loading: taxListLoading,
      data: tData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.taxsdata);
  console.log('t data issssss', tData);
  useEffect(() => {
    dispatch(fetchTaxList({ page, pageSize, keyword, field, active }));
    dispatch(setTaxData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts

  // You can safely assume `tData` is populated now
  const tax: ITax[] = tData;
  const handleSearch = () => {
    dispatch(fetchTaxList({ page, pageSize, keyword, field, active }));
  };

  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchTaxList({
          page,
          pageSize,
          keyword,
          field,
          active
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.taxsData;

      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        ['ID', 'Name (Eng)', 'Name (Hi)', 'Rate', 'Active'], // CSV headers
        ...exportData.map((item: any) => [
          item._id,
          item.name.en,
          item.name.hi,
          item.rate,
          item.active
        ])
      ]
        .map((row) => row.join(','))
        .join('\n');

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'taxs_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('An error occurred while exporting data.');
    }
  };

  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4">
        <div className="flex items-start justify-between pr-4">
          <Heading title={`Tax`} description="" />
          <div className="flex items-center">
            {/* <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button> */}
            <Link
              href={'/dashboard/store/taxs/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <TaxTable
          data={tax}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
