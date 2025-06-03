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
  addEditConfigPage,
  fetchConfig,
  IConfig,
  setConfig,
  updateConfig
} from '@/redux/slices/home/configSlice';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import CustomTextField from '@/utils/CustomTextField';
import { title } from 'process';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    configState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.configs);

  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [lightLogo, setLightLogo] = useState<File | null>(null);
  const [divide_Image, setDivide_Image] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchConfig(null));
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
      updateConfig({
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

    dispatch(addEditConfigPage(null)).then((response: any) => {
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
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <Card className="mx-auto mb-16 w-full">
              <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                  Home Config List
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
                      value={(cData as IConfig)?.metaTitle}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="metaDescription"
                      // control={form.control}
                      label="Meta Description"
                      placeholder="Enter your Meta Description"
                      value={(cData as IConfig)?.metaDescription}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="metaKeywords"
                      // control={form.control}
                      label="Meta keywords"
                      placeholder="Enter your Meta Keywords"
                      value={(cData as IConfig)?.metaKeyword || ''}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="name"
                      // control={form.control}
                      label="Name"
                      placeholder="Enter your Name"
                      value={(cData as IConfig)?.name || ''}
                      onChange={handleInputChange}
                    />
                    {/* <CustomTextField
                      name="ourServices"
                      label='Our Services'
                      placeholder="Enter your Our Services"
                      value={(cData as IConfig)?.ourServices?.title?.en || ''}
                    /> */}

                    <FormItem className="space-y-3">
                      <FormLabel>Our Services</FormLabel>

                      <FileUploader
                        value={divide_Image ? [divide_Image] : []}
                        onValueChange={(newFiles: any) => {
                          setDivide_Image(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'divide_Image',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />

                      {typeof (cData as IConfig)?.ourServices?.divide_Image ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IConfig)?.ourServices?.divide_Image
                            }
                          />
                        </div>
                      )}
                    </FormItem>

                    {/* horoforest */}

                    {/* <CustomTextField
                      name="horoscopeForest"
                      label="Horoscope Forest"
                      placeholder="Enter your Horoscope Forest"
                      value={(cData as IConfig)?.horoscopeForest?.title?.en || ''}
                    /> */}

                    <FormItem className="space-y-3">
                      <FormLabel>HoroscopeForest</FormLabel>

                      <FileUploader
                        value={divide_Image ? [divide_Image] : []}
                        onValueChange={(newFiles: any) => {
                          setDivide_Image(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'divide_Image',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />

                      {typeof (cData as IConfig)?.ourServices?.divide_Image ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IConfig)?.ourServices?.divide_Image
                            }
                          />
                        </div>
                      )}
                    </FormItem>

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
                              <Label htmlFor="name">Latest Articles</Label>
                              <Input
                                name="title.en"
                                placeholder="Enter your Latest Articles"
                                value={
                                  (cData as IConfig)?.latestArticles?.title?.en
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
                              <Label htmlFor="name">Latest Articles</Label>
                              <Input
                                name="title.hi"
                                placeholder="Enter your LatestArticles"
                                value={
                                  (cData as IConfig)?.latestArticles?.title?.hi
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                          </CardContent>
                        </>
                      </TabsContent>
                    </Tabs>

                    {/* <CustomTextField
                      name="latestArticles"
                      label="Latest Articles"
                      placeholder="Enter your Latest Articles"
                      value={(cData as IConfig)?.latestArticles?.title?.en || ''}
                    /> */}

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
                              <Label htmlFor="name">Talk To Astrologer</Label>
                              <Input
                                name="title.en"
                                placeholder="Enter your Talk To Astrologer"
                                value={
                                  (cData as IConfig)?.talkToAstrologer?.title
                                    ?.en
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
                              <Label htmlFor="name">Talk To Astrologer</Label>
                              <Input
                                name="title.hi"
                                placeholder="Enter your Talk To Astrologer"
                                value={
                                  (cData as IConfig)?.talkToAstrologer?.title
                                    ?.hi
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                          </CardContent>
                        </>
                      </TabsContent>
                    </Tabs>

                    {/* <CustomTextField
                      name="talkToAstrologer"
                      label="Talk To Astrologer"
                      placeholder='Enter your Talk To Astrologer'
                      value={(cData as IConfig)?.talkToAstrologer?.title?.en || ''}
                    /> */}

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
                              <Label htmlFor="name">Ved Mantra Jaap</Label>
                              <Input
                                name="title.en"
                                placeholder="Enter your Ved Mantra Jaap"
                                value={
                                  (cData as IConfig)?.vedMantraJaap?.title?.en
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
                              <Label htmlFor="name">Ved Mantra Jaap</Label>
                              <Input
                                name="title.hi"
                                placeholder="Enter your Ved Mantra Jaap"
                                value={
                                  (cData as IConfig)?.vedMantraJaap?.title?.hi
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                          </CardContent>
                        </>
                      </TabsContent>
                    </Tabs>

                    {/* <CustomTextField
                      name="vedMantraJaap"
                      label="Ved Mantra Jaap"
                      placeholder='Enter your Ved Mantra Jaap'
                      value={(cData as IConfig)?.vedMantraJaap?.title?.en || ''}
                    /> */}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
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
    </PageContainer>
  );
};

export default Page;
