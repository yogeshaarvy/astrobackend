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
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditMobileKundli,
  fetchMobileKundli,
  IMobileKundli,
  updateMobileKundli
} from '@/redux/slices/kundli/mobileKundliConfigSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    mobileKundliState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.mobileKundli);

  console.log('this is the response value of the mobile kundli', cData);
  const [sectionOneImage, setsectionOneImage] = React.useState<File | null>(
    null
  );
  const [sectionTwoImage, setsectionTwoImage] = React.useState<File | null>(
    null
  );
  const [sideImage, setsideImage] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchMobileKundli(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateMobileKundli({
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
      dispatch(addEditMobileKundli(null)).then((response: any) => {
        if (!response?.error) {
          setsectionOneImage(null);
          setsectionTwoImage(null);
          setsideImage(null);
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

    dispatch(
      updateMobileKundli({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Kundli Config List
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Main Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Tabs className="mt-4 w-full">
                  <div className="space-y-2 pt-0 ">
                    <FormItem className="space-y-3">
                      <FormLabel>Side Image</FormLabel>
                      <FileUploader
                        value={sideImage ? [sideImage] : []}
                        onValueChange={(newFiles: any) => {
                          setsideImage(newFiles[0] || null);
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
                      />{' '}
                      <>
                        {typeof (cData as IMobileKundli)?.mainSection
                          ?.sideImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IMobileKundli)?.mainSection
                                    ?.sideImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
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
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="mainSection.title.en"
                              placeholder="Enter your Title"
                              value={
                                (cData as IMobileKundli)?.mainSection?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.en"
                              label="Full Description"
                              value={
                                (cData as IMobileKundli)?.mainSection
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
                            <CustomTextEditor
                              name="mainSection.shortDescription.en"
                              label="Short Description"
                              value={
                                (cData as IMobileKundli)?.mainSection
                                  ?.shortDescription?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.shortDescription.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
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
                              name="mainSection.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IMobileKundli)?.mainSection?.title?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.hi"
                              label="Full Description"
                              value={
                                (cData as IMobileKundli)?.mainSection
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
                            <CustomTextEditor
                              name="mainSection.shortDescription.hi"
                              label="Short Description"
                              value={
                                (cData as IMobileKundli)?.mainSection
                                  ?.shortDescription?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.shortDescription.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                        </CardContent>
                      </>
                    </TabsContent>
                  </Tabs>
                </Tabs>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Section One
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-center gap-5">
                    <CardTitle>Section One</CardTitle>
                  </CardHeader>

                  <div className="space-x-2 pt-0 ">
                    <FormItem className="space-y-3">
                      <FormLabel>Section One Image</FormLabel>
                      <FileUploader
                        value={sectionOneImage ? [sectionOneImage] : []}
                        onValueChange={(newFiles: any) => {
                          setsectionOneImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'sectionOne.sectionOneImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IMobileKundli)?.sectionOne
                          ?.sectionOneImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IMobileKundli)?.sectionOne
                                    ?.sectionOneImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
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
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Section One English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="sectionOne.title.en"
                              placeholder="Enter your Title "
                              value={
                                (cData as IMobileKundli)?.sectionOne?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="sectionOne.description.en"
                              label="Full Description "
                              value={
                                (cData as IMobileKundli)?.sectionOne
                                  ?.description?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'sectionOne.description.en',
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
                          <CardTitle>Section One Hindi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="sectionOne.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IMobileKundli)?.sectionOne?.title
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="sectionOne.description.hi"
                              label="Full Description"
                              value={
                                (cData as IMobileKundli)?.sectionOne
                                  ?.description?.hi || ''
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'sectionOne.description.hi',
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Section Two
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-center gap-5">
                    <CardTitle>Section Two</CardTitle>
                  </CardHeader>

                  <div className="space-x-2 pt-0 ">
                    <FormItem className="space-y-3">
                      <FormLabel>Section Two Image</FormLabel>
                      <FileUploader
                        value={sectionTwoImage ? [sectionTwoImage] : []}
                        onValueChange={(newFiles: any) => {
                          setsectionTwoImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'sectionTwo.sectionTwoImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IMobileKundli)?.sectionTwo
                          ?.sectionTwoImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IMobileKundli)?.sectionTwo
                                    ?.sectionTwoImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
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
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Section Two English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="sectionTwo.title.en"
                              placeholder="Enter your Title "
                              value={
                                (cData as IMobileKundli)?.sectionTwo?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="sectionTwo.description.en"
                              label="Full Description "
                              value={
                                (cData as IMobileKundli)?.sectionTwo
                                  ?.description?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'sectionTwo.description.en',
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
                          <CardTitle>Section Two Hindi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="sectionTwo.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IMobileKundli)?.sectionTwo?.title
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="sectionTwo.description.hi"
                              label="Full Description"
                              value={
                                (cData as IMobileKundli)?.sectionTwo
                                  ?.description?.hi || ''
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'sectionTwo.description.hi',
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
