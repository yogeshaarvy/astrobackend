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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditWhyChoose,
  fetchWhyChoose,
  type IWhyChooseConfig,
  updateWhyChoose
} from '@/redux/slices/whyChooseSlice';
import CustomTextField from '@/utils/CustomTextField';
import CustomTextEditor from '@/utils/CustomTextEditor';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    whyChooseConfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.whyChooseConfig);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  const [sideImage, setsideImage] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchWhyChoose(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateWhyChoose({
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
      dispatch(addEditWhyChoose(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImage(null);

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
      updateWhyChoose({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Why Choose Config List
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
                name="metaTitle"
                // control={form.control}
                label="Meta Title"
                placeholder="Enter your Meta Title"
                value={(cData as IWhyChooseConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                // control={form.control}
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IWhyChooseConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                // control={form.control}
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IWhyChooseConfig)?.metaKeyword}
                onChange={handleInputChange}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Section 1
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
                      <FormLabel>Banner Image</FormLabel>
                      <FileUploader
                        value={bannerImage ? [bannerImage] : []}
                        onValueChange={(newFiles: any) => {
                          setbannerImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'mainSection.bannerImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IWhyChooseConfig)?.mainSection
                          ?.bannerImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IWhyChooseConfig)?.mainSection
                                    ?.bannerImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                      <FormLabel>Side Image</FormLabel>
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
                                (cData as IWhyChooseConfig)?.mainSection?.title
                                  ?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <CustomTextEditor
                            name="mainSection.description.en"
                            label="Description"
                            value={
                              (cData as IWhyChooseConfig)?.mainSection
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
                                (cData as IWhyChooseConfig)?.mainSection?.title
                                  ?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <CustomTextEditor
                            name="mainSection.description.hi"
                            label="Description"
                            value={
                              (cData as IWhyChooseConfig)?.mainSection
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
            Section 2
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
                        {typeof (cData as IWhyChooseConfig)?.mainSection
                          ?.sideImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IWhyChooseConfig)?.mainSection
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
                            <Label htmlFor="name">Side Title</Label>
                            <Input
                              name="mainSection.sideTitle.en"
                              placeholder="Enter your Side Title"
                              value={
                                (cData as IWhyChooseConfig)?.mainSection
                                  ?.sideTitle?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <CustomTextEditor
                            name="mainSection.sideDescription.en"
                            label="Description"
                            value={
                              (cData as IWhyChooseConfig)?.mainSection
                                ?.sideDescription?.en
                            }
                            onChange={(value) =>
                              handleInputChange({
                                target: {
                                  name: 'mainSection.sideDescription.en',
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
                            <Label htmlFor="name">Side Title</Label>
                            <Input
                              name="mainSection.sideTitle.hi"
                              placeholder="Enter your Side Title"
                              value={
                                (cData as IWhyChooseConfig)?.mainSection
                                  ?.sideTitle?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <CustomTextEditor
                            name="mainSection.sideDescription.hi"
                            label="Description"
                            value={
                              (cData as IWhyChooseConfig)?.mainSection
                                ?.sideDescription?.hi
                            }
                            onChange={(value) =>
                              handleInputChange({
                                target: {
                                  name: 'mainSection.sideDescription.hi',
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
