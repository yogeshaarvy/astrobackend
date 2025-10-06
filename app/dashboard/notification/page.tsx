import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import EmployeeNotAllwoed from '@/components/not-allowed';
import MobileAppNotificationComponent from './MobileAppNotificationComponent';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Dashboard : Employees'
};

export default async function Page() {
  // const headersList = headers();
  // const pathName = headersList.get('x-pathname');
  // const paramsQuery = headersList.get('x-search-params');
  // const navItemUrl = paramsQuery ? `${pathName}?${paramsQuery}` : pathName;
  // const currentEmp = await getCurrentEmployee();
  // if (!currentEmp) {
  //   return <div>No employee found. Please log in.</div>; // Handle missing employee case
  // }

  // if (!navItemUrl) {
  //   return <div>Invalid navigation URL.</div>;
  // }
  // const currentModulePermission = await getCurrentModulePermission(navItemUrl);
  // console.log('emp Permisssions of notifications', currentModulePermission);
  // if (!currentModulePermission) {
  //   return <EmployeeNotAllwoed />;
  // }

  return <MobileAppNotificationComponent />;
}
