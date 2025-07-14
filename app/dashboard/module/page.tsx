import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ModuleListingPage from './_components/module-listing-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: `Dashboard : Module`
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  return <ModuleListingPage />;
}
