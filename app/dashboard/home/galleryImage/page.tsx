import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import ShopPurpsoeListingPage from './_components/galleryImage-listing-page';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : ShopPurposes'
};

export default async function Page({ searchParams }: PageProps) {
  return <ShopPurpsoeListingPage />;
}
