// 'use client';
// import { useEffect } from 'react';
// import PageContainer from '@/components/layout/page-container';
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// import { Plus } from 'lucide-react';
// import Link from 'next/link';
// import { fetchSlidersList, ISliders } from '@/redux/slices/slidersSlice';
// import { useAppSelector, useAppDispatch } from '@/redux/hooks';
// import { useSearchParams } from 'next/navigation';

// import { fetchFaqList, IFaq } from '@/redux/slices/faqSlice';
// // import FaqTable from './faq-tables';
// import About from './about';
// import AboutTable from './about-tables';
// import { fetchHomeAboutList, IHomeAboutList } from '@/redux/slices/homeaboutlistSlice';

// export default function AboutListingPage() {
//   const dispatch = useAppDispatch();
//   const searchParams = useSearchParams();

//   // Fetching query params from the URL
//   const keyword = searchParams.get('q') || '';
//   const status = searchParams.get('status') || '';
//   const field = searchParams.get('field') || '';
//   const page = parseInt(searchParams.get('page') ?? '1', 10);
//   const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

//   // Selector for sliders state
//   const {
//     HomeAboutListState: {
//       loading: faqListLoading,
//       data: cData = [],
//       pagination: { totalCount } = { totalCount: 0 }
//     }
//   } = useAppSelector((state) => state.homeaboutlist);

//   // Fetch data on component mount and when dependencies change
//   useEffect(() => {
//     dispatch(fetchHomeAboutList({ page, pageSize, keyword, field, status }));
//     // dispatch(setTypesData(null));
//   }, [page, pageSize, keyword, field, status, dispatch]);

//   const faq: IHomeAboutList[] = cData;
//   // Handle search action
//   const handleSearch = () => {
//     if ((!keyword && field) || (!field && keyword)) {
//       alert('Both keyword and field are required');
//       return;
//     }
//     dispatch(fetchHomeAboutList({ page, pageSize, keyword, field, status }));
//   };

//   return (
//     <PageContainer scrollable>
//       <About/>
//       <div className="mr-5 space-y-4">
//         {/* Header */}
//         <div className="flex items-start justify-between pr-4">
//           <Heading title={`List`} description="" />

//           <div className="flex items-center">
//             {/* Export Button */}
//             <Button className="mx-5 py-4" variant="default">
//               Export
//             </Button>

//             {/* Add New Link */}
//             <Link
//               href={'/dashboard/faq/add'}
//               className={buttonVariants({ variant: 'default' })}
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add New
//             </Link>
//           </div>
//         </div>

//         <Separator />

//         {/* Sliders Table */}
//         <AboutTable
//           data={faq as IFaq[]}
//           totalData={totalCount}
//           handleSearch={handleSearch}
//         />
//       </div>
//     </PageContainer>
//   );
// }

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
import About from './about';
import AboutTable from './about-tables';

export default function AboutListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const entityId = searchParams.get('id');

  // Modal state
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sequence: 0,
    icon: '',
    title: '',
    status: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  const {
    HomeAboutListState: {
      data: cData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.homeaboutlist);

  useEffect(() => {
    dispatch(fetchHomeAboutList({ page, pageSize, keyword, field, status }));
  }, [page, pageSize, keyword, field, status, dispatch]);

  const faq: IHomeAboutList[] = cData;

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, icon: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('sequence', formData.sequence.toString());
    formDataToSend.append('title', formData.title);
    formDataToSend.append('status', formData.status.toString());
    if (formData.icon) {
      formDataToSend.append('icon', formData.icon);
    }
    dispatch(addEditHomeAboutList({ formData: formDataToSend, entityId }));
    setImagePreview(null);
    setFormData({ sequence: 0, icon: '', title: '', status: false });
    setOpen(false);
  };

  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field are required');
      return;
    }
    dispatch(fetchHomeAboutList({ page, pageSize, keyword, field, status }));
  };

  return (
    <PageContainer scrollable>
      <About />
      <div className="mr-5 space-y-4 border border-black p-8">
        {/* Header */}
        <div className="flex items-start justify-between pr-4">
          <Heading title="List" description="" />
          <div className="flex items-center">
            {/* <Button className="mx-5 py-4" variant="default">
              Export
            </Button> */}
            <Button onClick={() => setOpen(true)} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
        </div>

        <Separator />

        {/* Sliders Table */}
        <AboutTable
          data={faq}
          totalData={totalCount}
          handleSearch={handleSearch}
        />

        {/* Popup Form Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sequence Input */}
              <div>
                <Label htmlFor="sequence">Sequence</Label>
                <Input
                  id="sequence"
                  type="number"
                  value={formData.sequence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sequence: Number(e.target.value)
                    })
                  }
                  required
                />
              </div>

              {/* Icon Input (File) */}
              <div>
                <Label htmlFor="icon">Icon (Image)</Label>
                <Input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-20 w-20 rounded-lg shadow-md"
                  />
                )}
              </div>

              {/* Title Input */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
