'use client';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditHomeVibhor,
  fetchHomeVibhor,
  type IHomeVibhor,
  updateHomeVibhor
} from '@/redux/slices/home/vibhor';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    homeVibhorState: { loading, data: hvData }
  } = useAppSelector((state) => state.homeVibhor);
  const [sideImage, setSideImage] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchHomeVibhor(null));
  }, []);

  const form = useForm({
    defaultValues: {}
  });

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (hvData?.mainSection?.active !== undefined) {
      setIsChecked(hvData.mainSection.active);
    }
  }, [hvData?.mainSection?.active]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateHomeVibhor({
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
    if (type === 'checkbox' && name === 'mainSection.active') {
      setIsChecked(checked);
    }
  };

  const handleToggleChange = () => {
    const updatedStatus = !isChecked;
    setIsChecked(updatedStatus);
    dispatch(
      updateHomeVibhor({
        'mainSection.active': updatedStatus
      })
    );
    dispatch(addEditHomeVibhor(null)).then((response: any) => {
      if (!response?.error) {
        toast.success('Home Vibhor status updated successfully');
      } else {
        toast.error(response.payload);
      }
    });
  };

  const handleSubmit = () => {
    try {
      dispatch(addEditHomeVibhor(null)).then((response: any) => {
        if (!response?.error) {
          setSideImage(null);
          toast.success('Home Vibhor data updated successfully');
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
    dispatch(updateHomeVibhor({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Home Vibhor - Main Section
          </CardTitle>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="mainSection.active"
              className="peer sr-only"
              checked={isChecked}
              onChange={handleToggleChange}
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isChecked ? 'Active' : 'Inactive'}
            </span>
          </label>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Tabs className="mt-4 w-full">
                  <div className="space-y-2 pt-0">
                    <FormItem className="space-y-3">
                      <FormLabel>Side Image</FormLabel>
                      <FileUploader
                        value={sideImage ? [sideImage] : []}
                        onValueChange={(newFiles: any) => {
                          setSideImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'mainSection.sideImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      <>
                        {typeof (hvData as IHomeVibhor)?.mainSection
                          ?.sideImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (hvData as IHomeVibhor)?.mainSection
                                    ?.sideImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
                  </div>

                  <div className="mt-4 space-y-3">
                    <CustomDropdown
                      label="Image Alignment"
                      name="mainSection.imageAlignment"
                      defaultValue="right"
                      data={[
                        { name: 'Left', _id: 'left' },
                        { name: 'Right', _id: 'right' }
                      ]}
                      value={
                        (hvData as IHomeVibhor)?.mainSection?.imageAlignment ||
                        'right'
                      }
                      onChange={handleDropdownChange}
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
                            <CustomTextEditor
                              name="mainSection.title.en"
                              label="Title"
                              value={
                                (hvData as IHomeVibhor)?.mainSection?.title?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.title.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.en"
                              label="Description"
                              value={
                                (hvData as IHomeVibhor)?.mainSection
                                  ?.description?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.description.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="buttonTitle">Button Title</Label>
                            <Input
                              name="mainSection.buttonTitle.en"
                              placeholder="Enter Button Title"
                              value={
                                (hvData as IHomeVibhor)?.mainSection
                                  ?.buttonTitle?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>
                      </>
                    </TabsContent>

                    <TabsContent value="Hindi">
                      <>
                        <CardContent className="space-y-2 p-0">
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.title.hi"
                              label="Title"
                              value={
                                (hvData as IHomeVibhor)?.mainSection?.title?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.title.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.hi"
                              label="Description"
                              value={
                                (hvData as IHomeVibhor)?.mainSection
                                  ?.description?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.description.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="buttonTitle">Button Title</Label>
                            <Input
                              name="mainSection.buttonTitle.hi"
                              placeholder="Enter Button Title"
                              value={
                                (hvData as IHomeVibhor)?.mainSection
                                  ?.buttonTitle?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>
                      </>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-4 space-y-1">
                    <Label htmlFor="buttonLink">Button Link</Label>
                    <Input
                      name="mainSection.buttonLink"
                      placeholder="Enter Button Link"
                      value={(hvData as IHomeVibhor)?.mainSection?.buttonLink}
                      onChange={handleInputChange}
                    />
                  </div>
                </Tabs>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
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
    </PageContainer>
  );
};

export default Page;
