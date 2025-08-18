import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import CitiesListingPage from './_components/cities-listing-page';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import TagNotAllwoed from '@/components/not-allowed';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Tags'
};

export default async function Page({ searchParams }: PageProps) {
  return <CitiesListingPage />;
}
