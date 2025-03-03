'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CategoeyTable from './categories-table';
import {
  fetchCategoryList,
  ICategory,
  setCategoryData
} from '@/redux/slices/categoriesSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';

export default function CategoryListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  const {
    categoryListState: {
      loading: categoryListLoading,
      data: cData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.category);
  let exportData = 'false';
  useEffect(() => {
    dispatch(
      fetchCategoryList({
        page,
        pageSize,
        keyword,
        field,
        status,
        exportData,
        entityId: ''
      })
    );
    dispatch(setCategoryData(null));
  }, [page, pageSize, dispatch]);
  // You can safely assume `cData` is populated now
  const category: ICategory[] = cData;

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
    }
    dispatch(
      fetchCategoryList({
        page,
        pageSize,
        keyword,
        field,
        status,
        exportData,
        entityId: ''
      })
    );
  };

  const handleExport = async () => {
    try {
      const response = await dispatch(
        fetchCategoryList({
          page: 1,
          pageSize: 1000,
          keyword,
          field,
          status,
          exportData: 'true',
          entityId: ''
        })
      ).unwrap(); // Logs resolved payload

      const exportData = response?.categoriesdata || [];
      if (!exportData.length) {
        alert('No data available to export');
        return;
      }

      const csvContent = [
        [
          'ID',
          'Name',
          'Slug',
          'Status',
          'Parent',
          'Sequence No.',
          'Short Description',
          'Long Description',
          'Meta tag',
          'Meta Title',
          'Meta Description'
        ],
        ...exportData.map((item: any) => [
          item._id,
          item.name,
          item.slug,
          item.active,
          item.parent,
          item.sequence,
          item.short_description,
          item.long_description,
          item.meta_tag,
          item.meta_title,
          item.meta_description
        ])
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'brand_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error fetching data for export:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between ">
          <Heading title={`Categories`} description="" />
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
              href={'/dashboard/categories/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <CategoeyTable
          data={category}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
// }
