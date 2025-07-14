'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import BrandTable from './brand-tables';
import {
  fetchBrandList,
  IBrand,
  setBrandData
} from '@/redux/slices/brandSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BrandListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  const moduleId = '673f04ecd8f4b9fe9a44598a';
  const {
    brandListState: {
      loading: brandListLoading,
      data: eData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.brand);
  let exportData = 'false';
  useEffect(() => {
    dispatch(
      fetchBrandList({ page, pageSize, keyword, field, status, exportData })
    );
    dispatch(setBrandData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts

  // You can safely assume `eData` is populated now
  const brand: IBrand[] = eData;

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
    }
    dispatch(
      fetchBrandList({ page, pageSize, keyword, field, status, exportData })
    );
  };

  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchBrandList({
          page,
          pageSize,
          keyword,
          field,
          status,
          exportData: 'true'
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.brand;

      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        [
          'ID',
          'Name',
          'Slug',
          'Status',
          'Sequence No.',
          'Short Description',
          'Long Description',
          'Meta tag',
          'Meta Title',
          'Meta Description'
        ], // CSV headers
        ...exportData.map((item: any) => [
          item._id,
          item.name.en,
          item.slug,
          item.active,
          item.sequence,
          item.short_description.en,
          item.long_description.en,
          item.meta_tag,
          item.meta_title,
          item.meta_description
        ])
      ]
        .map((row) => row.join(','))
        .join('\n');

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'brand_data.csv');
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
        <div className="flex items-start justify-between ">
          <Heading title={`Brands`} description="" />
          {/* {empPermissions.permission.add ? ( */}
          <div>
            <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button>
            <Link
              href={'/dashboard/store/brands/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <BrandTable
          data={brand}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
