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
  addEditDownloadSection,
  fetchDownloadSection,
  IDownloadSection,
  updateDownloadSection
} from '@/redux/slices/downloadSection';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    downloadSectionState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.downloadSection);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  const [appStoreImage, setappStoreImage] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchDownloadSection(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateDownloadSection({
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
      dispatch(addEditDownloadSection(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImage(null);
          setappStoreImage(null);
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
      updateDownloadSection({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Download Section Config
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
                      <FormLabel>Google Play Image</FormLabel>
                      <FileUploader
                        value={bannerImage ? [bannerImage] : []}
                        onValueChange={(newFiles: any) => {
                          setbannerImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'contentSection.googleplayImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IDownloadSection)?.contentSection
                          ?.googleplayImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IDownloadSection)?.contentSection
                                    ?.googleplayImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
                    <FormItem className="space-y-3">
                      <FormLabel>App Store Image</FormLabel>
                      <FileUploader
                        value={appStoreImage ? [appStoreImage] : []}
                        onValueChange={(newFiles: any) => {
                          setappStoreImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'contentSection.appStoreImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IDownloadSection)?.contentSection
                          ?.appStoreImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IDownloadSection)?.contentSection
                                    ?.appStoreImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
                  </div>
                  <div className="space-y-2 pt-4 ">
                    <CustomTextField
                      name="contentSection.googleplayLink"
                      label="Google Play Link"
                      required={true}
                      placeholder="Enter your Google Play Link"
                      value={
                        (cData as IDownloadSection)?.contentSection
                          ?.googleplayLink
                      }
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="contentSection.appStoreLink"
                      label="App Store Link"
                      required={true}
                      placeholder="Enter your App Store Link"
                      value={
                        (cData as IDownloadSection)?.contentSection
                          ?.appStoreLink
                      }
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
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="contentSection.title.en"
                              placeholder="Enter your Title"
                              value={
                                (cData as IDownloadSection)?.contentSection
                                  ?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="name">Description</Label>
                            <Input
                              name="contentSection.description.en"
                              placeholder="Enter your Description"
                              value={
                                (cData as IDownloadSection)?.contentSection
                                  ?.description?.en
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
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="contentSection.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IDownloadSection)?.contentSection
                                  ?.title?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="name"> Description</Label>
                            <Input
                              name="contentSection.description.hi"
                              placeholder="Enter your Description"
                              value={
                                (cData as IDownloadSection)?.contentSection
                                  ?.description?.hi
                              }
                              onChange={handleInputChange}
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
