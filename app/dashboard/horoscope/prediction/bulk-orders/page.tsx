import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import EmployeeNotAllwoed from '@/components/not-allowed';
import { headers } from 'next/headers';
import BulkOrderPage from './bulkOrders';

export const metadata = {
  title: 'Dashboard : User List'
};

export default async function Page({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  const moduleId = '67c6d005ca2af808a28c560c';
  const currentEmp = await getCurrentEmployee();
  if (!currentEmp) {
    return <div>No employee found. Please log in.</div>; // Handle missing employee case
  }

  const currentModulePermission = await getCurrentModulePermission(moduleId);

  if (
    !currentModulePermission &&
    currentModulePermission?.permission?.view === false
  ) {
    return <EmployeeNotAllwoed />;
  }

  return <BulkOrderPage empPermissions={currentModulePermission} />;
}
