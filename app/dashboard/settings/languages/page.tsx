import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import TagNotAllwoed from '@/components/not-allowed';
import LanguageListingPage from './_components/tag-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Languages'
};

export default async function Page({ searchParams }: PageProps) {
  return <LanguageListingPage />;
}
