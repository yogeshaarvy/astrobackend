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
  addEditHoroscope,
  fetchHoroscope,
  IHoroscopeConfig,
  updateHoroscope
} from '@/redux/slices/horoscope/horoscopeSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    horoscopeState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.horoscopeConfig);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  const [sideImage, setsideImage] = React.useState<File | null>(null);
  const [section2Image, setSection2Image] = React.useState<File | null>(null);
  const [rightImage, setrightImage] = React.useState<File | null>(null);
  const [imageOne, setImageOne] = React.useState<File | null>(null);
  const [imageTwo, setImageTwo] = React.useState<File | null>(null);
  const [imageThree, setImageThree] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchHoroscope(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateHoroscope({
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
      dispatch(addEditHoroscope(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImage(null);
          setsideImage(null);
          setSection2Image(null);
          setrightImage(null);
          setImageOne(null);
          setImageTwo(null);
          setImageThree(null);

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

    dispatch(updateHoroscope({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Horoscope Config List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <CustomTextField
                name="metaTitle"
                label="Meta Title"
                placeholder="Enter your Meta Title"
                value={(cData as IHoroscopeConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IHoroscopeConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IHoroscopeConfig)?.metaKeyword}
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
                      />
                      {typeof (cData as IHoroscopeConfig)?.mainSection
                        ?.bannerImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IHoroscopeConfig)?.mainSection
                                ?.bannerImage
                            }
                          />
                        </div>
                      )}

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
                      />
                      {typeof (cData as IHoroscopeConfig)?.mainSection
                        ?.sideImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IHoroscopeConfig)?.mainSection
                                ?.sideImage
                            }
                          />
                        </div>
                      )}
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
                      <CardContent className="space-y-2 p-0">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="mainSection.title.en"
                            placeholder="Enter your Title"
                            value={
                              (cData as IHoroscopeConfig)?.mainSection?.title
                                ?.en
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <Input
                            name="mainSection.description.en"
                            placeholder="Enter your Description"
                            value={
                              (cData as IHoroscopeConfig)?.mainSection
                                ?.description?.en
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                    </TabsContent>

                    <TabsContent value="Hindi">
                      <CardContent className="space-y-2 p-0">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="mainSection.title.hi"
                            placeholder="Enter your Title"
                            value={
                              (cData as IHoroscopeConfig)?.mainSection?.title
                                ?.hi
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name"> Description</Label>
                          <Input
                            name="mainSection.description.hi"
                            placeholder="Enter your Description"
                            value={
                              (cData as IHoroscopeConfig)?.mainSection
                                ?.description?.hi
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-4 space-y-3">
                    <Label htmlFor="textColour">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        name="mainSection.textColor"
                        value={
                          (cData as IHoroscopeConfig)?.mainSection?.textColor
                        }
                        onChange={handleInputChange}
                        className="h-10 w-12 cursor-pointer p-1"
                      />
                      <Input
                        type="text"
                        name="mainSection.textColor"
                        value={
                          (cData as IHoroscopeConfig)?.mainSection?.textColor
                        }
                        onChange={handleInputChange}
                        placeholder="Enter color hex code"
                        className="flex-1"
                      />
                    </div>
                    <CustomDropdown
                      label="Text Alignment"
                      name="mainSection.textAlignment"
                      defaultValue="left"
                      data={[
                        { name: 'Left', _id: 'left' },
                        { name: 'Center', _id: 'center' },
                        { name: 'Right', _id: 'right' }
                      ]}
                      value={
                        (cData as IHoroscopeConfig)?.mainSection
                          ?.textAlignment || ''
                      }
                      onChange={handleDropdownChange}
                    />
                  </div>
                </Tabs>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            2nd Section
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
                    <CardTitle>2nd Section</CardTitle>
                  </CardHeader>
                  <div className="space-y-2 pt-0 ">
                    <FormItem className="space-y-3">
                      <FormLabel>Image</FormLabel>
                      <FileUploader
                        value={section2Image ? [section2Image] : []}
                        onValueChange={(newFiles: any) => {
                          setSection2Image(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'section2.image',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IHoroscopeConfig)?.section2?.image ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IHoroscopeConfig)?.section2?.image
                            }
                          />
                        </div>
                      )}
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
                          <CardTitle>2nd Section English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section2.title.en"
                              placeholder="Enter your Title "
                              value={
                                (cData as IHoroscopeConfig)?.section2?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section2.description.en"
                              label="Full Description"
                              value={
                                (cData as IHoroscopeConfig)?.section2
                                  ?.description?.en
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
                        </CardContent>
                      </div>
                    </TabsContent>
                    <TabsContent value="Hindi">
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>2nd Section Hindi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section2.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IHoroscopeConfig)?.section2?.title
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section2.description.hi"
                              label="Full Description"
                              value={
                                (cData as IHoroscopeConfig)?.section2
                                  ?.description?.hi || ''
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
            3rd Section
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
                    <CardTitle>3rd Section</CardTitle>
                  </CardHeader>

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
                          <CardTitle>3rd Section English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section3.title.en"
                              placeholder="Enter your Title "
                              value={
                                (cData as IHoroscopeConfig)?.section3?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section3.description.en"
                              label="Full Description"
                              value={
                                (cData as IHoroscopeConfig)?.section3
                                  ?.description?.en
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
                        </CardContent>
                      </div>
                    </TabsContent>
                    <TabsContent value="Hindi">
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>3rd Section Hindi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section3.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IHoroscopeConfig)?.section3?.title
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section3.description.hi"
                              label="Full Description"
                              value={
                                (cData as IHoroscopeConfig)?.section3
                                  ?.description?.hi || ''
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
            4th Section
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
                    <CardTitle>4th Section</CardTitle>
                  </CardHeader>
                  <div className="space-y-2 pt-0 ">
                    <FormItem className="space-y-3">
                      <FormLabel>Right Image</FormLabel>
                      <FileUploader
                        value={rightImage ? [rightImage] : []}
                        onValueChange={(newFiles: any) => {
                          setrightImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'section4.rightImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IHoroscopeConfig)?.section4
                        ?.rightImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IHoroscopeConfig)?.section4?.rightImage
                            }
                          />
                        </div>
                      )}
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
                          <CardTitle>4th Section English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section4.title.en"
                              placeholder="Enter your Title "
                              value={
                                (cData as IHoroscopeConfig)?.section4?.title?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section4.description.en"
                              label="Full Description"
                              value={
                                (cData as IHoroscopeConfig)?.section4
                                  ?.description?.en
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
                        </CardContent>
                      </div>
                    </TabsContent>
                    <TabsContent value="Hindi">
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>4th Section Hindi</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section4.title.hi"
                              placeholder="Enter your Title"
                              value={
                                (cData as IHoroscopeConfig)?.section4?.title
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section4.description.hi"
                              label="Full Description"
                              value={
                                (cData as IHoroscopeConfig)?.section4
                                  ?.description?.hi || ''
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
            Cards Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="">
                {/* Card One */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card One</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <FormItem className="space-y-3">
                        <FormLabel>Icon One</FormLabel>
                        <FileUploader
                          value={imageOne ? [imageOne] : []}
                          onValueChange={(newFiles: any) => {
                            setImageOne(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'cards.iconOne',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IHoroscopeConfig)?.cards?.iconOne ===
                          'string' && (
                          <div className="max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                (cData as IHoroscopeConfig)?.cards?.iconOne
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
                            EN
                          </TabsTrigger>
                          <TabsTrigger
                            value="Hindi"
                            className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                          >
                            HI
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="English">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              name="cards.titleOne.en"
                              placeholder="Enter title"
                              value={
                                (cData as IHoroscopeConfig)?.cards?.titleOne?.en
                              }
                              onChange={handleInputChange}
                            />
                            <CustomTextEditor
                              name="cards.descriptionOne.en"
                              label="Description"
                              value={
                                (cData as IHoroscopeConfig)?.cards
                                  ?.descriptionOne?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'cards.descriptionOne.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="Hindi">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              name="cards.titleOne.hi"
                              placeholder="Enter title"
                              value={
                                (cData as IHoroscopeConfig)?.cards?.titleOne
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                            <Label>Description</Label>
                            <CustomTextEditor
                              name="cards.descriptionOne.hi"
                              label="Description"
                              value={
                                (cData as IHoroscopeConfig)?.cards
                                  ?.descriptionOne?.hi || ''
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'cards.descriptionOne.hi',
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

                {/* Card Two */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card Two</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <FormItem className="space-y-3">
                        <FormLabel>Icon Two</FormLabel>
                        <FileUploader
                          value={imageTwo ? [imageTwo] : []}
                          onValueChange={(newFiles: any) => {
                            setImageTwo(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'cards.iconTwo',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IHoroscopeConfig)?.cards?.iconTwo ===
                          'string' && (
                          <div className="max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                (cData as IHoroscopeConfig)?.cards?.iconTwo
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
                            EN
                          </TabsTrigger>
                          <TabsTrigger
                            value="Hindi"
                            className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                          >
                            HI
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="English">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              name="cards.titleTwo.en"
                              placeholder="Enter title"
                              value={
                                (cData as IHoroscopeConfig)?.cards?.titleTwo?.en
                              }
                              onChange={handleInputChange}
                            />
                            <Label>Description</Label>
                            <CustomTextEditor
                              name="cards.descriptionTwo.en"
                              label="Description"
                              value={
                                (cData as IHoroscopeConfig)?.cards
                                  ?.descriptionTwo?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'cards.descriptionTwo.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="Hindi">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              name="cards.titleTwo.hi"
                              placeholder="Enter title"
                              value={
                                (cData as IHoroscopeConfig)?.cards?.titleTwo
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                            <Label>Description</Label>
                            <CustomTextEditor
                              name="cards.descriptionTwo.hi"
                              label="Description"
                              value={
                                (cData as IHoroscopeConfig)?.cards
                                  ?.descriptionTwo?.hi || ''
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'cards.descriptionTwo.hi',
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

                {/* Card Three */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card Three</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <FormItem className="space-y-3">
                        <FormLabel>Icon Three</FormLabel>
                        <FileUploader
                          value={imageThree ? [imageThree] : []}
                          onValueChange={(newFiles: any) => {
                            setImageThree(newFiles[0] || null);
                            handleInputChange({
                              target: {
                                name: 'cards.iconThree',
                                type: 'file',
                                files: newFiles
                              }
                            });
                          }}
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof (cData as IHoroscopeConfig)?.cards
                          ?.iconThree === 'string' && (
                          <div className="max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                (cData as IHoroscopeConfig)?.cards?.iconThree
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
                            EN
                          </TabsTrigger>
                          <TabsTrigger
                            value="Hindi"
                            className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                          >
                            HI
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="English">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              name="cards.titleThree.en"
                              placeholder="Enter title"
                              value={
                                (cData as IHoroscopeConfig)?.cards?.titleThree
                                  ?.en
                              }
                              onChange={handleInputChange}
                            />
                            <Label>Description</Label>
                            <CustomTextEditor
                              name="cards.descriptionThree.en"
                              label="Description"
                              value={
                                (cData as IHoroscopeConfig)?.cards
                                  ?.descriptionThree?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'cards.descriptionThree.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="Hindi">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              name="cards.titleThree.hi"
                              placeholder="Enter title"
                              value={
                                (cData as IHoroscopeConfig)?.cards?.titleThree
                                  ?.hi || ''
                              }
                              onChange={handleInputChange}
                            />
                            <Label>Description</Label>
                            <CustomTextEditor
                              name="cards.descriptionThree.hi"
                              label="Description"
                              value={
                                (cData as IHoroscopeConfig)?.cards
                                  ?.descriptionThree?.hi || ''
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'cards.descriptionThree.hi',
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
        <Button type="submit" onClick={() => handleSubmit()} disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </Button>
      </CardFooter>
    </PageContainer>
  );
};

export default Page;
