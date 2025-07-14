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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditSettingPage,
  fetchSetting,
  ISetting,
  setSetting,
  updateSetting
} from '@/redux/slices/settingsSlice';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    settingState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.settings);
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [lightLogo, setLightLogo] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchSetting(null));
  }, []);

  const form = useForm({
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      metaKeyword: ''
    }
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateSetting({
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
    if (!cData) {
      toast.error('Please fill in the required fields.');
      return;
    }

    dispatch(addEditSettingPage(null)).then((response: any) => {
      if (!response?.error) {
        setLightLogo(null);
        setDarkLogo(null);
        toast.success(response?.payload?.message);
      } else {
        toast.error(response.payload);
      }
    });
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            General Setting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Tabs defaultValue="gen" className="mt-4 w-full">
                  <TabsList className="flex w-full space-x-1 p-0">
                    <TabsTrigger
                      value="gen"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      BASIC
                    </TabsTrigger>
                    <TabsTrigger
                      value="web"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      APP's
                    </TabsTrigger>
                    <TabsTrigger
                      value="app"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      SOCIAL LINKS
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      SEO
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="gen">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-center gap-5">
                        <CardTitle>BASIC LOGO / IMAGES</CardTitle>
                      </CardHeader>

                      <div className="space-y-2 p-6 pt-0 ">
                        {/* Dark Logo */}
                        <FormItem className="space-y-3">
                          <FormLabel>Dark Logo</FormLabel>
                          <FileUploader
                            value={darkLogo ? [darkLogo] : []}
                            onValueChange={(newFiles: any) => {
                              setDarkLogo(newFiles[0] || null);
                              handleInputChange({
                                target: {
                                  name: 'image.dark_logo',
                                  type: 'file',
                                  files: newFiles
                                }
                              });
                            }}
                            accept={{ 'image/*': [] }}
                            maxSize={1024 * 1024 * 2}
                          />{' '}
                          <>
                            {typeof (cData as ISetting)?.image?.dark_logo ===
                              'string' && (
                              <>
                                <div className="max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ISetting)?.image?.dark_logo
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </>
                        </FormItem>

                        {/* Light Logo */}
                        <FormItem className="space-y-3">
                          <FormLabel>Light Logo</FormLabel>
                          <FileUploader
                            value={lightLogo ? [lightLogo] : []}
                            onValueChange={(newFiles: any) => {
                              setLightLogo(newFiles[0] || null);
                              handleInputChange({
                                target: {
                                  name: 'image.light_logo',
                                  type: 'file',
                                  files: newFiles
                                }
                              });
                            }}
                            accept={{ 'image/*': [] }}
                            maxSize={1024 * 1024 * 2}
                          />{' '}
                          <>
                            {typeof (cData as ISetting)?.image?.light_logo ===
                              'string' && (
                              <>
                                <div className="max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ISetting)?.image?.light_logo
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </>
                        </FormItem>
                      </div>

                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Copyright</Label>
                          <Input
                            name="general.copyright"
                            placeholder="Enter Copyright Link "
                            value={(cData as ISetting)?.general?.copyright}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Contect</Label>
                          <Input
                            name="contactUs.contact"
                            placeholder="Enter your Contact"
                            value={(cData as ISetting)?.contactUs?.contact}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Whatsapp No</Label>
                          <Input
                            name="contactUs.whatsapp_no"
                            type="number"
                            placeholder="Enter your Whatsapp No"
                            value={(cData as ISetting)?.contactUs?.whatsapp_no}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">E-Mail</Label>
                          <Input
                            name="contactUs.eMail"
                            placeholder="Enter your E-Mail"
                            value={(cData as ISetting)?.contactUs?.eMail}
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>

                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>CONTECT-INFO</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">
                            English Short Description
                          </Label>
                          <Input
                            name="contactUs.shortDescription.en"
                            placeholder="Enter your English Description"
                            value={
                              (cData as ISetting)?.contactUs?.shortDescription
                                ?.en
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Hindi Short Description</Label>
                          <Input
                            name="contactUs.shortDescription.hi"
                            placeholder="Enter your Hindi Description"
                            value={
                              (cData as ISetting)?.contactUs?.shortDescription
                                ?.hi
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Address</Label>
                          <Input
                            name="contactUs.address"
                            placeholder="Enter your Address"
                            value={(cData as ISetting)?.contactUs?.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Web Tab Content */}
                  <TabsContent value="web">
                    <Card className="mx-auto mb-16 w-full">
                      <CardHeader>
                        <CardTitle className="text-left text-lg font-bold">
                          APP's LINKS
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
                          <Label htmlFor="name">Play Store Link</Label>
                          <Input
                            name="app.play_store_link"
                            placeholder="Enter Play Store Link "
                            value={(cData as ISetting)?.app?.play_store_link}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="name">App Store Link</Label>
                          <Input
                            name="app.app_store_link"
                            placeholder="Enter App Store Link "
                            value={(cData as ISetting)?.app?.app_store_link}
                            onChange={handleInputChange}
                          />

                          {/* </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* App Tab Content */}
                  <TabsContent value="app">
                    <Card className="mx-auto mb-16 w-full">
                      <CardHeader>
                        <CardTitle className="text-left text-lg font-bold">
                          SOCIAL's LINKS
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
                          <Label htmlFor="name">Facebook Link</Label>
                          <Input
                            name="social_links.facebook"
                            placeholder="Enter Facebook URL Link "
                            value={(cData as ISetting)?.social_links?.facebook}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="name">Instagran Link</Label>
                          <Input
                            name="social_links.instagram"
                            placeholder="Enter Instagran URL Link "
                            value={(cData as ISetting)?.social_links?.instagram}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="name">Youtube Link</Label>
                          <Input
                            name="social_links.youtube"
                            placeholder="Enter youtube URL Link "
                            value={(cData as ISetting)?.social_links?.youtube}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="name">x Link</Label>
                          <Input
                            name="social_links.x"
                            placeholder="Enter x URL Link "
                            value={(cData as ISetting)?.social_links?.x}
                            onChange={handleInputChange}
                          />
                          {/* </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="seo">
                    <Card className="mx-auto mb-16 w-full">
                      <CardHeader>
                        <CardTitle className="text-left text-lg font-bold">
                          SEO
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
                          <Label htmlFor="name">Meta Title</Label>
                          <Input
                            name="seo.metaTitle"
                            placeholder="Enter Meta Title "
                            value={(cData as ISetting)?.seo?.metaTitle}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="name">Meta Description</Label>
                          <Input
                            name="seo.metaDescription"
                            placeholder="Enter Meta Description "
                            value={(cData as ISetting)?.seo?.metaDescription}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="name">Meta </Label>
                          <Input
                            name="seo.metaKeyword"
                            placeholder="Enter Meta Keyword"
                            value={(cData as ISetting)?.seo?.metaKeyword}
                            onChange={handleInputChange}
                          />

                          {/* </div> */}
                        </div>
                      </CardContent>
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
