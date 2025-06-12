'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import RequestedTable from './register-tables';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchRequestList,
  IRequest,
  setRequestData
} from '@/redux/slices/astrologer_requestsSlice';

export default function RequestedListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  let exportData = 'false';
  const {
    requestListState: {
      loading: requestListLoading,
      data: tData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.requestsData);
  console.log('requestes data is ', tData);
  useEffect(() => {
    dispatch(
      fetchRequestList({ page, pageSize, keyword, field, status, exportData })
    );
    dispatch(setRequestData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts

  // You can safely assume `tData` is populated now
  const requestData: IRequest[] = tData;
  const handleSearch = () => {
    dispatch(
      fetchRequestList({ page, pageSize, keyword, field, status, exportData })
    );
  };

  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchRequestList({
          page,
          pageSize,
          keyword,
          field,
          status,
          exportData: 'true'
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.requestsData || []; // Adjust based on your API response structure

      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        ['ID', 'Name', 'Rate', 'Active'], // CSV headers
        ...exportData.map((item: any) => [
          item._id,
          item.name,
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
      link.setAttribute('download', 'requests_data.csv');
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
          <Heading title={`Requested Astrologers`} description="" />
          <div className="flex items-center">
            {/* <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button> */}
            {/* <Link
              href={'/dashboard/request/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link> */}
          </div>
        </div>
        <Separator />
        <RequestedTable
          data={requestData}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
