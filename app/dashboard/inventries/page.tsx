import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import InventoryListingPage from './_components/inventory-listing-page';
import { getCurrentEmployee } from '@/services/utlis/getCurrentEmployee';
import { getCurrentModulePermission } from '@/services/utlis/getCurrentModulePermission';
import InventoryNotAllwoed from '@/components/not-allowed';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Inventories'
};

export default async function Page({ searchParams }: PageProps) {
  return <InventoryListingPage />;
}
