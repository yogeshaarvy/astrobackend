'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ProductsTable from './product-tables';
import {
  fetchProductsList,
  IProducts,
  setProductsData
} from '@/redux/slices/productSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);
  const {
    productsListState: {
      loading: productsListLoading,
      data: pData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.productsdata);
  let exportData = 'false';
  useEffect(() => {
    dispatch(
      fetchProductsList({ page, pageSize, keyword, field, status, exportData })
    );
    dispatch(setProductsData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts

  // You can safely assume `pData` is populated now
  const products: IProducts[] = pData;
  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field required');
    }
    dispatch(
      fetchProductsList({ page, pageSize, keyword, field, status, exportData })
    );
  };
  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchProductsList({
          page,
          pageSize,
          keyword,
          field,
          status,
          exportData: 'true'
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.productsdata;
      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }
      // Generate CSV content
      const csvContent = [
        [
          'ID',
          'Name',
          'Active',
          'Slug',
          'Sequence',
          'Price',
          'Special Price',
          'Model No.',
          'Manufacture',
          'Categories',
          'Brand',
          'Filter Types',
          'Filter Values'
        ], // CSV headers

        ...exportData.map((item: IProducts) => {
          let returnarray = [
            item._id,
            item?.name,
            item?.active,
            item?.slug,
            item?.sequence,
            item?.price,
            item?.special_price,
            item?.model_no,
            item?.manufacture,
            item?.categories.map((cate: any) => cate?.name).join(' | '), // Add the processed categprires data
            item?.brand_name?.name, // Add the processed brands data
            item?.filtertypes.map((types: any) => types?.name).join(' | '), // Add the processed types data
            item?.filtervalues.map((val: any) => val?.short_name).join(' | ') // Add the processed values data
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
          <Heading title={`Products`} description="" />
          <div className="flex items-center">
            <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button>
            <Link
              href={'/dashboard/products/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <ProductsTable
          data={products}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
