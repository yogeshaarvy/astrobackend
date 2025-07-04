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
  addEditAboutConfig,
  fetchAboutConfig,
  type IAboutConfig,
  updateAboutConfig
} from '@/redux/slices/aboutSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    aboutConfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.aboutConfig);
  console.log('this is the cData', cData);

  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  const [dividerimage, setdividerimage] = React.useState<File | null>(null);
  const [sideimage, setsideimage] = React.useState<File | null>(null);
  const [side_image, setside_image] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchAboutConfig(null));
  }, []);

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateAboutConfig({
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
      dispatch(addEditAboutConfig(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImage(null);
          setdividerimage(null);
          setsideimage(null);
          setside_image(null);
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
    dispatch(updateAboutConfig({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <div className="mx-auto w-full space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Meta Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Vibhor Config
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CustomTextField
                  name="metaTitle"
                  label="Meta Title"
                  placeholder="Enter your Meta Title"
                  value={(cData as IAboutConfig)?.metaTitle}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="metaDescription"
                  label="Meta Description"
                  placeholder="Enter your Meta Description"
                  value={(cData as IAboutConfig)?.metaDescription}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="metaKeyword"
                  label="Meta keywords"
                  placeholder="Enter your Meta Keywords"
                  value={(cData as IAboutConfig)?.metaKeyword}
                  onChange={handleInputChange}
                />
              </CardContent>
            </Card>

            {/* Banner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Banner Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner Image Upload */}
                <FormItem className="space-y-3">
                  <FormLabel>Banner Image</FormLabel>
                  <FileUploader
                    value={bannerImage ? [bannerImage] : []}
                    onValueChange={(newFiles: any) => {
                      setbannerImage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'banner.bannerImage',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IAboutConfig)?.banner?.bannerImage ===
                    'string' && (
                    <div className="max-h-48">
                      <FileViewCard
                        existingImageURL={
                          (cData as IAboutConfig)?.banner?.bannerImage
                        }
                      />
                    </div>
                  )}
                </FormItem>

                {/* Banner Title Tabs */}
                <div className="space-y-4">
                  <Label>Banner Title</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="English" className="mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="banner-title-en">Title</Label>
                        <Input
                          id="banner-title-en"
                          name="banner.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.banner?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="Hindi" className="mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="banner-title-hi">Title</Label>
                        <Input
                          id="banner-title-hi"
                          name="banner.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.banner?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Text Color Picker */}
                <div className="space-y-2">
                  <Label htmlFor="textColour">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      name="banner.textColor"
                      value={
                        (cData as IAboutConfig)?.banner?.textColor || '#000000'
                      }
                      onChange={handleInputChange}
                      className="h-10 w-12 cursor-pointer p-1"
                    />
                    <Input
                      type="text"
                      name="banner.textColor"
                      value={(cData as IAboutConfig)?.banner?.textColor || ''}
                      onChange={handleInputChange}
                      placeholder="Enter color hex code"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  1st Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Divider Image Upload */}
                <FormItem className="space-y-3">
                  <FormLabel>Divider Image</FormLabel>
                  <FileUploader
                    value={dividerimage ? [dividerimage] : []}
                    onValueChange={(newFiles: any) => {
                      setdividerimage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'section1.dividerImage',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IAboutConfig)?.section1?.dividerImage ===
                    'string' && (
                    <div className="max-h-48">
                      <FileViewCard
                        existingImageURL={
                          (cData as IAboutConfig)?.section1?.dividerImage
                        }
                      />
                    </div>
                  )}
                </FormItem>

                {/* Section Content Tabs */}
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="English" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section1-title-en">Title</Label>
                        <Input
                          id="section1-title-en"
                          name="section1.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section1?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section1.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section1?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section1.description.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="Hindi" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section1-title-hi">Title</Label>
                        <Input
                          id="section1-title-hi"
                          name="section1.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section1?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section1.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section1?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section1.description.hi',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </CardFooter>
            </Card>

            {/* second Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  2nd Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Divider Image Upload */}
                <FormItem className="space-y-3">
                  <FormLabel>Side Image</FormLabel>
                  <FileUploader
                    value={sideimage ? [sideimage] : []}
                    onValueChange={(newFiles: any) => {
                      setsideimage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'section2.sideImage',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IAboutConfig)?.section2?.sideImage ===
                    'string' && (
                    <div className="max-h-48">
                      <FileViewCard
                        existingImageURL={
                          (cData as IAboutConfig)?.section2?.sideImage
                        }
                      />
                    </div>
                  )}
                </FormItem>

                {/* Section Content Tabs */}
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="English" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section2-title-en">Title</Label>
                        <Input
                          id="section2-title-en"
                          name="section2.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section2?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section2.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section2?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section2.description.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="Hindi" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section2-title-hi">Title</Label>
                        <Input
                          id="section2-title-hi"
                          name="section2.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section2?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section2.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section2?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section2.description.hi',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </CardFooter>
            </Card>

            {/* Third Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  3rd Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Divider Image Upload */}
                <FormItem className="space-y-3">
                  <FormLabel>Side Image</FormLabel>
                  <FileUploader
                    value={side_image ? [side_image] : []}
                    onValueChange={(newFiles: any) => {
                      setside_image(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'section3.side_Image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IAboutConfig)?.section3?.side_Image ===
                    'string' && (
                    <div className="max-h-48">
                      <FileViewCard
                        existingImageURL={
                          (cData as IAboutConfig)?.section3?.side_Image
                        }
                      />
                    </div>
                  )}
                </FormItem>

                {/* Section Content Tabs */}
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="English" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section3-title-en">Title</Label>
                        <Input
                          id="section3-title-en"
                          name="section3.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section3?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section3.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section3?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section3.description.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="Hindi" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section3-title-hi">Title</Label>
                        <Input
                          id="section3-title-hi"
                          name="section3.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section3?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section2.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section3?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section3.description.hi',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
};

export default Page;
