import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import AstrologersPage from './_components/astrologers-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : All Astrologers'
};

export default async function Page({ searchParams }: PageProps) {
  return <AstrologersPage />;
}
