'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addEditHomeAboutList,
  fetchHomeAboutList,
  IHomeAboutList
} from '@/redux/slices/homeaboutlistSlice';
import NewsletterTable from './newsletter-tables';
import { fetchNewsLetter, INewsletter } from '@/redux/slices/newsletterSlice';

export default function NewsLetterListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const entityId = searchParams?.get('id');

  // Modal state
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sequence: 0,
    icon: '',
    title: '',
    status: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const keyword = searchParams?.get('q') || '';
  const status = searchParams?.get('status') || '';
  const field = searchParams?.get('field') || '';
  const page = parseInt(searchParams?.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams?.get('limit') ?? '10', 10);
  const limit = parseInt(searchParams?.get('limit') ?? '10', 10);

  const {
    NewsletterState: {
      data: cData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.newsletter);

  useEffect(() => {
    dispatch(
      fetchNewsLetter({ page, pageSize, keyword, field, status, limit })
    );
  }, [page, pageSize, keyword, field, status, limit, dispatch]);

  const faq: INewsletter[] = cData;

  // Handle file input change

  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field are required');
      return;
    }
    dispatch(fetchHomeAboutList({ page, pageSize, keyword, field, status }));
  };

  return (
    <PageContainer scrollable>
      {/* <About /> */}
      <div className="mr-5 space-y-4  p-8">
        {/* Header */}
        <div className="flex items-start justify-between pr-4">
          <Heading title="Subscribed Email's" description="" />
          <div className="flex items-center">
            {/* <Button className="mx-5 py-4" variant="default">
              Export
            </Button> */}
            {/* <Button onClick={() => setOpen(true)} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button> */}
          </div>
        </div>

        <Separator />

        {/* Sliders Table */}
        <NewsletterTable
          data={faq}
          totalData={totalCount}
          handleSearch={handleSearch}
        />
      </div>
    </PageContainer>
  );
}
