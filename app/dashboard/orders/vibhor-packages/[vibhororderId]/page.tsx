'use client';
import React, { useEffect, useState } from 'react';
import OrderDetailsPage from './vibhororderdetails';
import { useAppDispatch } from '@/redux/hooks';
import { usePathname } from 'next/navigation';
import { fetchSingleOrderList } from '@/redux/slices/vibhor/ordersSlice';

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

  console.log('order deatils data is ......', orderDetails);
  return (
    <div>
      <OrderDetailsPage orderData={orderDetails} />
    </div>
  );
};

export default Page;
