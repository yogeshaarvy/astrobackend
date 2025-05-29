import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ProductsListingPage from './_components/product-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Products'
};

export default async function Page({ searchParams }: PageProps) {
  return <ProductsListingPage />;
}
