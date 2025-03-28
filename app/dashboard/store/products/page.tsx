import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ProductsListingPage from './_components/product-listing-page';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import ProductsNotAllwoed from '@/components/not-allowed';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Products'
};

export default async function Page({ searchParams }: PageProps) {
  return <ProductsListingPage />;
}
