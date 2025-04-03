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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditTestimonialList,
  fetchSingleTestimonialList,
  ITestimonial,
  updateTestimonialListData
} from '@/redux/slices/horoscope/testimonialSlice';

import CustomTextEditor from '@/utils/CustomTextEditor';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleTestimonialState: { data: jData }
  } = useAppSelector((state) => state.testimonial);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const form = useForm({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleTestimonialList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateTestimonialListData({
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
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const requiredFields: (keyof ITestimonial)[] = ['title'];

    const missingFields = requiredFields.filter(
      (field) => !(jData as ITestimonial)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof ITestimonial]?: string } = {
        title: 'Title'
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
      dispatch(addEditTestimonialList(entityId || '')).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/horoscope/testimonial');
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
            Testimonial List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
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
                    <>
                      <CardContent className="space-y-2 p-0">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="title.en"
                            placeholder="Enter your Title"
                            value={(jData as ITestimonial)?.title?.en || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            name="name.en"
                            placeholder="Enter your Name"
                            value={(jData as ITestimonial)?.name?.en || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="review.en"
                              label="Full Description"
                              value={(jData as ITestimonial)?.review?.en}
                              onChange={(value: any) =>
                                handleInputChange({
                                  target: {
                                    name: 'review.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </>
                  </TabsContent>

                  <TabsContent value="Hindi">
                    <>
                      <CardContent className="space-y-2 p-0">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="title.hi"
                            placeholder="Enter your Title"
                            value={(jData as ITestimonial)?.title?.hi || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            name="name.hi"
                            placeholder="Enter your Name"
                            value={(jData as ITestimonial)?.name?.hi || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="review.hi"
                              label="Full Description"
                              value={(jData as ITestimonial)?.review?.hi}
                              onChange={(value: any) =>
                                handleInputChange({
                                  target: {
                                    name: 'review.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </>
                  </TabsContent>
                </Tabs>

                <div className="space-y-1">
                  <Label htmlFor="name">Sequence</Label>
                  <Input
                    name="sequence"
                    placeholder="Enter Sequence"
                    type="number"
                    value={(jData as ITestimonial)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="name">Date</Label>
                  <Input
                    name="date"
                    placeholder=""
                    type="date"
                    value={
                      (jData as ITestimonial)?.date
                        ? new Date((jData as ITestimonial)?.date || '')
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  {/* <FormLabel></FormLabel> */}
                  <Label htmlFor="name" className="space-x-3">
                    Read Button
                  </Label>
                  <Switch
                    className="!m-0"
                    checked={(jData as ITestimonial)?.readStatus}
                    onCheckedChange={(checked: any) =>
                      handleInputChange({
                        target: {
                          type: 'checkbox',
                          name: 'readStatus',
                          checked
                        }
                      })
                    }
                    aria-label="Toggle Active Status"
                  />
                </div>

                {(jData as ITestimonial)?.readStatus && (
                  <div className="space-y-1">
                    <Label htmlFor="name">Read Link</Label>
                    <Input
                      name="readLinks"
                      placeholder="Enter Your Link"
                      value={(jData as ITestimonial)?.readLinks || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <FormItem className="space-y-3">
                  <FormLabel>Profile Logo</FormLabel>
                  <FileUploader
                    value={profileImage ? [profileImage] : []}
                    onValueChange={(newFiles: any) => {
                      setProfileImage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'profile_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />{' '}
                  <>
                    {typeof (jData as ITestimonial)?.profile_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (jData as ITestimonial)?.profile_image
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                </FormItem>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Button type="submit" onClick={(e: any) => handleSubmit(e)}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
