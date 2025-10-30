import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import OrdersListingPage from './_components/orders-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Consultation - All Orders'
};

export default async function Page({ searchParams }: PageProps) {
  return <OrdersListingPage />;
}
