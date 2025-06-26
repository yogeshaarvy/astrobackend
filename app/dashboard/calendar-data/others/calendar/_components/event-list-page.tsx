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
import EmployeeNotAllowedToAdd from '@/components/not-allowed-add';
import EventListTable from './list-tables';
import {
  fetchEventCalendarList,
  ICalendar,
  setEventCalendarListData
} from '@/redux/slices/calendar';

type TEmployeeListingPage = {
  currentEmp: TCurrentEmployee;
  empPermissions: TCurrentEmployeePermission;
};

export default function EventListPage({
  currentEmp,
  empPermissions
}: TEmployeeListingPage) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    eventCalendarList: {
      loading: EventUpcomingLoading,
      data: EventCalendarData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(fetchEventCalendarList({ page, pageSize }));
    dispatch(setEventCalendarListData(null));
  }, [page, pageSize]);

  // You can safely assume `eData` is populated now
  const eventCalendarList: ICalendar[] = EventCalendarData;

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
        <div className="flex items-start justify-between">
          <Heading title={`Calendars  (${totalCount})`} description="" />
          <div className="flex gap-5">
            {/* {empPermissions.permission.add ? ( */}
            <Link
              href={`/dashboard/calendar/add`}
              className={buttonVariants({ variant: 'default' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
            {/* // ) : (
              //   <EmployeeNotAllowedToAdd />
              // )} */}
          </div>
        </div>
        <Separator />
        <EventListTable data={eventCalendarList} totalData={totalCount} />
      </div>
    </PageContainer>
  );
  // }
}
