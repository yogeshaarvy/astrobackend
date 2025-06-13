import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import PoojaOrdersListingPage from './_components/poojaorders-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Pooja All Orders'
};

export default async function Page({ searchParams }: PageProps) {
  return <PoojaOrdersListingPage />;
}
