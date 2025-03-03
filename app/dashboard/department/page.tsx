import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import DepartmentListingPage from './_components/department-listing';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import EmployeeNotAllwoed from '@/components/not-allowed';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Department'
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  const moduleId = '674d7a7e2729798eb8a3e5fb';
  const currentEmp = await getCurrentEmployee();
  if (!currentEmp) {
    return <div>No employee found. Please log in.</div>; // Handle missing employee case
  }

  const currentModulePermission = await getCurrentModulePermission(moduleId);


  if (!currentModulePermission && currentModulePermission?.permission?.view === false) {
    return <EmployeeNotAllwoed />
  }

  return <DepartmentListingPage currentEmp={currentEmp} empPermissions={currentModulePermission}/>;
}
