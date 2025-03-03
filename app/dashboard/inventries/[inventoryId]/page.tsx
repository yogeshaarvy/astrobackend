import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ProductInventoryListingPage from './single-inventory-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard :Product Inventory'
};

export default async function Page({ searchParams }: PageProps) {
  return <ProductInventoryListingPage />;
}
