'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
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
import About from './blogs';
import AboutTable from './blogs-tables';
import Blogs from './blogs';
import {
  addEditBlogsPost,
  fetchBlogsPost,
  IBlogsPost
} from '@/redux/slices/blogspostSlice';
import slugify from 'slugify';

export default function BlogsListingPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const entityId = searchParams.get('id');

  // Modal state
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sequence: 0,
    thumbnail_image: '',
    main_image: '',
    heading: '',
    slug: '',
    short_description: '',
    long_description: '',

    status: false
  });
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({
    thumbnail_image: '',
    main_image: ''
  });

  const keyword = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const field = searchParams.get('field') || '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('limit') ?? '10', 10);

  const {
    BlogsPostState: {
      data: cData = [],
      pagination: { totalCount } = { totalCount: 0 }
    }
  } = useAppSelector((state) => state.blogsPost);

  useEffect(() => {
    dispatch(fetchBlogsPost({ page, pageSize, keyword, field, status }));
  }, [page, pageSize, keyword, field, status, dispatch]);

  const post: IBlogsPost[] = cData;

  // Handle file input change

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { name } = event.target;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setFormData((prevState) => ({
          ...prevState,
          [name]: file
        }));
        setImagePreview((prev) => ({
          ...prev,
          [name]: imageDataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('sequence', formData.sequence.toString());
    formDataToSend.append('heading', formData.heading);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('short_description', formData.short_description);
    formDataToSend.append('long_description', formData.long_description);
    formDataToSend.append('status', formData.status.toString());
    if (formData.thumbnail_image) {
      formDataToSend.append('thumbnail_image', formData.thumbnail_image);
    }
    if (formData.main_image) {
      formDataToSend.append('main_image', formData.main_image);
    }
    for (let pair of formDataToSend.entries()) {
    }
    dispatch(addEditBlogsPost({ formData: formDataToSend, entityId }));
    setImagePreview({});
    setFormData({
      sequence: 0,
      thumbnail_image: '',
      main_image: '',
      short_description: '',
      long_description: '',
      heading: '',
      slug: '',
      status: false
    });
    setOpen(false);
  };

  const handleSearch = () => {
    if ((!keyword && field) || (!field && keyword)) {
      alert('Both keyword and field are required');
      return;
    }
    dispatch(fetchHomeAboutList({ page, pageSize, keyword, field, status }));
  };
  useEffect(() => {
    if (formData.heading) {
      const generatedSlug = slugify(formData.heading, {
        lower: true,
        strict: true,
        trim: true
      });
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.heading]);

  return (
    <PageContainer scrollable>
      <Blogs />
      <div className="mr-5 space-y-4 border border-black p-8">
        {/* Header */}
        <div className="flex items-start justify-between pr-4">
          <Heading title="Blog Post" description="" />
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
          data={post}
          totalData={totalCount}
          handleSearch={handleSearch}
        />

        {/* Popup Form Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
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

              <div className="flex justify-between">
                <div>
                  <Label htmlFor="thumbnail_image">Thumbnail (Image)</Label>
                  <Input
                    id="thumbnail_image"
                    name="thumbnail_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {imagePreview.thumbnail_image && (
                    <img
                      src={imagePreview.thumbnail_image}
                      alt="Preview"
                      className="mt-2 h-20 w-20 rounded-lg shadow-md"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="main_image">Main (Image)</Label>
                  <Input
                    id="main_image"
                    name="main_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {imagePreview.main_image && (
                    <img
                      src={imagePreview.main_image}
                      alt="Preview"
                      className="mt-2 h-20 w-20 rounded-lg shadow-md"
                    />
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div className="flex justify-between">
                <div>
                  <Label htmlFor="heading">Heading</Label>
                  <Input
                    id="heading"
                    value={formData.heading}
                    onChange={(e) =>
                      setFormData({ ...formData, heading: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="heading">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  type="text"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="long_description">Long Description</Label>
                <Input
                  id="long_description"
                  type="text"
                  value={formData.long_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      long_description: e.target.value
                    })
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
