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
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditHomeAbout,
  fetchHomeAbout,
  IAboutAstro,
  updateAboutAstro
} from '@/redux/slices/homeaboutSlice';
// import CustomTextEditor from '@/utils/CustomTextEditor';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    homeaboutState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.astroAbout);
  const [mainImage, setMainImage] = React.useState<File | null>(null);
  const [backgroundImage, setBackgoundImage] = React.useState<File | null>(
    null
  );
  const [secureImage, setSecureImage] = React.useState<File | null>(null);
  const [benefitImage, setBenefitImage] = React.useState<File | null>(null);
  const [greatImage, setGreatImage] = React.useState<File | null>(null);

  console.log('The loading value is:', loading, cData);

  useEffect(() => {
    dispatch(fetchHomeAbout(null));
  }, []);
  console.log('The cData value is:', cData);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    console.log('e-value', name, value);
    dispatch(
      updateAboutAstro({
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
    const requiredFields: (keyof IAboutAstro)[] = ['title'];

    const missingFields = requiredFields.filter(
      (field) => !(cData as IAboutAstro)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof IAboutAstro]?: string } = {
        title: 'Title'
      };

      const missingFieldLabels = missingFields.map(
        (field) => fieldLabels[field] || field
      );
      toast.error(
        `Please fill the required fields: ${missingFieldLabels.join(', ')}`
      );
      return;
    }

    try {
      dispatch(addEditHomeAbout(null)).then((response: any) => {
        if (!response?.error) {
          setMainImage(null);
          setBackgoundImage(null);
          setSecureImage(null);
          setBenefitImage(null);
          setGreatImage(null);
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  console.log('The bannerImage type value is:', cData);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            About Astro
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
                  {/* <Card> */}
                  {/* <CardHeader className="flex flex-row items-center justify-center gap-5">
                      <CardTitle>
                        About Astro
                      </CardTitle>
                    </CardHeader> */}

                  <div className="space-y-2 pt-0 ">
                    {/* Desk banner */}
                    <FormItem className="space-y-3">
                      <FormLabel>Backgound Image</FormLabel>
                      <FileUploader
                        value={backgroundImage ? [backgroundImage] : []}
                        onValueChange={(newFiles: any) => {
                          setBackgoundImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'images.backgoundImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />{' '}
                      <>
                        {typeof (cData as IAboutAstro)?.images
                          ?.backgoundImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IAboutAstro)?.images?.backgoundImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>

                    {/* Main Image */}
                    <FormItem className="space-y-3">
                      <FormLabel>Main Image</FormLabel>
                      <FileUploader
                        value={mainImage ? [mainImage] : []}
                        onValueChange={(newFiles: any) => {
                          setMainImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'images.mainImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        // onUpload={handleInputChange}
                        accept={{ 'image/*': [] }}
                        // maxFiles={2}
                        maxSize={1024 * 1024 * 2}
                        // multiple
                      />
                      <>
                        {typeof (cData as IAboutAstro)?.images?.mainImage ===
                          'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IAboutAstro)?.images?.mainImage
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
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ABOUT-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Title</Label>
                            <Input
                              name="title"
                              placeholder="Enter your Title"
                              value={(cData as IAboutAstro)?.title}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="name">Description</Label>
                            <Input
                              name="description"
                              placeholder="Enter your Description"
                              value={(cData as IAboutAstro)?.description}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>
                      </div>
                    </TabsContent>

                    {/* Hindi Content */}
                    <TabsContent value="Hindi">
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ENGLISH-HINDI</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Description</Label>
                            <Input
                              name="web.desk.description.hi"
                              placeholder="Enter your Description"
                              // value={
                              //   (cData as IAboutAstro)?.web?.desk
                              //     ?.description?.hi || ''
                              // }
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>

                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>MOBILE-WEB-HINDI</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Description</Label>
                            <Input
                              name="web.mob.description.hi"
                              placeholder="Enter your Title"
                              // value={
                              //   (cData as IAboutAstro)?.web?.mob
                              //     ?.description?.hi
                              // }
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <CardHeader className="flex flex-row items-center justify-center gap-5">
                    <CardTitle>Icon Images / Part's</CardTitle>
                  </CardHeader>

                  <div className="space-y-2 p-6 pt-0 ">
                    {/* Card 1 Image */}
                    <FormItem className="space-y-3">
                      <FormLabel>Icon 1 Image</FormLabel>
                      <FileUploader
                        value={secureImage ? [secureImage] : []}
                        onValueChange={(newFiles: any) => {
                          setSecureImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'images.secureImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        // onUpload={handleInputChange}
                        accept={{ 'image/*': [] }}
                        // maxFiles={2}
                        maxSize={1024 * 1024 * 2}
                        // multiple
                      />
                      <>
                        {typeof (cData as IAboutAstro)?.images?.secureImage ===
                          'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IAboutAstro)?.images?.secureImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>

                    {/* Card 2 Image */}
                    <FormItem className="space-y-3">
                      <FormLabel>Icon 2 Image</FormLabel>
                      <FileUploader
                        value={benefitImage ? [benefitImage] : []}
                        onValueChange={(newFiles: any) => {
                          setBenefitImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'images.benefitImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        // onUpload={handleInputChange}
                        accept={{ 'image/*': [] }}
                        // maxFiles={2}
                        maxSize={1024 * 1024 * 2}
                        // multiple
                      />
                      <>
                        {typeof (cData as IAboutAstro)?.images?.benefitImage ===
                          'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IAboutAstro)?.images?.benefitImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>

                    {/* Crad 3 Image */}
                    <FormItem className="space-y-3">
                      <FormLabel>Icon 3 Image</FormLabel>
                      <FileUploader
                        value={greatImage ? [greatImage] : []}
                        onValueChange={(newFiles: any) => {
                          setGreatImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'images.greatImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        // onUpload={handleInputChange}
                        accept={{ 'image/*': [] }}
                        // maxFiles={2}
                        maxSize={1024 * 1024 * 2}
                        // multiple
                      />
                      <>
                        {typeof (cData as IAboutAstro)?.images?.greatImage ===
                          'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IAboutAstro)?.images?.greatImage
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
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ICON-1-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Icon Title</Label>
                            <Input
                              name="secureTitle"
                              placeholder="Enter ...."
                              value={(cData as IAboutAstro)?.secureTitle}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>

                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ICON-2-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Icon Title</Label>
                            <Input
                              name="benefitTitle"
                              placeholder="Enter ..."
                              value={(cData as IAboutAstro)?.benefitTitle}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>

                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ICON-3-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Icon Title</Label>
                            <Input
                              name="greatTitle"
                              placeholder="Enter ..."
                              value={(cData as IAboutAstro)?.greatTitle}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>
                      </div>
                    </TabsContent>

                    {/* Hindi Content */}
                    <TabsContent value="Hindi">
                      <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ICON-1-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Icon Title</Label>
                            <Input
                              name="secureTitle"
                              placeholder="Enter ...."
                              value={(cData as IAboutAstro)?.secureTitle}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>

                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ICON-2-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Icon Title</Label>
                            <Input
                              name="benefitTitle"
                              placeholder="Enter ..."
                              value={(cData as IAboutAstro)?.benefitTitle}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>

                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>ICON-3-ENGLISH</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="name">Icon Title</Label>
                            <Input
                              name="greatTitle"
                              placeholder="Enter ..."
                              value={(cData as IAboutAstro)?.greatTitle}
                              onChange={handleInputChange}
                            />
                          </div>
                        </CardContent>
                      </div>
                    </TabsContent>
                  </Tabs>
                  {/* </Card> */}
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
