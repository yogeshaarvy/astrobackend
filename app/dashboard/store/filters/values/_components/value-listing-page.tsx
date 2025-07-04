'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ValuesTable from './value-tables';
import {
  fetchValuesList,
  IValues,
  setValuesData
} from '@/redux/slices/store/filtersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ValuesListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  let exportData = 'false';
  const {
    valuesListState: {
      loading: valuesListLoading,
      data: tData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.filter);
  useEffect(() => {
    dispatch(
      fetchValuesList({ page, pageSize, keyword, field, status, exportData })
    );
    dispatch(setValuesData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts

  // You can safely assume `tData` is populated now
  const values: IValues[] = tData;
  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field required');
    }
    dispatch(
      fetchValuesList({ page, pageSize, keyword, field, status, exportData })
    );
  };

  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchValuesList({
          page,
          pageSize,
          keyword,
          field,
          status,
          exportData: 'true'
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.filterValuesdata;

      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        ['ID', 'Short Name', 'Active', 'Full Name', 'Sequence', 'Types'], // CSV headers

        ...exportData.map((item: IValues) => {
          // Process the types array into a single string
          let typesColumn = '';

          if (item.types != '') {
            typesColumn = Array.isArray(item.types)
              ? item.types.map((type: any) => type?.name).join(' | ') // Join type names with commas
              : ''; // Handle cases where types is undefined or not an array
          }
          let returnarray = [
            item._id,
            item.short_name,
            item.active,
            item.full_name,
            item.sequence,
            typesColumn // Add the processed types data
          ];

          // Construct the CSV row
          return returnarray;
        })
      ]
        .map((row) => row.join(',')) // Convert each row to a CSV string
        .join('\n'); // Combine all rows into a single CSV content

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'values_data.csv');
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
          <Heading title={`Values (${totalCount})`} description="" />
          <div className="flex items-center">
            {/* <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button> */}
            <Link
              href={'/dashboard/store/filters/values/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <ValuesTable
          data={values}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
