'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  fetchDepartmentList,
  IDepartment,
  setDepartmentData
} from '@/redux/slices/departmentSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import DepartmentTable from './department-table';
import { useSearchParams } from 'next/navigation';
import { TCurrentEmployee, TCurrentEmployeePermission } from '@/types/globals';
import EmployeeNotAllwoed from '@/components/not-allowed';


type TDepartmentListingPage = {
  currentEmp: TCurrentEmployee,
  empPermissions: TCurrentEmployeePermission,
}
export default function DepartmentListingPage({ currentEmp, empPermissions }: TDepartmentListingPage) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  // Redux state for department data
  const {
    departmentListState: {
      loading,
      data: dData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.department);

  useEffect(() => {
    // Fetch data whenever page or pageSize changes
    dispatch(fetchDepartmentList({ page, pageSize }));
    dispatch(setDepartmentData(null));
  }, [page, pageSize]);

  if (empPermissions?.permission?.view === false) {
    return (
      <EmployeeNotAllwoed cardTitle={"Access Denied"} cardDescription={"You do not have permission to view this page"} cardContent={"If you believe this is an error, please contact your administrator or support team."}/>
    );
  } else {
    return (
      <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Department (${totalCount})`} description="" />
          <Link
            href={'/dashboard/department/add'}
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <DepartmentTable data={dData} totalData={totalCount} />
      </div>
    </PageContainer>
    );
  }
}
