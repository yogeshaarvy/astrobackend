'use client';
import { useCallback, useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import AllOrdersTable from './poojaorders-tables';
import {
  fetchAllOrdersList,
  IAllOrdersList
} from '@/redux/slices/astropooja/poojaorders';

export default function AllOrdersListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams?.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams?.get('limit') ?? '10', 10);
  const datesdata = searchParams?.get('data') ?? '';
  const rawStatus = searchParams?.get('poojaStatus') ?? '';

  const poojaStatusParam =
    rawStatus === 'no-started' ? 'no started' : rawStatus;

  const [startDate, setStartDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedFrom, setAssignedFrom] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [assignStatus, setAssignStatus] = useState('');
  const [email, setEmail] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const {
    AllPoojaOrdersState: {
      data: pData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.allpoojsorders);

  // Date helper functions
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getWeekAgoDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today.toISOString().split('T')[0];
  };

  const getThirtyDaysAgoDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    return today.toISOString().split('T')[0];
  };

  const getOneYearAgoDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (datesdata === 'today') {
      const today = getTodayDate();
      setStartDate(today);
      setEndDate(today);
    } else if (datesdata === 'week') {
      setStartDate(getWeekAgoDate());
      setEndDate(getTodayDate());
    } else if (datesdata === 'month') {
      setStartDate(getThirtyDaysAgoDate());
      setEndDate(getTodayDate());
    } else if (datesdata === 'year') {
      setStartDate(getOneYearAgoDate());
      setEndDate(getTodayDate());
    }
  }, [datesdata]);

  useEffect(() => {
    dispatch(
      fetchAllOrdersList({
        page,
        pageSize,
        orderStatus,
        poojaStatus: poojaStatusParam,
        startDate,
        assignedTo,
        assignedFrom,
        paymentStatus,
        assignStatus,
        endDate,
        email,
        orderNo
      })
    );
  }, [
    page,
    pageSize,
    orderStatus,
    poojaStatusParam,
    startDate,
    assignedTo,
    assignedFrom,
    paymentStatus,
    assignStatus,
    endDate,
    email,
    orderNo,
    dispatch
  ]);

  const allorders: IAllOrdersList[] = pData;

  const handlestartdateChange = (event: any) => {
    setStartDate(event.target.value);
  };

  const handleenddateChange = (event: any) => {
    setEndDate(event.target.value);
  };

  // ✅ Fixed: Separate handlers for assignedFrom and assignedTo
  const handleAssignedFromChange = (event: any) => {
    setAssignedFrom(event.target.value);
  };

  const handleAssignedToChange = (event: any) => {
    setAssignedTo(event.target.value);
  };

  const handlePoojaStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const finalValue = value === 'no-started' ? 'no started' : value;
    params.set('poojaStatus', finalValue);
    router.push(`?${params.toString()}`);
  };

  const handleEmailInputChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleOrderNoInputChange = (event: any) => {
    setOrderNo(event.target.value);
  };

  const handleSearch = () => {
    dispatch(
      fetchAllOrdersList({
        page,
        pageSize,
        orderStatus,
        paymentStatus,
        assignStatus,
        startDate,
        assignedFrom,
        assignedTo,
        poojaStatus: poojaStatusParam,
        endDate,
        email,
        orderNo
      })
    );
  };

  const fetchUnreadCounts = useCallback(async () => {
    const orderIds = allorders.map((order) => order?.orderId).join(',');
    if (!orderIds) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/V1/chat/order-unread-messages?orderIds=${orderIds}`
      );
      const data = await res.json();
      setUnreadCounts(data);
    } catch (err) {
      console.error('Failed to fetch unread message counts:', err);
    }
  }, [allorders]);

  useEffect(() => {
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 20000);
    return () => clearInterval(interval);
  }, [fetchUnreadCounts]);

  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4 p-8">
        <div className="flex items-start justify-between pr-4">
          <Heading title="All Puja Orders" description="" />
        </div>

        <Separator />

        <AllOrdersTable
          data={allorders}
          totalData={totalCount}
          handleSearch={handleSearch}
          startDate={startDate}
          endDate={endDate}
          poojaStatus={poojaStatusParam}
          email={email}
          assignedFrom={assignedFrom}
          assignedTo={assignedTo}
          handleAssignedFromChange={handleAssignedFromChange}
          handleAssignedToChange={handleAssignedToChange}
          handlestartdateChange={handlestartdateChange}
          handleEmailInputChange={handleEmailInputChange}
          handleenddateChange={handleenddateChange}
          handleOrderStatusChange={(value: string) => setOrderStatus(value)}
          orderStatus={orderStatus}
          paymentStatus={paymentStatus}
          assignStatus={assignStatus}
          handlePaymentStatusChange={(value: string) => setPaymentStatus(value)}
          handleAssignStatusChange={(value: string) => setAssignStatus(value)}
          orderNo={orderNo}
          handleOrderNoInputChange={handleOrderNoInputChange}
          handlePoojaStatusChange={handlePoojaStatusChange}
          unreadCounts={unreadCounts}
        />
      </div>
    </PageContainer>
  );
}
