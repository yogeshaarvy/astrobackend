import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import BrandsListingPage from './_components/brand-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Brands'
};

export default async function Page({ searchParams }: PageProps) {
  return <BrandsListingPage />;
}
