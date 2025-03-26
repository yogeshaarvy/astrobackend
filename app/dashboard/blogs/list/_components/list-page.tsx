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
import {
  fetchBlogsList,
  IBlogs,
  setBlogsListData
} from '@/redux/slices/pages/bloges/categorySlice';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import BlogsListTable from './list-tables';

// type TEmployeeListingPage = {
//   currentEmp: TCurrentEmployee
//   empPermissions: TCurrentEmployeePermission
// };

export default function BlogsListPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const active = searchParams.get('active') || '';
  const field = searchParams.get('field') || '';

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    blogsList: {
      loading: blogsListLoading,
      data: blogsData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogsList({ page, pageSize }));
    dispatch(setBlogsListData(null));
  }, [page, pageSize]);

  const blogsList: IBlogs[] = blogsData;

  const handleSearch = () => {
    if (!field || !keyword) {
      toast.warning(
        'Both Keyword and Field is required to Search with Keyword'
      );
    }
    dispatch(fetchBlogsList({ page, pageSize, keyword, field, active }));
  };

  const handleExport = async () => {
    dispatch(
      fetchBlogsList({
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
      const allWisodmList = response.payload?.blogsList;
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = 'blogs_list';

      const ws = XLSX.utils.json_to_sheet(
        allWisodmList?.map((row: any) => {
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
          const blogsListName = row?.title || 'N/A';
          const blogsListSlug = row?.slug || 'N/A';
          const sequence = row?.sequence || `N/A`;

          return {
            ID: id,
            Title: blogsListName,
            Slug: blogsListSlug,
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

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Blogs List (${totalCount})`} description="" />
          <div className="flex gap-5">
            <Button variant="default" onClick={handleExport}>
              Export All
            </Button>
            <Link
              href={'/dashboard/blogs/list/add'}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />
        <BlogsListTable
          data={blogsList}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
