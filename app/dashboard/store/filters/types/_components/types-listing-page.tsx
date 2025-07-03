'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TypesTable from './types-tables';
import {
  fetchTypesList,
  ITypes,
  setTypesData
} from '@/redux/slices/store/filtersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchBrandList } from '@/redux/slices/brandSlice';

export default function TypesListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  const {
    typesListState: {
      loading: typesListLoading,
      data: tData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.filter);
  useEffect(() => {
    dispatch(fetchTypesList({ page, pageSize, keyword, field, status }));
    dispatch(setTypesData(null));
  }, [page, pageSize, dispatch]);

  const types: ITypes[] = tData;
  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field required');
    }
    dispatch(fetchTypesList({ page, pageSize, keyword, field, status }));
  };

  // const handleExport = async () => {
  //   try {
  //     // Fetch the export data from the API
  //     const exportResponse = await dispatch(
  //       fetchTypesList({
  //         page,
  //         pageSize,
  //         keyword,
  //         field,
  //         status,
  //         exportData: 'true'
  //       })
  //     ).unwrap(); // Ensure this returns a promise that resolves the data
  //     const exportData = exportResponse.filterTypesdata;

  //     if (!exportData || exportData.length === 0) {
  //       alert('No data available to export');
  //       return;
  //     }

  //     // Generate CSV content
  //     const csvContent = [
  //       ['ID', 'NAME', 'SEQUENCE', 'SEARCH PAGE', 'TYPE', 'ACTIVE'], // CSV headers
  //       ...exportData.map((item: ITypes) => [
  //         item._id,
  //         item.name,
  //         item.sequence,
  //         item.searchPage,
  //         item.type,
  //         item.active
  //       ])
  //     ]
  //       .map((row) => row.join(','))
  //       .join('\n');

  //     // Create a blob and trigger download
  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.setAttribute('download', 'type_data.csv');
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error('Failed to export data:', error);
  //     alert('An error occurred while exporting data.');
  //   }
  // };
  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4">
        <div className="flex items-start justify-between pr-4">
          <Heading title={`Types`} description="" />

          <div className="flex items-center">
            {/* <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button> */}

            <Link
              href={'/dashboard/store/filters/types/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <TypesTable
          data={types}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
    // <div></div>
  );
}
