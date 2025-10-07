'use client';
import React, { useEffect, useState } from 'react';
import OrderDetailsPage from './poojaorderdetails';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname } from 'next/navigation';
import { fetchSingleOrderList } from '@/redux/slices/astropooja/poojaorders';

const Page = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const {
    singleAllOrdersListState: { loading, data: orderDetails }
  } = useAppSelector((state) => state.allpoojsorders);

  const orderId = pathname?.split('/').pop();

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSingleOrderList(orderId));
    }
  }, [dispatch, orderId]);

  return (
    <div>
      <OrderDetailsPage loading={loading} orderData={orderDetails} />
    </div>
  );
};

export default Page;
