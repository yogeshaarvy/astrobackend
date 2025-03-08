import { SearchParams } from 'nuqs/parsers';
import HomeBannerListPage from './_components/listing-page';

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Testimonial List'
};

export default async function Page({ searchParams }: PageProps) {
  return <HomeBannerListPage />;
}
