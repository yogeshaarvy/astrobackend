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
  addEditBlogsList,
  fetchSingleBlogsList,
  fetchBlogsCategoryList,
  IBlogs,
  IBlogsCategory,
  updateBlogsListData
} from '@/redux/slices/pages/bloges/categorySlice';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
// import CustomDropdown from '@/utils/CustomDropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchTagList } from '@/redux/slices/tagsSlice';
import { debounce } from 'lodash';
import CustomReactSelect from '@/utils/CustomReactSelect';
import CustomTextEditor from '@/utils/CustomTextEditor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleBlogsCategoryState: { loading, data: cData = [] },
    blogsCategoryList: {
      loading: blogsCategoryLoading,
      data: categoryList = []
      //   pagination: { totalCount }
    },
    singleBlogsListState: { data: wData }
  } = useAppSelector((state) => state.blogs);

  const {
    tagListState: {
      loading: tagListLoading,
      data: tagsList = []
      // pagination: { totalCount }
    }
  } = useAppSelector((state) => state.tags);
  const [quoteType, setQuoteType] = React.useState<'image' | 'text' | null>(
    null
  );
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = React.useState<File | null>(null);

  const [categoryQuery, setCategoryQuery] = React.useState<string>('');
  // Debounced function for searching categories
  const debouncedSearchCategory = React.useCallback(
    debounce((query) => {
      if (query) {
        dispatch(fetchBlogsCategoryList({ field: 'name', keyword: query }));
      }
    }, 800),
    [dispatch]
  );
  // Handle search input change
  const handleSearchCategory = (inputValue: string) => {
    setCategoryQuery(inputValue);
    debouncedSearchCategory(inputValue);
  };

  const form = useForm({});

  useEffect(() => {
    if (!entityId) {
      const title = (wData as IBlogs)?.title;
      if (title) {
        const generatedSlug = slugify(title, {
          lower: true,
          strict: true,
          trim: true
        });
        dispatch(updateBlogsListData({ ['slug']: generatedSlug }));
      }
    }
  }, [(wData as IBlogs)?.title, entityId]);

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleBlogsList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateBlogsListData({
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
    const requiredFields: (keyof IBlogs)[] = ['title', 'slug'];

    const missingFields = requiredFields.filter(
      (field) => !(wData as IBlogs)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof IBlogs]?: string } = {
        title: 'Title',
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
      dispatch(addEditBlogsList(entityId || null)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/pages/blogs/list');
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
            Blogs List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
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
                            name="title"
                            // control={form.control}
                            label="Title"
                            required={true}
                            placeholder="Enter your Blogs List title"
                            value={(wData as IBlogs)?.title}
                            onChange={handleInputChange}
                          />
                          <CustomTextField
                            required={true}
                            name="slug"
                            // control={form.control}
                            label="Slug"
                            placeholder="Enter your Slug"
                            value={(wData as IBlogs)?.slug}
                            onChange={handleInputChange}
                          />
                          <CustomTextField
                            name="sequence"
                            // control={form.control}
                            label="Sequence"
                            placeholder="Enter your Sequence"
                            type="number"
                            value={(wData as IBlogs)?.sequence || ''}
                            onChange={handleInputChange}
                          />

                          <CustomReactSelect
                            options={categoryQuery ? categoryList : []}
                            isMulti
                            label="Category"
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option._id}
                            placeholder="Select Blogs Category"
                            onInputChange={handleSearchCategory}
                            onChange={(e: any) =>
                              handleInputChange({
                                target: { name: 'categories', value: e }
                              })
                            }
                            value={(wData as IBlogs)?.categories || []}
                          />

                          <CustomTextField
                            name="metaTitle"
                            // control={form.control}
                            label="Meta Title"
                            placeholder="Enter your Meta Title"
                            value={(wData as IBlogs)?.metaTitle}
                            onChange={handleInputChange}
                          />
                          <CustomTextField
                            name="metaDescription"
                            // control={form.control}
                            label="Meta Description"
                            placeholder="Enter your Meta Description"
                            value={(wData as IBlogs)?.metaDescription}
                            onChange={handleInputChange}
                          />
                          <CustomTextField
                            name="metaKeywords"
                            // control={form.control}
                            label="Meta keywords"
                            placeholder="Enter your Meta Keywords"
                            value={(wData as IBlogs)?.metaKeywords || ''}
                            onChange={handleInputChange}
                          />

                          <FormItem className="space-y-3">
                            <FormLabel>Banner Image</FormLabel>
                            <FileUploader
                              value={bannerImage ? [bannerImage] : []}
                              onValueChange={(newFiles: any) => {
                                setBannerImage(newFiles[0] || null);
                                handleInputChange({
                                  target: {
                                    name: 'banner_image',
                                    type: 'file',
                                    files: newFiles
                                  }
                                });
                              }}
                              accept={{ 'image/*': [] }}
                              maxSize={1024 * 1024 * 2}
                            />{' '}
                            <>
                              {typeof (wData as IBlogs)?.banner_image ===
                                'string' && (
                                <>
                                  <div className="max-h-48 space-y-4">
                                    <FileViewCard
                                      existingImageURL={
                                        (wData as IBlogs)?.banner_image
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          </FormItem>

                          <FormItem className="space-y-3">
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FileUploader
                              value={thumbnailImage ? [thumbnailImage] : []}
                              onValueChange={(newFiles: any) => {
                                setThumbnailImage(newFiles[0] || null);
                                handleInputChange({
                                  target: {
                                    name: 'thumbnail_image',
                                    type: 'file',
                                    files: newFiles
                                  }
                                });
                              }}
                              // onUpload={handleInputChange}
                              accept={{ 'image/*': [] }}
                              // maxFiles={2}
                              maxSize={1024 * 1024 * 2}
                              // multiple
                            />
                            <>
                              {typeof (wData as IBlogs)?.thumbnail_image ===
                                'string' && (
                                <>
                                  <div className="max-h-48 space-y-4">
                                    <FileCard
                                      existingImageURL={
                                        (wData as IBlogs)?.thumbnail_image
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          </FormItem>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Web Tab Content */}
                <TabsContent value="web">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-center gap-5">
                      <CardTitle>BLOGES LIST WEB STATUS</CardTitle>
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
                              value={(wData as IBlogs)?.web?.title?.en || ''}
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
                                (wData as IBlogs)?.web?.shortDescription?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="web.description.en"
                              label="Description"
                              value={
                                (wData as IBlogs)?.web?.description?.en || ''
                              }
                              required={false}
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
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="web.title.hi"
                              placeholder="Enter your Title"
                              value={(wData as IBlogs)?.web?.title?.hi || ''}
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
                                (wData as IBlogs)?.web?.shortDescription?.hi ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="web.description.hi"
                              label="Description"
                              value={
                                (wData as IBlogs)?.web?.description?.hi || ''
                              }
                              required={false}
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
          </div>
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
