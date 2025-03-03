import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import CategoryListingPage from './_components/category-listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Categories'
};

export default async function Page({ searchParams }: PageProps) {
  return <CategoryListingPage />;
}
