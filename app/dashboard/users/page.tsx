import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import FaqListingPage from './_components/allusers-listing-page';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import AboutListingPage from './_components/allusers-listing-page';
import NewsLetterListingPage from './_components/allusers-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : All Users'
};

export default async function Page({ searchParams }: PageProps) {
  return <NewsLetterListingPage />;
}
