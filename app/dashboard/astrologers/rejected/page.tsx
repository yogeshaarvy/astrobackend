import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import RejectedPage from './_components/reject-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Rejected Astrologers'
};

export default async function Page({ searchParams }: PageProps) {
  return <RejectedPage />;
}
