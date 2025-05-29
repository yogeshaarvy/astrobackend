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
  addEditHoroscopeDetail,
  fetchSingleHoroscopeDetail,
  IHoroscopeDetail,
  updateHoroscopeDetailData
} from '@/redux/slices/horoscope/horoscopeDetailSlice';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';
export default function AstroPackageForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const horoscopesignId = params.get('horoscopesignId');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleHoroscopeDetailState: { loading, data: bData }
  } = useAppSelector((state) => state.horoscopeDetail);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [showBannerImage, setShowBannerImage] = useState(true);
  const [showBackgroundColor, setShowBackgroundColor] = useState(false);
  const [showSwitch, setShowSwitch] = useState(true);

  const form = useForm<IHoroscopeDetail>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleHoroscopeDetail(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateHoroscopeDetailData({
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
      dispatch(addEditHoroscopeDetail({ entityId, horoscopesignId })).then(
        (response: any) => {
          console.log('this is vjdsvn', horoscopesignId);
          if (!response?.error) {
            router.push(
              `/dashboard/horosope/detail?detailId=${horoscopesignId}`
            );
            toast.success(response?.payload?.message);
          } else {
            toast.error(response.payload);
          }
        }
      );
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateHoroscopeDetailData({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Horoscope Detail List Information
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

                  {typeof (bData as IHoroscopeDetail)?.banner_image ===
                    'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={
                          (bData as IHoroscopeDetail)?.banner_image
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
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="title.en"
                            placeholder="Enter your Title"
                            value={(bData as IHoroscopeDetail)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <CustomTextEditor
                          name="description.en"
                          label="Full Description"
                          value={(bData as IHoroscopeDetail)?.description?.en}
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
                            value={(bData as IHoroscopeDetail)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <CustomTextEditor
                          name="description.hi"
                          label="Full Description"
                          value={(bData as IHoroscopeDetail)?.description?.hi}
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
                    value={(bData as IHoroscopeDetail)?.sequence || ''}
                    onChange={handleInputChange}
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
