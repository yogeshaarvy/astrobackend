import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import RequestedPage from './_components/requested-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Requested Astrologers'
};

export default async function Page({ searchParams }: PageProps) {
  return <RequestedPage />;
}
