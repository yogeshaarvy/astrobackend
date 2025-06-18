import { SearchParams } from 'nuqs/parsers';
import ProjectFaqListPage from './_components/listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Project Faq List'
};

export default async function Page({ searchParams }: PageProps) {
  return <ProjectFaqListPage />;
}
