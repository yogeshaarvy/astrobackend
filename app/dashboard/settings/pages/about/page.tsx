'use client';

import { FileUploader, FileViewCard } from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    aboutConfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.aboutConfig);

  console.log('this is the cData', cData);

  const [bannerImageEn, setbannerImageEn] = React.useState<File | null>(null);
  const [bannerImageHi, setbannerImageHi] = React.useState<File | null>(null);
  const [dividerimage, setdividerimage] = React.useState<File | null>(null);
  const [sideimageEn, setsideimageEn] = React.useState<File | null>(null);
  const [sideimageHi, setsideimageHi] = React.useState<File | null>(null);
  const [side_imageEn, setside_imageEn] = React.useState<File | null>(null);
  const [side_imageHi, setside_imageHi] = React.useState<File | null>(null);
  const [side_Image4En, setside_Image4En] = React.useState<File | null>(null);
  const [side_Image4Hi, setside_Image4Hi] = React.useState<File | null>(null);
  const [side_Image5En, setside_Image5En] = React.useState<File | null>(null);
  const [side_Image5Hi, setside_Image5Hi] = React.useState<File | null>(null);
  const [side_Image6, setside_Image6] = React.useState<File | null>(null);
  const [side_Image7, setside_Image7] = React.useState<File | null>(null);

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
          setbannerImageEn(null);
          setdividerimage(null);
          setsideimageEn(null);
          setside_imageEn(null);
          setside_Image4En(null);
          setside_Image5En(null);
          setbannerImageHi(null);
          setsideimageHi(null);
          setside_imageHi(null);
          setside_Image4Hi(null);
          setside_Image5Hi(null);
          setside_Image6(null);
          setside_Image7(null);
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
                {/* Banner Title Tabs */}
                <div className="space-y-4">
                  <Label>Banner Title</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4">
                      {/* Banner Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Banner Image (English)</FormLabel>
                        <FileUploader
                          value={bannerImageEn ? [bannerImageEn] : []}
                          onValueChange={(newFiles: any) => {
                            setbannerImageEn(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'banner.bannerImage.en',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.banner?.bannerImage
                          ?.en === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.banner?.bannerImage?.en
                              }
                            />
                          </div>
                        )}
                      </FormItem>

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
                      <FormItem className="space-y-3">
                        <FormLabel>Banner Image (Hindi)</FormLabel>
                        <FileUploader
                          value={bannerImageHi ? [bannerImageHi] : []}
                          onValueChange={(newFiles: any) => {
                            setbannerImageHi(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'banner.bannerImage.hi',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.banner?.bannerImage
                          ?.hi === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.banner?.bannerImage?.hi
                              }
                            />
                          </div>
                        )}
                      </FormItem>
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
            </Card>

            {/* Second Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  2nd Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Section Content Tabs */}
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4 space-y-4">
                      {/* Side Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (English)</FormLabel>
                        <FileUploader
                          value={sideimageEn ? [sideimageEn] : []}
                          onValueChange={(newFiles: any) => {
                            setsideimageEn(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section2.sideImage.en',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section2?.sideImage
                          ?.en === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section2?.sideImage?.en
                              }
                            />
                          </div>
                        )}
                      </FormItem>
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
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (hindi)</FormLabel>
                        <FileUploader
                          value={sideimageHi ? [sideimageHi] : []}
                          onValueChange={(newFiles: any) => {
                            setsideimageHi(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section2.sideImage.hi',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section2?.sideImage
                          ?.hi === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section2?.sideImage?.hi
                              }
                            />
                          </div>
                        )}
                      </FormItem>
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
            </Card>

            {/* Third Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  3rd Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Section Content Tabs */}
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4 space-y-4">
                      {/* Side Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (English)</FormLabel>
                        <FileUploader
                          value={side_imageEn ? [side_imageEn] : []}
                          onValueChange={(newFiles: any) => {
                            setside_imageEn(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section3.side_Image.en',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section3?.side_Image
                          ?.en === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section3?.side_Image
                                  ?.en
                              }
                            />
                          </div>
                        )}
                      </FormItem>
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
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (Hindi)</FormLabel>
                        <FileUploader
                          value={side_imageHi ? [side_imageHi] : []}
                          onValueChange={(newFiles: any) => {
                            setside_imageEn(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section3.side_Image.hi',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section3?.side_Image
                          ?.hi === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section3?.side_Image
                                  ?.hi
                              }
                            />
                          </div>
                        )}
                      </FormItem>
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
                          name="section3.description.hi"
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
            </Card>

            {/* Fourth Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  4th Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Section Content Tabs */}
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4 space-y-4">
                      {/* Side Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (English)</FormLabel>
                        <FileUploader
                          value={side_Image4En ? [side_Image4En] : []}
                          onValueChange={(newFiles: any) => {
                            setside_Image4En(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section4.side_Image4.en',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section4?.side_Image4
                          ?.en === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section4?.side_Image4
                                  ?.en
                              }
                            />
                          </div>
                        )}
                      </FormItem>

                      <div className="space-y-2">
                        <Label htmlFor="section4-title-en">Title</Label>
                        <Input
                          id="section4-title-en"
                          name="section4.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section4?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section4.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section4?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section4.description.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="Hindi" className="mt-4 space-y-4">
                      {/* Side Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (Hindi)</FormLabel>
                        <FileUploader
                          value={side_Image4Hi ? [side_Image4Hi] : []}
                          onValueChange={(newFiles: any) => {
                            setside_Image4Hi(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section4.side_Image4.hi',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section4?.side_Image4
                          ?.hi === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section4?.side_Image4
                                  ?.hi
                              }
                            />
                          </div>
                        )}
                      </FormItem>
                      <div className="space-y-2">
                        <Label htmlFor="section4-title-hi">Title</Label>
                        <Input
                          id="section4-title-hi"
                          name="section4.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section4?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section4.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section4?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section4.description.hi',
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
            </Card>

            {/* Fifth Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  5th Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4 space-y-4">
                      {/* Side Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (English)</FormLabel>
                        <FileUploader
                          value={side_Image5En ? [side_Image5En] : []}
                          onValueChange={(newFiles: any) => {
                            setside_Image5En(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section5.side_Image5.en',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section5?.side_Image5
                          ?.en === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section5?.side_Image5
                                  ?.en
                              }
                            />
                          </div>
                        )}
                      </FormItem>
                      <div className="space-y-2">
                        <Label htmlFor="section5-title-en">Title</Label>
                        <Input
                          id="section5-title-en"
                          name="section5.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section5?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section5.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section5?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section5.description.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="Hindi" className="mt-4 space-y-4">
                      {/* Side Image Upload */}
                      <FormItem className="space-y-3">
                        <FormLabel>Side Image (Hindi)</FormLabel>
                        <FileUploader
                          value={side_Image5Hi ? [side_Image5Hi] : []}
                          onValueChange={(newFiles: any) => {
                            setside_Image5Hi(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'section5.side_Image5.hi',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IAboutConfig)?.section5?.side_Image5
                          ?.hi === 'string' && (
                          <div className="max-h-48">
                            <FileViewCard
                              existingImageURL={
                                (cData as IAboutConfig)?.section5?.side_Image5
                                  ?.hi
                              }
                            />
                          </div>
                        )}
                      </FormItem>
                      <div className="space-y-2">
                        <Label htmlFor="section5-title-hi">Title</Label>
                        <Input
                          id="section5-title-hi"
                          name="section5.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section5?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section5.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section5?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section5.description.hi',
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
            </Card>

            {/* sixth Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  6th Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Side Image Upload */}
                <FormItem className="space-y-3">
                  <FormLabel>Side Image</FormLabel>
                  <FileUploader
                    value={side_Image6 ? [side_Image6] : []}
                    onValueChange={(newFiles: any) => {
                      setside_Image6(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'section6.side_Image6',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IAboutConfig)?.section6?.side_Image6 ===
                    'string' && (
                    <div className="max-h-48">
                      <FileViewCard
                        existingImageURL={
                          (cData as IAboutConfig)?.section6?.side_Image6
                        }
                      />
                    </div>
                  )}
                </FormItem>

                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section6-title-en">Title</Label>
                        <Input
                          id="section6-title-en"
                          name="section6.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section6?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section6.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section6?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section6.description.en',
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
                        <Label htmlFor="section6-title-hi">Title</Label>
                        <Input
                          id="section6-title-hi"
                          name="section6.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section6?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section6.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section6?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section6.description.hi',
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
            </Card>

            {/* Seventh Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  7th Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Side Image Upload */}
                <FormItem className="space-y-3">
                  <FormLabel>Side Image</FormLabel>
                  <FileUploader
                    value={side_Image7 ? [side_Image7] : []}
                    onValueChange={(newFiles: any) => {
                      setside_Image7(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'section7.side_Image7',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IAboutConfig)?.section7?.side_Image7 ===
                    'string' && (
                    <div className="max-h-48">
                      <FileViewCard
                        existingImageURL={
                          (cData as IAboutConfig)?.section7?.side_Image7
                        }
                      />
                    </div>
                  )}
                </FormItem>

                <div className="space-y-4">
                  <Label>Section Content</Label>
                  <Tabs defaultValue="English" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="English">English</TabsTrigger>
                      <TabsTrigger value="Hindi">Hindi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="English" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section7-title-en">Title</Label>
                        <Input
                          id="section7-title-en"
                          name="section7.title.en"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section7?.title?.en || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section7.description.en"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section7?.description
                              ?.en || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section7.description.en',
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
                        <Label htmlFor="section7-title-hi">Title</Label>
                        <Input
                          id="section7-title-hi"
                          name="section7.title.hi"
                          placeholder="Enter your Title"
                          value={
                            (cData as IAboutConfig)?.section7?.title?.hi || ''
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomTextEditor
                          name="section7.description.hi"
                          label="Full Description"
                          value={
                            (cData as IAboutConfig)?.section7?.description
                              ?.hi || ''
                          }
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'section7.description.hi',
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
            </Card>

            <div className="flex justify-center">
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
};

export default Page;
