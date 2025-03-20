'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import {
  addEditHomeBannerList,
  IHomeBanner,
  updateHomeBannerListData,
  fetchSingleHomeBannerList
} from '@/redux/slices/home/banner';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';

export default function HomeBannerForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleHomeBannerState: { loading, data: bData }
  } = useAppSelector((state) => state.homeBanner);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [showBannerImage, setShowBannerImage] = useState(true);
  const [showBackgroundColor, setShowBackgroundColor] = useState(false);
  const [showSwitch, setShowSwitch] = useState(true);

  const form = useForm<IHomeBanner>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleHomeBannerList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateHomeBannerListData({
        [name]:
          type === 'file'
            ? files?.[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    try {
      dispatch(addEditHomeBannerList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/homes/banner');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  useEffect(() => {
    const hasImage =
      !!bannerImage || typeof (bData as IHomeBanner)?.banner_image === 'string';
    const hasColor = !!(bData as IHomeBanner)?.backgroundColor;

    // Default to image if both exist or none exist
    if (hasImage) {
      setShowBannerImage(true);
      setShowBackgroundColor(false);
    } else if (hasColor) {
      setShowBannerImage(false);
      setShowBackgroundColor(true);
    } else {
      setShowBannerImage(false);
      setShowBackgroundColor(false);
    }
  }, [bannerImage, bData]);

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateHomeBannerListData({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            HomeBanner List Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <FormItem className="space-y-3">
                  <FormLabel>Banner Image</FormLabel>

                  <FileUploader
                    value={bannerImage ? [bannerImage] : []}
                    onValueChange={(newFiles: any) => {
                      setBannerImage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'banner_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />

                  {typeof (bData as IHomeBanner)?.banner_image === 'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={(bData as IHomeBanner)?.banner_image}
                      />
                    </div>
                  )}
                </FormItem>

                <div className="space-y-3">
                  <Label htmlFor="backgroundColor">Background Color</Label>

                  <Switch
                    className="!m-0"
                    checked={(bData as IHomeBanner)?.backgroundStatus}
                    onCheckedChange={(checked: any) =>
                      handleInputChange({
                        target: {
                          type: 'checkbox',
                          name: 'backgroundStatus',
                          checked
                        }
                      })
                    }
                    aria-label="Toggle Active Status"
                  />

                  {(bData as IHomeBanner)?.backgroundStatus && (
                    <div className="flex items-center gap-2">
                      {/* Color Picker */}
                      <Input
                        type="color"
                        name="backgroundColor"
                        value={
                          (bData as IHomeBanner)?.backgroundColor || '#000000'
                        }
                        onChange={handleInputChange}
                        className="h-10 w-12 cursor-pointer p-1"
                      />

                      {/* Hex Code Input */}
                      <Input
                        type="text"
                        name="backgroundColor"
                        value={
                          (bData as IHomeBanner)?.backgroundColor || '#000000'
                        }
                        // onChange={handleInputChange}
                        placeholder="Enter color hex code"
                        className="flex-1"
                      />
                    </div>
                  )}
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
                            name="title.en"
                            placeholder="Enter your Title"
                            value={(bData as IHomeBanner)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.en"
                            placeholder="Enter your Short Description"
                            value={
                              (bData as IHomeBanner)?.short_description?.en
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <CustomTextEditor
                          name="description.en"
                          label="Full Description"
                          value={(bData as IHomeBanner)?.description?.en}
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'description.en',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </CardContent>
                    </>
                  </TabsContent>

                  <TabsContent value="Hindi">
                    <>
                      <CardContent className="space-y-2 p-0">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="title.hi"
                            placeholder="Enter your Title"
                            value={(bData as IHomeBanner)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.hi"
                            placeholder="Enter your Short Description"
                            value={
                              (bData as IHomeBanner)?.short_description?.hi
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                        <CustomTextEditor
                          name="description.hi"
                          label="Full Description"
                          value={(bData as IHomeBanner)?.description?.hi}
                          onChange={(value) =>
                            handleInputChange({
                              target: {
                                name: 'description.hi',
                                value: value,
                                type: 'text'
                              }
                            })
                          }
                        />
                      </CardContent>
                    </>
                  </TabsContent>
                </Tabs>

                <div className="space-y-1">
                  <Label htmlFor="name">Sequence</Label>
                  <Input
                    name="sequence"
                    placeholder="Enter Sequence"
                    type="number"
                    value={(bData as IHomeBanner)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="textColour">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      name="textColour"
                      value={(bData as IHomeBanner)?.textColour || '#000000'}
                      onChange={handleInputChange}
                      className="h-10 w-12 cursor-pointer p-1"
                    />
                    <Input
                      type="text"
                      name="textColour"
                      value={(bData as IHomeBanner)?.textColour || '#000000'}
                      // onChange={handleInputChange}
                      placeholder="Enter color hex code"
                      className="flex-1"
                    />
                  </div>
                  <CustomDropdown
                    label="Text Alignment"
                    name="textAlignment"
                    defaultValue="left"
                    data={[
                      { name: 'Left', _id: 'left' },
                      { name: 'Center', _id: 'center' },
                      { name: 'Right', _id: 'right' }
                    ]}
                    value={(bData as IHomeBanner)?.textAlignment || ''}
                    onChange={handleDropdownChange}
                  />
                </div>

                <div className="space-y-1 ">
                  <Label htmlFor="name" className="space-x-3">
                    Read Button Status
                  </Label>
                  <Switch
                    className="!m-0"
                    checked={(bData as IHomeBanner)?.readStatus}
                    onCheckedChange={(checked: any) =>
                      handleInputChange({
                        target: {
                          type: 'checkbox',
                          name: 'readStatus',
                          checked
                        }
                      })
                    }
                    aria-label="Toggle Active Status"
                  />
                </div>

                {(bData as IHomeBanner)?.readStatus && (
                  <>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button English Title</Label>
                      <Input
                        name="readTitle.en"
                        placeholder="Enter English Button Titlte"
                        value={(bData as IHomeBanner)?.readTitle?.en}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button Hindi Title</Label>
                      <Input
                        name="readTitle.hi"
                        placeholder="Enter Hindi Button Titlte"
                        value={(bData as IHomeBanner)?.readTitle?.hi}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button Link</Label>
                      <Input
                        name="readLinks"
                        placeholder="Enter Button Link"
                        value={(bData as IHomeBanner)?.readLinks}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="readTextColor">Read Text Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          name="readTextColor"
                          value={
                            (bData as IHomeBanner)?.readTextColor || '#000000'
                          }
                          onChange={handleInputChange}
                          className="h-10 w-12 cursor-pointer p-1"
                        />
                        <Input
                          type="text"
                          name="readTextColor"
                          value={
                            (bData as IHomeBanner)?.readTextColor || '#000000'
                          }
                          // onChange={handleInputChange}
                          placeholder="Enter color hex code"
                          className="flex-1"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="textColour">
                          Read Background Color
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            name="readBackgroundcolor"
                            value={
                              (bData as IHomeBanner)?.readBackgroundcolor ||
                              '#000000'
                            }
                            onChange={handleInputChange}
                            className="h-10 w-12 cursor-pointer p-1"
                          />
                          <Input
                            type="text"
                            name="readBackgroundcolor"
                            value={
                              (bData as IHomeBanner)?.readBackgroundcolor ||
                              '#000000'
                            }
                            // onChange={handleInputChange}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Button type="submit" onClick={(e: any) => handleSubmit(e)}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
