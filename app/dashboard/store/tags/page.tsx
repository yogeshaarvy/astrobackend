import { SearchParams } from 'nuqs/parsers';
import TagsListPage from './_components/listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Tags List'
};

export default async function Page({ searchParams }: PageProps) {
  return <TagsListPage />;
}
