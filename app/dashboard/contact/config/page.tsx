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
  addEditContactConfig,
  fetchContactConfig,
  IContactConfig,
  updateContactConfig
} from '@/redux/slices/contact/contactConfigSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    contactConfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.contactConfig);

  const [bannerImageEn, setbannerImageEn] = React.useState<File | null>(null);
  const [bannerImageHi, setbannerImageHi] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchContactConfig(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateContactConfig({
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
      dispatch(addEditContactConfig(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImageEn(null);
          setbannerImageHi(null);
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
      updateContactConfig({ [name]: value }) // .then(handleReduxResponse());
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
                value={(cData as IContactConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                // control={form.control}
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IContactConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                // control={form.control}
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IContactConfig)?.metaKeyword}
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
                          <div className="space-y-2 pt-0 ">
                            <FormItem className="space-y-3">
                              <FormLabel>Banner Image</FormLabel>
                              <FileUploader
                                value={bannerImageEn ? [bannerImageEn] : []}
                                onValueChange={(newFiles: any) => {
                                  setbannerImageEn(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'mainSection.bannerImage.en',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />{' '}
                              <>
                                {typeof (cData as IContactConfig)?.mainSection
                                  ?.bannerImage?.en === 'string' && (
                                  <>
                                    <div className="max-h-48 space-y-4">
                                      <FileViewCard
                                        existingImageURL={
                                          (cData as IContactConfig)?.mainSection
                                            ?.bannerImage?.en
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </>
                            </FormItem>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="mainSection.title.en"
                              placeholder="Enter your Title"
                              value={
                                (cData as IContactConfig)?.mainSection?.title
                                  ?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.address.en"
                              label="Enter your Full Address"
                              value={
                                (cData as IContactConfig)?.mainSection?.address
                                  ?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.address.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.schedule.en"
                              label="Enter your Full schedule"
                              value={
                                (cData as IContactConfig)?.mainSection?.schedule
                                  ?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.schedule.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.mapTitle.en"
                              label="Enter your Map Title"
                              value={
                                (cData as IContactConfig)?.mainSection?.mapTitle
                                  ?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.mapTitle.en',
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
                          <div className="space-y-2 pt-0 ">
                            <FormItem className="space-y-3">
                              <FormLabel>Banner Image</FormLabel>
                              <FileUploader
                                value={bannerImageHi ? [bannerImageHi] : []}
                                onValueChange={(newFiles: any) => {
                                  setbannerImageHi(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'mainSection.bannerImage.hi',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />{' '}
                              <>
                                {typeof (cData as IContactConfig)?.mainSection
                                  ?.bannerImage?.hi === 'string' && (
                                  <>
                                    <div className="max-h-48 space-y-4">
                                      <FileViewCard
                                        existingImageURL={
                                          (cData as IContactConfig)?.mainSection
                                            ?.bannerImage?.hi
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </>
                            </FormItem>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="mainSection.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IContactConfig)?.mainSection?.title
                                  ?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.address.hi"
                              label="Enter your Full Address"
                              value={
                                (cData as IContactConfig)?.mainSection?.address
                                  ?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.address.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.schedule.hi"
                              label="Enter your Full schedule"
                              value={
                                (cData as IContactConfig)?.mainSection?.schedule
                                  ?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.schedule.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.mapTitle.hi"
                              label="Enter your Map Title"
                              value={
                                (cData as IContactConfig)?.mainSection?.mapTitle
                                  ?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.mapTitle.hi',
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

                  <div className="mt-2 space-y-1">
                    <Label htmlFor="name">Map Embed Link</Label>
                    <Input
                      name="mainSection.mapLink"
                      placeholder="Enter your Map Embed Link"
                      value={(cData as IContactConfig)?.mainSection?.mapLink}
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
