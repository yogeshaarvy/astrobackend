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
  addEditVastuSliderList,
  IVastuSlider,
  updateVastuSliderListData,
  fetchSingleVastuSliderList
} from '@/redux/slices/vastushastr/vastuSlider';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';

export default function HomeBannerForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleVastuSliderState: { loading, data: bData }
  } = useAppSelector((state) => state.vastuSlider);

  console.log('the bData value is', bData);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImageEn, setBannerImageEn] = useState(null);
  const [bannerImageHi, setBannerImageHi] = useState(null);

  const form = useForm<IVastuSlider>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleVastuSliderList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateVastuSliderListData({
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
      dispatch(addEditVastuSliderList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/vastu-shastr/slider');
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

    dispatch(updateVastuSliderListData({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Vastu shastr slider
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
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
                            value={(bData as IVastuSlider)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.en"
                            placeholder="Enter your Short Description"
                            value={
                              (bData as IVastuSlider)?.short_description?.en
                            }
                            onChange={handleInputChange}
                          />
                        </div>

                        <FormItem className="space-y-3">
                          <FormLabel>Banner Image (English)</FormLabel>

                          <FileUploader
                            value={bannerImageEn ? [bannerImageEn] : []}
                            onValueChange={(newFiles: any) => {
                              setBannerImageEn(newFiles[0] || null);
                              handleInputChange({
                                target: {
                                  name: 'banner_image.en',
                                  type: 'file',
                                  files: newFiles
                                }
                              });
                            }}
                            accept={{ 'image/*': [] }}
                            maxSize={1024 * 1024 * 2}
                          />

                          {(bData as IVastuSlider)?.banner_image?.en && (
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (bData as IVastuSlider)?.banner_image?.en
                                }
                              />
                            </div>
                          )}
                        </FormItem>
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
                            value={(bData as IVastuSlider)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.hi"
                            placeholder="Enter your Short Description"
                            value={
                              (bData as IVastuSlider)?.short_description?.hi
                            }
                            onChange={handleInputChange}
                          />
                        </div>

                        <FormItem className="space-y-3">
                          <FormLabel>Banner Image (Hindi)</FormLabel>

                          <FileUploader
                            value={bannerImageHi ? [bannerImageHi] : []}
                            onValueChange={(newFiles: any) => {
                              setBannerImageHi(newFiles[0] || null);
                              handleInputChange({
                                target: {
                                  name: 'banner_image.hi',
                                  type: 'file',
                                  files: newFiles
                                }
                              });
                            }}
                            accept={{ 'image/*': [] }}
                            maxSize={1024 * 1024 * 2}
                          />

                          {(bData as IVastuSlider)?.banner_image?.hi && (
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={
                                  (bData as IVastuSlider)?.banner_image?.hi
                                }
                              />
                            </div>
                          )}
                        </FormItem>
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
                    value={(bData as IVastuSlider)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="active" className="space-x-3">
                    Active Status
                  </Label>
                  <Switch
                    className="!m-0"
                    checked={(bData as IVastuSlider)?.active}
                    onCheckedChange={(checked: any) =>
                      handleInputChange({
                        target: {
                          type: 'checkbox',
                          name: 'active',
                          checked
                        }
                      })
                    }
                    aria-label="Toggle Active Status"
                  />
                </div>
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
