'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import {
  addEditProjectfaqList,
  IProjectfaq,
  updateProjectfaqListData,
  fetchSingleProjectfaqList
} from '@/redux/slices/projectFaqSlice';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';

export default function HomeBannerForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleProjectfaqState: { loading, data: bData }
  } = useAppSelector((state) => state.projectfaq);

  const form = useForm<IProjectfaq>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleProjectfaqList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateProjectfaqListData({
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

  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      dispatch(addEditProjectfaqList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/settings/pages/project-faq');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(updateProjectfaqListData({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            HomeBanner List Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <Label htmlFor="name">Sequence</Label>
                  <Input
                    name="sequence"
                    placeholder="Enter Sequence"
                    type="number"
                    value={(bData as IProjectfaq)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>

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
                          <Label htmlFor="name">Question</Label>
                          <Input
                            name="question.en"
                            placeholder="Enter your Question"
                            value={(bData as IProjectfaq)?.question?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <CustomTextEditor
                          name="answer.en"
                          label="Full Answer"
                          value={(bData as IProjectfaq)?.answer?.en}
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'answer.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </CardContent>
                    </>
                  </TabsContent>

                  <TabsContent value="Hindi">
                    <>
                      <CardContent className="space-y-2 p-0">
                        <div className="space-y-1">
                          <Label htmlFor="name">Question</Label>
                          <Input
                            name="question.hi"
                            placeholder="Enter your Question"
                            value={(bData as IProjectfaq)?.question?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <CustomTextEditor
                          name="answer.hi"
                          label="Full Answer"
                          value={(bData as IProjectfaq)?.answer?.hi}
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'answer.hi',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </CardContent>
                    </>
                  </TabsContent>
                </Tabs>
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
