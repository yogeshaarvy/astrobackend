'use client';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditTermConditionsPage,
  fetchTermConditionsPage,
  ITermConditions,
  updateTermConditionsPage
} from '@/redux/slices/pages/promiseSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    termConditionsState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.promise);

  useEffect(() => {
    dispatch(fetchTermConditionsPage(null));
  }, []);

  const form = useForm({});

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateTermConditionsPage({
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
    try {
      dispatch(addEditTermConditionsPage(null)).then((response: any) => {
        if (!response?.error) {
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
            Term & Conditions Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Tabs defaultValue="web" className="mt-4 w-full">
                  {/* Web Tab Content */}
                  <TabsContent value="web">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-center gap-5">
                        <CardTitle>
                          TERM'S & CONDITIONS SECTION'S (WEBSITE)
                        </CardTitle>
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
                          <div>
                            <CardHeader className="flex flex-row items-center justify-between">
                              <CardTitle>
                                TERM-&-CONDITIONS-WEB-ENGLISH
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                              <div className="space-y-1">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                  name="title.en"
                                  placeholder="Enter your Title"
                                  value={
                                    (cData as ITermConditions)?.title?.en || ''
                                  }
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="space-y-1">
                                <CustomTextEditor
                                  name="description.en"
                                  label="Full Description"
                                  value={
                                    (cData as ITermConditions)?.description
                                      ?.en || ''
                                  }
                                  onChange={(value) =>
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
                            </CardContent>
                          </div>
                        </TabsContent>
                        <TabsContent value="Hindi">
                          <div>
                            <CardHeader className="flex flex-row items-center justify-between">
                              <CardTitle>TERM-&-CONDITIONS-WEB-HINDI</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                              <div className="space-y-1">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                  name="title.hi"
                                  placeholder="Enter your Title"
                                  value={
                                    (cData as ITermConditions)?.title?.hi || ''
                                  }
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="space-y-1">
                                <CustomTextEditor
                                  name="description.hi"
                                  label="Full Description"
                                  value={
                                    (cData as ITermConditions)?.description
                                      ?.hi || ''
                                  }
                                  onChange={(value) =>
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
                            </CardContent>
                          </div>
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
};

export default Page;
