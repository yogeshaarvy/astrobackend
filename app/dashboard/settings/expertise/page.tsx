import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import SkillsPage from './_components/list-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard :  Skills'
};

export default async function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <SkillsPage />;
}
