import { SearchParams } from 'nuqs/parsers';
import VastuSliderListPage from './_components/listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Vastu-shastr List'
};

export default async function Page({ searchParams }: PageProps) {
  return <VastuSliderListPage />;
}
