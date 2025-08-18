import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import FaqListingPage from './_components/productfaq-listing-page';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import ProductFaqListingPage from './_components/productfaq-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Product Faq Page'
};

export default async function Page({ searchParams }: PageProps) {
  return <ProductFaqListingPage />;
}
