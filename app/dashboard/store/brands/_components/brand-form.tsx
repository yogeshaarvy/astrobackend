'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateBrandData,
  setBrandData,
  IBrand,
  addEditBrand,
  fetchSingleBrand
} from '@/redux/slices/brandSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { FileUploader, FileViewCard } from '@/components/file-uploader';

import { useEffect } from 'react';
import slugify from 'slugify';

import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { toast } from 'sonner';

export default function BrandForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleBrandState: { loading, data: bData }
  } = useAppSelector((state) => state.brand);
  const [files, setFiles] = React.useState<File[]>([]);
  const [logoImage, setLogoImage] = React.useState<File | null>(null);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);

  const form = useForm<IBrand>({ defaultValues: {} });

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleBrand(entityId));
    }
  }, [entityId]);

  // Sync form data when bData changes
  React.useEffect(() => {
    if (bData) {
      form.reset(bData);
    }
  }, [bData, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateBrandData({
        [name]:
          type === 'file'
            ? files?.[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  // Handle ReactQuill change
  const handleQuillChange = (value: string, field: string) => {
    form.setValue(field as any, value);
    dispatch(updateBrandData({ [field]: value }));
  };

  function onSubmit() {
    dispatch(addEditBrand(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/store/brands');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Brand Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="name.en"
                      label="Name (English)"
                      placeholder="Enter your name"
                      value={(bData as IBrand)?.name?.en}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="short_description.en"
                      label="Short description (English)"
                      value={(bData as IBrand)?.short_description?.en}
                      placeholder="Enter your short description"
                      onChange={handleInputChange}
                    />
                    <FormField
                      control={form.control}
                      name="long_description.en"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Long Description (English)</FormLabel>
                          <FormControl>
                            <ReactQuill
                              value={
                                field.value ||
                                (bData as IBrand)?.long_description?.en ||
                                ''
                              }
                              onChange={(value) =>
                                handleQuillChange(value, 'long_description.en')
                              }
                              placeholder="Enter your long description"
                              modules={{
                                toolbar: [
                                  [
                                    { header: '1' },
                                    { header: '2' },
                                    { font: [] }
                                  ],
                                  [{ list: 'ordered' }, { list: 'bullet' }],
                                  ['bold', 'italic', 'underline'],
                                  ['link'],
                                  [{ align: [] }],
                                  ['image']
                                ]
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="Hindi">
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="name.hi"
                      label="Name (Hindi)"
                      placeholder="Enter your name"
                      value={(bData as IBrand)?.name?.hi}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="short_description.hi"
                      label="Short description (Hindi)"
                      value={(bData as IBrand)?.short_description?.hi}
                      placeholder="Enter your short description"
                      onChange={handleInputChange}
                    />
                    <FormField
                      control={form.control}
                      name="long_description.hi"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Long Description (Hindi)</FormLabel>
                          <FormControl>
                            <ReactQuill
                              value={
                                field.value ||
                                (bData as IBrand)?.long_description?.hi ||
                                ''
                              }
                              onChange={(value) =>
                                handleQuillChange(value, 'long_description.hi')
                              }
                              placeholder="Enter your long description"
                              modules={{
                                toolbar: [
                                  [
                                    { header: '1' },
                                    { header: '2' },
                                    { font: [] }
                                  ],
                                  [{ list: 'ordered' }, { list: 'bullet' }],
                                  ['bold', 'italic', 'underline'],
                                  ['link'],
                                  [{ align: [] }],
                                  ['image']
                                ]
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </TabsContent>
              </Tabs>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="sequence"
                  label="Sequence"
                  placeholder="Enter your Sequence"
                  value={(bData as IBrand)?.sequence}
                  onChange={handleInputChange}
                  type="number"
                />
                <CustomTextField
                  label="Meta Title"
                  name="meta_title"
                  placeholder="Enter meta title"
                  onChange={handleInputChange}
                  value={(bData as IBrand)?.meta_title}
                />
                <CustomTextField
                  name="meta_description"
                  label="Meta Description"
                  placeholder="Enter your meta description"
                  value={(bData as IBrand)?.meta_description}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="meta_tag"
                  label="Meta Tag"
                  placeholder="Enter your meta tag"
                  value={(bData as IBrand)?.meta_tag}
                  onChange={handleInputChange}
                />
              </div>

              <FormItem className="space-y-3">
                <FormLabel>Logo</FormLabel>
                <FileUploader
                  value={logoImage ? [logoImage] : []}
                  onValueChange={(newFiles: any) => {
                    setLogoImage(newFiles[0] || null);
                    handleInputChange({
                      target: {
                        name: 'logo_image',
                        type: 'file',
                        files: newFiles
                      }
                    });
                  }}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />{' '}
                <>
                  {typeof (bData as IBrand)?.logo_image === 'string' && (
                    <>
                      <div className="max-h-48 space-y-4">
                        <FileViewCard
                          existingImageURL={(bData as IBrand)?.logo_image}
                        />
                      </div>
                    </>
                  )}
                </>
              </FormItem>
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
                  {typeof (bData as IBrand)?.banner_image === 'string' && (
                    <>
                      <div className="max-h-48 space-y-4">
                        <FileViewCard
                          existingImageURL={(bData as IBrand)?.banner_image}
                        />
                      </div>
                    </>
                  )}
                </>
              </FormItem>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
