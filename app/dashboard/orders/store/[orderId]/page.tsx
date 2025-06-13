'use client';
import React, { useEffect, useState } from 'react';
import OrderDetailsPage from './orderdetails';
import { useAppDispatch } from '@/redux/hooks';
import { fetchSingleOrderList } from '@/redux/slices/allordersSlice';
import { usePathname } from 'next/navigation';

const Page = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const orderId = pathname?.split('/').pop();

  useEffect(() => {
    if (!orderId) return; // Prevents unnecessary API calls if orderId is missing

    dispatch(fetchSingleOrderList(orderId)).then((res) => {
      setOrderDetails(res.payload?.order || null);
    });
  }, [dispatch, orderId]); // Added orderId as a dependency

  return (
    <div>
      <OrderDetailsPage orderData={orderDetails} />
    </div>
  );
};

export default Page;
