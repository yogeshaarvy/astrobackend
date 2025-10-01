'use client';
import { useCallback, useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import AllOrdersTable from './poojaorders-tables';
import {
  fetchAllOrdersList,
  IAllOrdersList
} from '@/redux/slices/astropooja/poojaorders';

export default function AllOrdersListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const entityId = searchParams?.get('id');

  const keyword = searchParams?.get('q') || '';
  const status = searchParams?.get('status') || '';
  const field = searchParams?.get('field') || '';
  const page = parseInt(searchParams?.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams?.get('limit') ?? '10', 10);
  const order_status = searchParams?.get('order_status') ?? '';
  const datesdata = searchParams?.get('data') ?? '';
  const poojaStatusParam = searchParams?.get('pooja_status') ?? '';

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [poojaStatusState, setPoojaStatusState] = useState(
    poojaStatusParam || 'all'
  );
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [email, setEmail] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const {
    AllPoojaOrdersState: {
      data: pData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.allpoojsorders);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get the date for one week ago in YYYY-MM-DD format
  const getWeekAgoDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get the date for 30 days ago in YYYY-MM-DD format
  const getThirtyDaysAgoDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get the date for one year ago in YYYY-MM-DD format
  const getOneYearAgoDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (datesdata === 'today') {
      const today = getTodayDate();
      setStartDate(today);
      setEndDate(today);
    } else if (datesdata === 'week') {
      const weekAgo = getWeekAgoDate();
      const today = getTodayDate();
      setStartDate(weekAgo);
      setEndDate(today);
    } else if (datesdata === 'month') {
      const thirtyDaysAgo = getThirtyDaysAgoDate();
      const today = getTodayDate();
      setStartDate(thirtyDaysAgo);
      setEndDate(today);
    } else if (datesdata === 'year') {
      const oneYearAgo = getOneYearAgoDate();
      const today = getTodayDate();
      setStartDate(oneYearAgo);
      setEndDate(today);
    }
  }, [datesdata]);

  useEffect(() => {
    const finalPoojaStatus = poojaStatusState === 'all' ? '' : poojaStatusState;
    dispatch(
      fetchAllOrdersList({
        page,
        pageSize,
        orderStatus,
        poojaStatus: finalPoojaStatus,
        startDate,
        endDate,
        email,
        orderNo
      })
    );
  }, [
    page,
    pageSize,
    orderStatus,
    poojaStatusState,
    startDate,
    endDate,
    email,
    orderNo,
    dispatch
  ]);

  const allorders: IAllOrdersList[] = pData;

  const handlestartdateChange = (event: any) => {
    setStartDate(event.target.value as string);
  };

  const handleenddateChange = (event: any) => {
    setEndDate(event.target.value as string);
  };

  const handlePoojaStatusChange = (value: string) => {
    setPoojaStatusState(value);
  };

  const handleEmailInputChange = (event: any) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleOrderNoInputChange = (event: any) => {
    const { value } = event.target;
    setOrderNo(value);
  };

  const handleSearch = () => {
    const finalPoojaStatus = poojaStatusState === 'all' ? '' : poojaStatusState;
    dispatch(
      fetchAllOrdersList({
        page,
        pageSize,
        orderStatus,
        paymentStatus,
        startDate,
        poojaStatus: finalPoojaStatus,
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

    const interval = setInterval(() => {
      fetchUnreadCounts();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchUnreadCounts]);

  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4 p-8">
        {/* Header */}
        <div className="flex items-start justify-between pr-4">
          <Heading title="All Puja Orders" description="" />
        </div>

        <Separator />

        {/* Orders Table */}
        <AllOrdersTable
          data={allorders}
          totalData={totalCount}
          handleSearch={handleSearch}
          startDate={startDate}
          endDate={endDate}
          poojaStatus={poojaStatusState}
          email={email}
          handlestartdateChange={handlestartdateChange}
          handleEmailInputChange={handleEmailInputChange}
          handleenddateChange={handleenddateChange}
          handleOrderStatusChange={(value: string) => {
            setOrderStatus(value === 'all' ? '' : value);
          }}
          orderStatus={orderStatus}
          paymentStatus={paymentStatus}
          handlePaymentStatusChange={(value: string) => {
            setPaymentStatus(value === 'all' ? '' : value);
          }}
          orderNo={orderNo}
          handleOrderNoInputChange={handleOrderNoInputChange}
          handlePoojaStatusChange={handlePoojaStatusChange}
          unreadCounts={unreadCounts}
        />
      </div>
    </PageContainer>
  );
}
