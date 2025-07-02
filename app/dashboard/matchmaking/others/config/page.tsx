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
  addEditMatchMaking,
  fetchMatchMaking,
  IMatchMaking,
  updateMatchMaking
} from '@/redux/slices/matchmaking/config';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    matchMakingState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.matchMaking);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  const [image, setimage] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchMatchMaking(null));
  }, [dispatch]);

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateMatchMaking({
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
      dispatch(addEditMatchMaking(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImage(null);
          setimage(null);
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

    dispatch(updateMatchMaking({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            MatchMaking Config
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
                value={(cData as IMatchMaking)?.metaTitle || ''}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IMatchMaking)?.metaDescription || ''}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IMatchMaking)?.metaKeyword || ''}
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
                  <div className="space-y-2 pt-0">
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
                      {typeof (cData as IMatchMaking)?.mainSection
                        ?.bannerImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMatchMaking)?.mainSection?.bannerImage
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
                              (cData as IMatchMaking)?.mainSection?.title?.en ||
                              ''
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
                              (cData as IMatchMaking)?.mainSection?.description
                                ?.en || ''
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
                              (cData as IMatchMaking)?.mainSection?.title?.hi ||
                              ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <Input
                            name="mainSection.description.hi"
                            placeholder="Enter your Description"
                            value={
                              (cData as IMatchMaking)?.mainSection?.description
                                ?.hi || ''
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
                          (cData as IMatchMaking)?.mainSection?.textColor ||
                          '#000000'
                        }
                        onChange={handleInputChange}
                        className="h-10 w-12 cursor-pointer p-1"
                      />
                      <Input
                        type="text"
                        name="mainSection.textColor"
                        value={
                          (cData as IMatchMaking)?.mainSection?.textColor || ''
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
                        (cData as IMatchMaking)?.mainSection?.textAlignment ||
                        ''
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
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-center gap-5">
                    <CardTitle>2nd Section</CardTitle>
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
                          <CardTitle>2nd Section English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section2.title.en"
                              placeholder="Enter your Title"
                              value={
                                (cData as IMatchMaking)?.section2?.title?.en ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section2.description.en"
                              label="Full Description"
                              value={
                                (cData as IMatchMaking)?.section2?.description
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
                                (cData as IMatchMaking)?.section2?.title?.hi ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section2.description.hi"
                              label="Full Description"
                              value={
                                (cData as IMatchMaking)?.section2?.description
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
                <Card className="w-full">
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
                              placeholder="Enter your Title"
                              value={
                                (cData as IMatchMaking)?.section3?.title?.en ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section3.description.en"
                              label="Full Description"
                              value={
                                (cData as IMatchMaking)?.section3?.description
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
                                (cData as IMatchMaking)?.section3?.title?.hi ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section3.description.hi"
                              label="Full Description"
                              value={
                                (cData as IMatchMaking)?.section3?.description
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
              <div className="space-y-2 pt-0">
                <FormItem className="space-y-3">
                  <FormLabel>4th Section Image</FormLabel>
                  <FileUploader
                    value={image ? [image] : []}
                    onValueChange={(newFiles: any) => {
                      setimage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'section4.image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                  {typeof (cData as IMatchMaking)?.section4?.image ===
                    'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={
                          (cData as IMatchMaking)?.section4?.image
                        }
                      />
                    </div>
                  )}
                </FormItem>
              </div>

              <div className="flex items-center space-x-2">
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-center gap-5">
                    <CardTitle>4th Section</CardTitle>
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
                          <CardTitle>4th Section English</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="section4.title.en"
                              placeholder="Enter your Title"
                              value={
                                (cData as IMatchMaking)?.section4?.title?.en ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section4.description.en"
                              label="Full Description"
                              value={
                                (cData as IMatchMaking)?.section4?.description
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
                                (cData as IMatchMaking)?.section4?.title?.hi ||
                                ''
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="section4.description.hi"
                              label="Full Description"
                              value={
                                (cData as IMatchMaking)?.section4?.description
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

      <CardFooter
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Button type="submit" onClick={() => handleSubmit()}>
          {loading ? 'Saving...' : 'Submit'}
        </Button>
      </CardFooter>
    </PageContainer>
  );
};

export default Page;
