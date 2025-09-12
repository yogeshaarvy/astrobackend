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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditCareerConfig,
  fetchCareerConfig,
  ICareerConfig,
  updateCareerConfig
} from '@/redux/slices/career/careerConfig';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    careerConfigState: { loading, data: cData }
  } = useAppSelector((state) => state.carrierConfig);

  console.log('this is the cdata', cData);
  const [bannerImageEn, setbannerImageEn] = React.useState<File | null>(null);
  const [bannerImageHi, setbannerImageHi] = React.useState<File | null>(null);
  const [sideImageEn, setsideImageEn] = React.useState<File | null>(null);
  const [sideImageHi, setsideImageHi] = React.useState<File | null>(null);
  const [rightImageEn, setrightImageEn] = React.useState<File | null>(null);
  const [rightImageHi, setrightImageHi] = React.useState<File | null>(null);
  const [leftImageEn, setleftImageEn] = React.useState<File | null>(null);
  const [leftImageHi, setleftImageHi] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchCareerConfig(null));
  }, []);

  const form = useForm({
    defaultValues: {}
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateCareerConfig({
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
    if (type === 'checkbox' && name === 'active') {
      setIsChecked(checked);
    }
  };

  const handleToggleChange = () => {
    const updatedStatus = !isChecked;
    setIsChecked(updatedStatus);
    dispatch(
      updateCareerConfig({
        active: updatedStatus
      })
    );
    dispatch(addEditCareerConfig(null)).then((response: any) => {
      if (!response?.error) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(response.payload);
      }
    });
  };

  const handleSubmit = () => {
    try {
      dispatch(addEditCareerConfig(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImageEn(null);
          setsideImageEn(null);
          setrightImageEn(null);
          setleftImageEn(null);
          setbannerImageHi(null);
          setsideImageHi(null);
          setrightImageHi(null);
          setleftImageHi(null);
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
    dispatch(updateCareerConfig({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Career Configuration
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
                    {/* Meta Information */}
                    <div className="space-y-1">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        name="metaTitle"
                        placeholder="Enter your Meta Title"
                        value={(cData as ICareerConfig)?.metaTitle || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Input
                        name="metaDescription"
                        placeholder="Enter your Meta Description"
                        value={(cData as ICareerConfig)?.metaDescription || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="metaKeyword">Meta Keyword</Label>
                      <Input
                        name="metaKeyword"
                        placeholder="Enter your Meta Keyword"
                        value={(cData as ICareerConfig)?.metaKeyword || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* File Upload Section */}
                  </div>

                  {/* Section Tabs */}
                  <Tabs defaultValue="sectionOne" className="mt-4 w-full">
                    <TabsList className="flex w-full space-x-2 p-0">
                      <TabsTrigger
                        value="sectionOne"
                        className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                      >
                        Section One
                      </TabsTrigger>
                      <TabsTrigger
                        value="sectionTwo"
                        className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                      >
                        Section Two
                      </TabsTrigger>
                      <TabsTrigger
                        value="sectionThree"
                        className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                      >
                        Section Three
                      </TabsTrigger>
                      <TabsTrigger
                        value="sectionFour"
                        className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                      >
                        Section Four
                      </TabsTrigger>
                    </TabsList>

                    {/* Section One */}
                    <TabsContent value="sectionOne">
                      <Tabs defaultValue="English" className="w-full">
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
                          <CardContent className="space-y-2 p-0">
                            <div className="space-y-1">
                              <Label htmlFor="sectionOne.mainTitle.en">
                                Main Title
                              </Label>
                              <Input
                                name="sectionOne.mainTitle.en"
                                placeholder="Enter Main Title"
                                value={
                                  (cData as ICareerConfig)?.sectionOne
                                    ?.mainTitle?.en || ''
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionOne.title.en"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionOne?.title
                                    ?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionOne.title.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionOne.description.en"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionOne
                                    ?.description?.en || ''
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
                            <div className="space-y-1">
                              <FormLabel>Left Image (English)</FormLabel>
                              <FileUploader
                                value={leftImageEn ? [leftImageEn] : []}
                                onValueChange={(newFiles: any) => {
                                  setleftImageEn(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionOne.leftImage.en',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionOne
                                ?.leftImage?.en === 'string' && (
                                <div className="max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionOne
                                        ?.leftImage?.en
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </TabsContent>

                        <TabsContent value="Hindi">
                          <CardContent className="space-y-2 p-0">
                            <div className="space-y-1">
                              <Label htmlFor="sectionOne.mainTitle.hi">
                                Main Title
                              </Label>
                              <Input
                                name="sectionOne.mainTitle.hi"
                                placeholder="Enter Main Title"
                                value={
                                  (cData as ICareerConfig)?.sectionOne
                                    ?.mainTitle?.hi || ''
                                }
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionOne.title.hi"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionOne?.title
                                    ?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionOne.title.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionOne.description.hi"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionOne
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
                            <div className="space-y-1">
                              <FormLabel>Left Image (Hindi)</FormLabel>
                              <FileUploader
                                value={leftImageHi ? [leftImageHi] : []}
                                onValueChange={(newFiles: any) => {
                                  setleftImageHi(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionOne.leftImage.hi',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionOne
                                ?.leftImage?.hi === 'string' && (
                                <div className="max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionOne
                                        ?.leftImage?.hi
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>

                    {/* Section Two */}
                    <TabsContent value="sectionTwo">
                      <Tabs defaultValue="English" className="w-full">
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
                          <CardContent className="space-y-2 p-0">
                            <div className="space-y-3">
                              <FormLabel>Right Image (English)</FormLabel>
                              <FileUploader
                                value={rightImageEn ? [rightImageEn] : []}
                                onValueChange={(newFiles: any) => {
                                  setrightImageEn(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.rightImage.en',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionTwo
                                ?.rightImage?.en === 'string' && (
                                <div className="max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionTwo
                                        ?.rightImage?.en
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.title.en"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo?.title
                                    ?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.title.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.description.en"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo
                                    ?.description?.en || ''
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
                            <div className="mb-4">
                              <FormLabel>Side Image</FormLabel>
                              <FileUploader
                                value={sideImageEn ? [sideImageEn] : []}
                                onValueChange={(newFiles: any) => {
                                  setsideImageEn(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.sideImage.en',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionTwo
                                ?.sideImage?.en === 'string' && (
                                <div className="mt-2 max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionTwo
                                        ?.sideImage?.en
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.heading.en"
                                label="Heading"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo?.heading
                                    ?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.heading.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.subDescription.en"
                                label="Sub Description"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo
                                    ?.subDescription?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.subDescription.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>

                        <TabsContent value="Hindi">
                          <CardContent className="space-y-2 p-0">
                            <div className="space-y-3">
                              <FormLabel>Right Image (Hindi)</FormLabel>
                              <FileUploader
                                value={rightImageHi ? [rightImageHi] : []}
                                onValueChange={(newFiles: any) => {
                                  setrightImageHi(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.rightImage.hi',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionTwo
                                ?.rightImage?.hi === 'string' && (
                                <div className="max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionTwo
                                        ?.rightImage?.hi
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.title.hi"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo?.title
                                    ?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.title.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.description.hi"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo
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
                            <div className="mb-4">
                              <FormLabel>Side Image (Hindi)</FormLabel>
                              <FileUploader
                                value={sideImageHi ? [sideImageHi] : []}
                                onValueChange={(newFiles: any) => {
                                  setsideImageHi(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.sideImage.hi',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionTwo
                                ?.sideImage?.hi === 'string' && (
                                <div className="mt-2 max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionTwo
                                        ?.sideImage?.hi
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.heading.hi"
                                label="Heading"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo?.heading
                                    ?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.heading.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionTwo.subDescription.hi"
                                label="Heading"
                                value={
                                  (cData as ICareerConfig)?.sectionTwo
                                    ?.subDescription?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionTwo.subDescription.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>

                    {/* Section Three */}
                    <TabsContent value="sectionThree">
                      <Tabs defaultValue="English" className="w-full">
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
                          <CardContent className="space-y-2 p-0">
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionThree.title.en"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionThree?.title
                                    ?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionThree.title.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionThree.description.en"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionThree
                                    ?.description?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionThree.description.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>

                        <TabsContent value="Hindi">
                          <CardContent className="space-y-2 p-0">
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionThree.title.hi"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionThree?.title
                                    ?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionThree.title.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionThree.description.hi"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionThree
                                    ?.description?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionThree.description.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>

                    {/* Section Four */}
                    <TabsContent value="sectionFour">
                      <Tabs defaultValue="English" className="w-full">
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
                          <CardContent className="space-y-2 p-0">
                            <div className="mb-4">
                              <FormLabel>Banner Image (English)</FormLabel>
                              <FileUploader
                                value={bannerImageEn ? [bannerImageEn] : []}
                                onValueChange={(newFiles: any) => {
                                  setbannerImageEn(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.bannerImage.en',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionFour
                                ?.bannerImage?.en === 'string' && (
                                <div className="mt-2 max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionFour
                                        ?.bannerImage?.en
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionFour.title.en"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionFour?.title
                                    ?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.title.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionFour.description.en"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionFour
                                    ?.description?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.description.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionFour.buttonText.en"
                                label="Button Text"
                                value={
                                  (cData as ICareerConfig)?.sectionFour
                                    ?.buttonText?.en || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.buttonText.en',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>

                        <TabsContent value="Hindi">
                          <CardContent className="space-y-2 p-0">
                            <div className="mb-4">
                              <FormLabel>Banner Image (Hindi)</FormLabel>
                              <FileUploader
                                value={bannerImageHi ? [bannerImageHi] : []}
                                onValueChange={(newFiles: any) => {
                                  setbannerImageHi(newFiles[0] || null);
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.bannerImage.hi',
                                      type: 'file',
                                      files: newFiles
                                    }
                                  });
                                }}
                                accept={{ 'image/*': [] }}
                                maxSize={1024 * 1024 * 2}
                              />
                              {typeof (cData as ICareerConfig)?.sectionFour
                                ?.bannerImage?.hi === 'string' && (
                                <div className="mt-2 max-h-48 space-y-4">
                                  <FileViewCard
                                    existingImageURL={
                                      (cData as ICareerConfig)?.sectionFour
                                        ?.bannerImage?.hi
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionFour.title.hi"
                                label="Title"
                                value={
                                  (cData as ICareerConfig)?.sectionFour?.title
                                    ?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.title.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionFour.description.hi"
                                label="Description"
                                value={
                                  (cData as ICareerConfig)?.sectionFour
                                    ?.description?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.description.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <CustomTextEditor
                                name="sectionFour.buttonText.hi"
                                label="Button Text"
                                value={
                                  (cData as ICareerConfig)?.sectionFour
                                    ?.buttonText?.hi || ''
                                }
                                onChange={(value) =>
                                  handleInputChange({
                                    target: {
                                      name: 'sectionFour.buttonText.hi',
                                      value: value,
                                      type: 'text'
                                    }
                                  })
                                }
                              />
                            </div>
                          </CardContent>
                        </TabsContent>
                      </Tabs>
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
