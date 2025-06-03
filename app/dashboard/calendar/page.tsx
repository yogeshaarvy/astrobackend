import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import EmployeeNotAllwoed from '@/components/not-allowed';
import EventListPage from './_components/event-list-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Monthly Event Calendar List'
};

export default async function Page({ searchParams }: PageProps) {
  const eventId = searchParams?.eventId;
  searchParamsCache.parse(searchParams);
  const moduleId = `677f75d96ced725ddacb85d0`;
  const currentEmp = await getCurrentEmployee();
  if (!currentEmp) {
    return <div>No employee found. Please log in.</div>; // Handle missing employee case
  }

  const currentModulePermission = await getCurrentModulePermission(moduleId);

  // if (!currentModulePermission) {
  //   return <EmployeeNotAllwoed />;
  // }
  return (
    <EventListPage
      currentEmp={currentEmp}
      empPermissions={currentModulePermission}
    />
  );
}
