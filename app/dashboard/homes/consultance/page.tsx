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
  addEditConsultance,
  fetchConsultance,
  IConsultance,
  updateConsultance
} from '@/redux/slices/home/consultance';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    consultanceState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.consultance);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  const [sideImage, setsideImage] = React.useState<File | null>(null);
  const [rightImage, setrightImage] = React.useState<File | null>(null);

  console.log('The loading value is:', loading, cData);

  useEffect(() => {
    dispatch(fetchConsultance(null));
  }, []);
  console.log('The cData value is:', cData);
  const form = useForm({
    defaultValues: {}
  });
  const [isChecked, setIsChecked] = useState(false);
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    console.log('e-value', name, value);
    dispatch(
      updateConsultance({
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
      updateConsultance({
        active: updatedStatus
      })
    );
    dispatch(addEditConsultance(null)).then((response: any) => {
      if (!response?.error) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(response.payload);
      }
    });
  };

  const handleSubmit = () => {
    try {
      dispatch(addEditConsultance(null)).then((response: any) => {
        if (!response?.error) {
          setbannerImage(null);

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
      updateConsultance({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  console.log('The bannerImage type value is:', cData);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Main Section
          </CardTitle>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="active"
              className="peer sr-only"
              checked={isChecked}
              onChange={handleToggleChange}
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isChecked ? 'Active' : 'Inactive'}
            </span>
          </label>
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
                      />{' '}
                      <>
                        {typeof (cData as IConsultance)?.mainSection
                          ?.bannerImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IConsultance)?.mainSection
                                    ?.bannerImage
                                }
                              />
                            </div>
                          </>
                        )}
                      </>
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
                      />{' '}
                      <>
                        {typeof (cData as IConsultance)?.mainSection
                          ?.sideImage === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (cData as IConsultance)?.mainSection
                                    ?.sideImage
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
                      <>
                        <CardContent className="space-y-2 p-0">
                          <div className="space-y-1">
                            <Label htmlFor="name">Main Title</Label>
                            <Input
                              name="mainSection.mainTitle.en"
                              placeholder="Enter your Main Title"
                              value={
                                (cData as IConsultance)?.mainSection?.mainTitle
                                  ?.en
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.title.en"
                              label="Full Description"
                              value={
                                (cData as IConsultance)?.mainSection?.title?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.title.en',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.en"
                              label="Full Description"
                              value={
                                (cData as IConsultance)?.mainSection
                                  ?.description?.en
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.description.en',
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
                          <div className="space-y-1">
                            <Label htmlFor="name">Main Title</Label>
                            <Input
                              name="mainSection.mainTitle.hi"
                              placeholder="Enter your Main Title"
                              value={
                                (cData as IConsultance)?.mainSection?.mainTitle
                                  ?.hi
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.title.hi"
                              label="Full Description"
                              value={
                                (cData as IConsultance)?.mainSection?.title?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.title.hi',
                                    value: value,
                                    type: 'text'
                                  }
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <CustomTextEditor
                              name="mainSection.description.hi"
                              label="Full Description"
                              value={
                                (cData as IConsultance)?.mainSection
                                  ?.description?.hi
                              }
                              onChange={(value) =>
                                handleInputChange({
                                  target: {
                                    name: 'mainSection.description.hi',
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

                  <div className="mt-4 space-y-3">
                    <Label htmlFor="textColour">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        name="mainSection.textColor"
                        value={(cData as IConsultance)?.mainSection?.textColor}
                        onChange={handleInputChange}
                        className="h-10 w-12 cursor-pointer p-1"
                      />
                      <Input
                        type="text"
                        name="mainSection.textColor"
                        value={(cData as IConsultance)?.mainSection?.textColor}
                        // onChange={handleInputChange}
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
                        { name: 'Right', _id: 'right' }
                      ]}
                      value={
                        (cData as IConsultance)?.mainSection?.textAlignment ||
                        ''
                      }
                      onChange={handleDropdownChange}
                    />
                  </div>
                  <div className="mt-4 space-y-1">
                    <Label htmlFor="name" className="space-x-3">
                      Button Status
                    </Label>
                    <Switch
                      className="!m-0"
                      checked={
                        (cData as IConsultance)?.mainSection?.buttonStatus
                      }
                      onCheckedChange={(checked: any) =>
                        handleInputChange({
                          target: {
                            type: 'checkbox',
                            name: 'mainSection.buttonStatus',
                            checked
                          }
                        })
                      }
                      aria-label="Toggle Active Status"
                    />
                  </div>
                  {(cData as IConsultance)?.mainSection?.buttonStatus && (
                    <>
                      <div className="!mt-3">
                        <Label htmlFor="name">Button English Title</Label>
                        <Input
                          name="mainSection.buttonTitle.en"
                          placeholder="Enter English Button Titlte"
                          value={
                            (cData as IConsultance)?.mainSection?.buttonTitle
                              ?.en
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="!mt-3">
                        <Label htmlFor="name">Button Hindi Title</Label>
                        <Input
                          name="mainSection.buttonTitle.hi"
                          placeholder="Enter Hindi Button Titlte"
                          value={
                            (cData as IConsultance)?.mainSection?.buttonTitle
                              ?.hi
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="!mt-3">
                        <Label htmlFor="name">Button Link</Label>
                        <Input
                          name="mainSection.buttonLink"
                          placeholder="Enter Button Link"
                          value={
                            (cData as IConsultance)?.mainSection?.buttonLink
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
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
