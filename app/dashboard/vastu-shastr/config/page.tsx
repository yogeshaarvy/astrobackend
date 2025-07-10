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
  addEditVastuShastraConfig,
  fetchVastuShastraConfig,
  IVastuShastraConfig,
  updateVastuShastraConfig
} from '@/redux/slices/vastushastr/config';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    vastuShastraStateConfig: { loading, data: cData = [] }
  } = useAppSelector((state) => state.vastushastrConfig);

  console.log('this is the value of cData', cData);
  const [banner, setBannerOne] = React.useState<File | null>(null);
  const [bannerTwo, setBannerTwo] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchVastuShastraConfig(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateVastuShastraConfig({
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
      dispatch(addEditVastuShastraConfig(null)).then((response: any) => {
        if (!response?.error) {
          setBannerOne(null);
          setBannerTwo(null);
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
      updateVastuShastraConfig({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Vastu Shastra Config List
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
                value={(cData as IVastuShastraConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                // control={form.control}
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IVastuShastraConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                // control={form.control}
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IVastuShastraConfig)?.metaKeyword}
                onChange={handleInputChange}
              />
            </form>
          </Form>
        </CardContent>
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
                      <FormLabel>Banner One </FormLabel>
                      <FileUploader
                        value={banner ? [banner] : []}
                        onValueChange={(newFiles: any) => {
                          setBannerOne(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'mainSection.bannerOne',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IVastuShastraConfig)?.mainSection
                          ?.bannerOne === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IVastuShastraConfig)?.mainSection
                                    ?.bannerOne
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                      <FormLabel>Banner Two</FormLabel>
                      <FileUploader
                        value={bannerTwo ? [bannerTwo] : []}
                        onValueChange={(newFiles: any) => {
                          setBannerTwo(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'mainSection.bannerTwo',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IVastuShastraConfig)?.mainSection
                          ?.bannerTwo === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IVastuShastraConfig)?.mainSection
                                    ?.bannerTwo
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
                                (cData as IVastuShastraConfig)?.mainSection
                                  ?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.en"
                              label="Description"
                              value={
                                (cData as IVastuShastraConfig)?.mainSection
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
                                (cData as IVastuShastraConfig)?.mainSection
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
                                (cData as IVastuShastraConfig)?.mainSection
                                  ?.title?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.hi"
                              label="Description"
                              value={
                                (cData as IVastuShastraConfig)?.mainSection
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
                                (cData as IVastuShastraConfig)?.mainSection
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
