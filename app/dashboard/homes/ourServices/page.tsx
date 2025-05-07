import { SearchParams } from 'nuqs/parsers';

import OurServicesListPage from './_components/listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Home Banner List'
};

export default async function Page({ searchParams }: PageProps) {
  return <OurServicesListPage />;
}
