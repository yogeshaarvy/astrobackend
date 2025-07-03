'use client';
import { useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';

import EmployeeNotAllwoed from '@/components/not-allowed';
import { TCurrentEmployee, TCurrentEmployeePermission } from '@/types/globals';
// import EmployeeNotAllowedToAdd from '@/components/not-allowed-add';
import BlogsCategoryTable from './category-tables';
import {
  fetchBlogsCategoryList,
  IBlogsCategory,
  setBlogsCategoryData
} from '@/redux/slices/pages/bloges/categorySlice';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// type TEmployeeListingPage = {
//   currentEmp: TCurrentEmployee
//   empPermissions: TCurrentEmployeePermission
// };

export default function BlogsCategoryListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);
  // const moduleId = '673f04ecd8f4b9fe9a44598a';

  const {
    blogsCategoryList: {
      loading: blogsCategoryLoading,
      data: cData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.blogs);

  // UseEffect To fetch the Employee Permission
  // useEffect(() => {
  //   dispatch(fetchCurrentModulePermission(moduleId));
  // }, [])

  useEffect(() => {
    dispatch(fetchBlogsCategoryList({ page, pageSize }));
    dispatch(setBlogsCategoryData(null));
  }, [page, pageSize]);

  // You can safely assume `eData` is populated now
  const blogsCategory: IBlogsCategory[] = cData;

  const handleSearch = () => {
    if ((!field && keyword) || (!keyword && field)) {
      alert('Both keyword and field is required to search with keyword');
    }
    dispatch(
      fetchBlogsCategoryList({ page, pageSize, keyword, field, active })
    );
  };

  const handleExport = async () => {
    dispatch(
      fetchBlogsCategoryList({
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
      const allBlogsCategory = response.payload?.blogsCategoryList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'blogs_category';

      const ws = XLSX.utils.json_to_sheet(
        allBlogsCategory?.map((row: any) => {
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
          const blogsName = row?.name || 'N/A';
          const blogsSlug = row?.slug || 'N/A';
          const sequence = row?.sequence || `N/A`;

          return {
            ID: id,
            Name: blogsName,
            Slug: blogsSlug,
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
  //     <EmployeeNotAllwoed cardTitle={"Access Denied"} cardDescription={"You do not have permission to view this page"} cardContent={"If you believe this is an error, please contact your administrator or support team."} />
  //   );
  // } else {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Blogs Category (${totalCount})`} description="" />
          <div className="flex gap-5">
            {/* <Button variant="default" onClick={handleExport}>
              Export All
            </Button> */}
            <Link
              href={'/dashboard/blogs/categories/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <BlogsCategoryTable
          data={blogsCategory}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
