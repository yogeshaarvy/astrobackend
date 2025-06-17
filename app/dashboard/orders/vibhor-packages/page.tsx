import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

import VibhorOrdersListingPage from './_components/vibhororders-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Vibhor Packages All Orders'
};

export default async function Page({ searchParams }: PageProps) {
  return <VibhorOrdersListingPage />;
}
