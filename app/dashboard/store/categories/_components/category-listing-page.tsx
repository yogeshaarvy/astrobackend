'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import CategoeyTable from './categories-table';
import {
  fetchCategoryList,
  ICategory,
  setCategoryData
} from '@/redux/slices/store/categoriesSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { TCurrentEmployee, TCurrentEmployeePermission } from '@/types/globals';
import EmployeeNotAllwoed from '@/components/not-allowed';
import EmployeeNotAllowedToAdd from '@/components/not-allowed-add';
import { toast } from 'sonner';

// type TEmployeeListingPage = {
//   currentEmp: TCurrentEmployee;
//   empPermissions: TCurrentEmployeePermission;
// };

export default function CategoryListingPage() {
// {
//   currentEmp,
//   empPermissions
// }: TEmployeeListingPage
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
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
  useEffect(() => {
    dispatch(
      fetchCategoryList({
        page,
        pageSize,
        keyword,
        field,
        active,
        exportData: true,
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
        active,
        exportData: true,
        entityId: ''
      })
    );
  };

  const handleExport = async () => {
    dispatch(
      fetchCategoryList({
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
      const allProductsCategory = response.payload?.categoryList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'product_category';

      const ws = XLSX.utils.json_to_sheet(
        allProductsCategory?.map((row: any) => {
          const id = row?._id || 'N/A';
          const active = row?.active || 'false';
          const createdAt = row?.createdAt
            ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                hour12: false
              })
            : 'N/A';
          const updatedAt = row?.updatedAt
            ? new Date(row.updatedAt).toLocaleDateString('en-GB', {
                hour12: false
              })
            : 'N/A';
          const Name = row?.name || 'N/A';
          const Slug = row?.slug || 'N/A';
          const sequence = row?.sequence || `N/A`;

          return {
            ID: id,
            Name: Name,
            Slug: Slug,
            Active: active,
            Sequence: sequence,
            MetaTitle: row?.metaTitle,
            MetaDescription: row?.metaDescription,
            MetaKeyword: row?.metaKeywords,
            Created_At: createdAt,
            Updated_At: updatedAt
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

  // if (empPermissions?.permission?.view === false) {
  //   return (
  //     <EmployeeNotAllwoed
  //       cardTitle={'Access Denied'}
  //       cardDescription={'You do not have permission to view this page'}
  //       cardContent={
  //         'If you believe this is an error, please contact your administrator or support team.'
  //       }
  //     />
  //   );
  // } else {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between ">
          <Heading title={`Categories (${totalCount})`} description="" />
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
              href={'/dashboard/store/categories/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          {/* ) : (
            <EmployeeNotAllowedToAdd />
          )} */}
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
