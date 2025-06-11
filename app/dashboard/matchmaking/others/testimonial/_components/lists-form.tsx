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
  addEditMatchMakingTestimonialList,
  fetchSingleMatchMakingTestimonialList,
  IMatchMakingTestimonial,
  updateMatchMakingTestimonialListData
} from '@/redux/slices/matchmaking/testimonial';

import CustomTextEditor from '@/utils/CustomTextEditor';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleMatchMakingTestimonialState: { data: jData }
  } = useAppSelector((state) => state.matchMakingTestimonial);
  console.log('this is falana dhimkana', jData);

  const form = useForm({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleMatchMakingTestimonialList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateMatchMakingTestimonialListData({
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
    try {
      dispatch(addEditMatchMakingTestimonialList(entityId)).then(
        (response: any) => {
          if (!response?.error) {
            router.push('/dashboard/matchmaking/others/testimonial');
            toast.success(response?.payload?.message);
          } else {
            toast.error(response.payload);
          }
        }
      );
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
                            value={
                              (jData as IMatchMakingTestimonial)?.title?.en ||
                              ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">subtitle</Label>
                          <Input
                            name="subtitle.en"
                            placeholder="Enter subtitlee"
                            value={
                              (jData as IMatchMakingTestimonial)?.subtitle
                                ?.en || ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="description.en"
                              label="Full Description"
                              value={
                                (jData as IMatchMakingTestimonial)?.description
                                  ?.en
                              }
                              onChange={(value: any) =>
                                handleInputChange({
                                  target: {
                                    name: 'description.en',
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
                            value={
                              (jData as IMatchMakingTestimonial)?.title?.hi ||
                              ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Subtitle</Label>
                          <Input
                            name="subtitle.hi"
                            placeholder="Enter Subtitle"
                            value={
                              (jData as IMatchMakingTestimonial)?.subtitle
                                ?.hi || ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="description.hi"
                              label="Full Description"
                              value={
                                (jData as IMatchMakingTestimonial)?.description
                                  ?.hi
                              }
                              onChange={(value: any) =>
                                handleInputChange({
                                  target: {
                                    name: 'description.hi',
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
                    value={(jData as IMatchMakingTestimonial)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>
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
