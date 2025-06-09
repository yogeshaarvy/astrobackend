import { SearchParams } from 'nuqs/parsers';
import VibhorPackageListPage from './_components/listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Vibhor package List'
};

export default async function Page({ searchParams }: PageProps) {
  return <VibhorPackageListPage />;
}
