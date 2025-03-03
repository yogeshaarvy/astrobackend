'use client';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchEventList, IEvent } from '@/redux/slices/eventSlice';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import EventTableIndex from './event-table/event-table-index';

type TEventListingPage = {};

const EventlistingPage = ({}: TEventListingPage) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '5', 10);

  const {
    eventListState: {
      loading,
      data: eData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEventList({ page, pageSize }));
  }, [page, pageSize]);

  const event: IEvent[] = eData;
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Event-List (${totalCount})`}
            description="Live Event"
          />
          <Link
            href={`/dashboard/events/add`}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <EventTableIndex data={eData} totalData={totalCount} />
      </div>
    </PageContainer>
  );
};

export default EventlistingPage;
