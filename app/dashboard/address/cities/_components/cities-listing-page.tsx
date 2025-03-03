'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CitiesTable from './cities-tables';
import {
  fetchCitiesList,
  ICities,
  setCitiesData
} from '@/redux/slices/citiesSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CitiesListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  let exportData = 'false';
  const {
    CitiesListState: {
      loading: citiesListLoading,
      data: tData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.Citiesdata);
  useEffect(() => {
    dispatch(fetchCitiesList({ page, pageSize, keyword, field, exportData }));
    dispatch(setCitiesData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts

  // You can safely assume `tData` is populated now
  const cities: ICities[] = tData;
  const handleSearch = () => {
    dispatch(fetchCitiesList({ page, pageSize, keyword, field, exportData }));
  };

  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchCitiesList({
          page,
          pageSize,
          keyword,
          field,

          exportData: 'true'
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.allCitiesList;

      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        [
          'id',
          'name',
          'state_id',
          'state_code',
          'country_id',
          'country_code',
          'londitude',
          'latitude',
          'flag',
          'wikiDataId'
        ], // CSV headers
        ...exportData.map((item: any) => [
          item.id,
          item.name,
          item.state_id,
          item.state_code,
          item.country_id,
          item.country_code,
          item.londitude,
          item.latitude,
          item.flag,
          item.wikiDataId
        ])
      ]
        .map((row) => row.join(','))
        .join('\n');

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'cities_data.csv');
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
          <Heading title={`Cities`} description="" />
          <div className="flex items-center">
            <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button>
            <Link
              href={'/dashboard/address/cities/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <CitiesTable
          data={cities}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
