'use client';
import {
  FileCard,
  FileUploader,
  FileViewCard
} from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import slugify from 'slugify';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditBlogsCategory,
  fetchSingleBlogsCategory,
  IBlogsCategory,
  updateBlogsCategoryData
} from '@/redux/slices/pages/bloges/categorySlice';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomReactSelect from '@/utils/CustomReactSelect';
import { debounce } from 'lodash';

export default function CategoryForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleBlogsCategoryState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.blogs);
  const [files, setFiles] = React.useState<File[]>([]);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [logoImage, setLogoImage] = React.useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = React.useState<File | null>(null);
  const [tagQuery, setTagQuery] = React.useState<string>('');

  const {
    tagListState: {
      loading: tagListLoading,
      data: tagsList = []
      // pagination: { totalCount }
    }
  } = useAppSelector((state) => state.tags);

  const form = useForm({
    defaultValues: {
      name: '',
      slug: ''
    }
  });

  useEffect(() => {
    const name = (cData as IBlogsCategory)?.name;
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true,
        strict: true,
        trim: true
      });
      dispatch(updateBlogsCategoryData({ ['slug']: generatedSlug }));
    }
  }, [(cData as IBlogsCategory)?.name]);

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleBlogsCategory(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateBlogsCategoryData({
        [name]:
          type === 'file'
            ? files[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  const handleSubmit = () => {
    const requiredFields: (keyof IBlogsCategory)[] = ['name', 'slug'];

    const missingFields = requiredFields.filter(
      (field) => !(cData as IBlogsCategory)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof IBlogsCategory]?: string } = {
        name: 'Name',
        slug: 'Slug'
      };

      const missingFieldLabels = missingFields.map(
        (field) => fieldLabels[field] || field
      );
      toast.error(
        `Please fill the required fields: ${missingFieldLabels.join(', ')}`
      );
      return;
    }

    try {
      dispatch(addEditBlogsCategory(entityId || null)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/blogs/categories');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Blogs Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Tabs defaultValue="seo" className="mt-4 w-full">
                  <TabsList className="flex w-full space-x-1 p-0">
                    <TabsTrigger
                      value="seo"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      GENERAL & SEO
                    </TabsTrigger>
                    <TabsTrigger
                      value="web"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      WEB
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="seo">
                    <Card className="mx-auto mb-16 w-full">
                      <CardHeader>
                        <CardTitle className="text-left text-lg font-bold">
                          GENERAL & SEO DETAILS
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-8"
                          >
                            {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
                            <CustomTextField
                              name="name"
                              // control={form.control}
                              label="Name"
                              required={true}
                              placeholder="Enter your Blogs Category Name"
                              value={(cData as IBlogsCategory)?.name}
                              onChange={handleInputChange}
                            />
                            <CustomTextField
                              required={true}
                              name="slug"
                              // control={form.control}
                              label="Slug"
                              placeholder="Enter your Slug"
                              value={(cData as IBlogsCategory)?.slug}
                              onChange={handleInputChange}
                            />
                            <CustomTextField
                              name="sequence"
                              // control={form.control}
                              label="Sequence"
                              placeholder="Enter your Sequence"
                              type="number"
                              value={(cData as IBlogsCategory)?.sequence || ''}
                              onChange={handleInputChange}
                            />
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* Web Tab Content */}
                  <TabsContent value="web">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-center gap-5">
                        <CardTitle>BLOG CATEGORY WEB DATA</CardTitle>
                      </CardHeader>
                      <Tabs defaultValue="English" className="mt-4 w-full">
                        <TabsList className="flex w-full space-x-2 p-0">
                          <TabsTrigger
                            value="English"
                            className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                          >
                            English
                          </TabsTrigger>
                          <TabsTrigger
                            value="Hindi"
                            className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                          >
                            Hindi
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="English">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>WEB-ENGLISH</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="name">Title</Label>
                              <Input
                                name="web.title.en"
                                placeholder="Enter your Title"
                                value={
                                  (cData as IBlogsCategory)?.web?.title?.en
                                }
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="name">Short Description</Label>
                              <Input
                                name="web.shortDescription.en"
                                placeholder="Enter your Short Description"
                                // aria-controls={form.control}
                                value={
                                  (cData as IBlogsCategory)?.web
                                    ?.shortDescription?.en
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="web.description.en"
                                label="Description"
                                value={
                                  (cData as IBlogsCategory)?.web?.description
                                    ?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'web.description.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>

                        {/* Hindi Content */}
                        <TabsContent value="Hindi">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>WEB-HINDI</CardTitle>
                          </CardHeader>

                          {/* English Form */}
                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="name">Title</Label>
                              <Input
                                name="web.title.hi"
                                placeholder="Enter your Title"
                                // aria-controls={form.control}
                                value={
                                  (cData as IBlogsCategory)?.web?.title?.hi
                                }
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="name">Short Description</Label>
                              <Input
                                name="web.shortDescription.hi"
                                placeholder="Enter your Short Description"
                                // aria-controls={form.control}
                                value={
                                  (cData as IBlogsCategory)?.web
                                    ?.shortDescription?.hi
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="web.description.hi"
                                label="Description"
                                value={
                                  (cData as IBlogsCategory)?.web?.description
                                    ?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'web.description.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Button type="submit" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
