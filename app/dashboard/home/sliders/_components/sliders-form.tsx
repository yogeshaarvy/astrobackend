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
  addEditSliders,
  ISliders,
  updateSlidersData,
  fetchSingleSlider
} from '@/redux/slices/slidersSlice';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function SliderForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleSliderState: { loading, data: bData }
  } = useAppSelector((state) => state.slider);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const form = useForm<ISliders>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleSlider(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateSlidersData({
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
    // const requiredFields: (keyof ISliders)[] = ['title'];

    // const missingFields = requiredFields.filter(
    //   (field) => !(bData as ISliders)?.[field]
    // );

    // if (missingFields.length > 0) {
    //   const fieldLabels: { [key in keyof ISliders]?: string } = {
    //     title: 'Title'
    //   };

    //   const missingFieldLabels = missingFields.map(
    //     (field) => fieldLabels[field] || field
    //   );
    //   toast.error(
    //     `Please fill the required fields: ${missingFieldLabels.join(', ')}`
    //   );
    //   return;
    // }

    try {
      dispatch(addEditSliders(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/home/sliders');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Slider Information
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
                  />{' '}
                  <>
                    {typeof (bData as ISliders)?.banner_image === 'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={(bData as ISliders)?.banner_image}
                          />
                        </div>
                      </>
                    )}
                  </>
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
                            value={(bData as ISliders)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Description</Label>
                          <Input
                            name="description.en"
                            placeholder="Enter your Description"
                            value={(bData as ISliders)?.description?.en}
                            onChange={handleInputChange}
                          />
                        </div>
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
                            value={(bData as ISliders)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name"> Description</Label>
                          <Input
                            name="description.hi"
                            placeholder="Enter your  Description"
                            value={(bData as ISliders)?.description?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
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
                    value={(bData as ISliders)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  {/* <FormLabel></FormLabel> */}
                  <Label htmlFor="name" className="space-x-3">
                    Read Button Status
                  </Label>
                  <Switch
                    className="!m-0"
                    checked={(bData as ISliders)?.buttonStatus}
                    onCheckedChange={(checked: any) =>
                      handleInputChange({
                        target: {
                          type: 'checkbox',
                          name: 'buttonStatus',
                          checked
                        }
                      })
                    }
                    aria-label="Toggle Active Status"
                  />
                </div>

                {(bData as ISliders)?.buttonStatus && (
                  <>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button English Title</Label>
                      <Input
                        name="buttonTitle.en"
                        placeholder="Enter English Button Titlte"
                        value={(bData as ISliders)?.buttonTitle?.en}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button Hindi Title</Label>
                      <Input
                        name="buttonTitle.hi"
                        placeholder="Enter Hindi Button Titlte"
                        value={(bData as ISliders)?.buttonTitle?.hi}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button Link</Label>
                      <Input
                        name="button_link"
                        placeholder="Enter Button Link"
                        value={(bData as ISliders)?.button_link}
                        onChange={handleInputChange}
                      />
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
