import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import AllOrdersListingPage from './_components/allorders-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : All Orders'
};

export default async function Page({ searchParams }: PageProps) {
  return <AllOrdersListingPage />;
}
