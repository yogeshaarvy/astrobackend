'use client';

import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import CourseTables from './course-table/course-table-index';
import { fetchCourseList, ICourse } from '@/redux/slices/courseSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type TCourseListPage = {};

export default function CourseListingPage({}: TCourseListPage) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 1);

  const {
    courseListState: {
      loading,
      data: eData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchCourseList({ page, pageSize }));
  }, [page, pageSize]);

  const course: ICourse[] = eData;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Course-List (${totalCount})`}
            description="Life learning courses"
          />
          <Link
            href={'/dashboard/courses/list/add'}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <CourseTables data={course} totalData={totalCount} />
      </div>
    </PageContainer>
  );
}
