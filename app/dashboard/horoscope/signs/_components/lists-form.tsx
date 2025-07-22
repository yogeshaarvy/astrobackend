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
  addEditHoroscopeList,
  IHoroscope,
  updateHoroscopeListData,
  fetchSingleHoroscopeList
} from '@/redux/slices/home/horoscope';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';

export default function HoroscopeForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleHoroscopeState: { loading, data: bData }
  } = useAppSelector((state) => state.horoscope);
  const [darkIcon, setdarkIcon] = useState<File | null>(null);
  const [lightIcon, setlightIcon] = useState<File | null>(null);
  const [bannerImage, setbannerImage] = useState<File | null>(null);

  const form = useForm<IHoroscope>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleHoroscopeList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateHoroscopeListData({
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
      dispatch(addEditHoroscopeList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/horoscope/signs');
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
            Horoscope List Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <Label htmlFor="name">Meta Title</Label>
                  <Input
                    name="metaTitle"
                    placeholder="Enter your Meta Title"
                    value={(bData as IHoroscope)?.metaTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Meta Description</Label>
                  <Input
                    name="metaDescription"
                    placeholder="Enter your Meta Description"
                    value={(bData as IHoroscope)?.metaDescription}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Meta Keyword</Label>
                  <Input
                    name="metaKeyword"
                    placeholder="Enter your Meta Keyword"
                    value={(bData as IHoroscope)?.metaKeyword}
                    onChange={handleInputChange}
                  />
                </div>

                <FormItem className="space-y-3">
                  <FormLabel>Banner Image</FormLabel>

                  <FileUploader
                    value={bannerImage ? [bannerImage] : []}
                    onValueChange={(newFiles: any) => {
                      setbannerImage(newFiles[0] || null);
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

                  {typeof (bData as IHoroscope)?.banner_image === 'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={(bData as IHoroscope)?.banner_image}
                      />
                    </div>
                  )}
                </FormItem>
                <FormItem className="space-y-3">
                  <FormLabel>Dark logo</FormLabel>

                  <FileUploader
                    value={darkIcon ? [darkIcon] : []}
                    onValueChange={(newFiles: any) => {
                      setdarkIcon(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'dark_icon',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />

                  {typeof (bData as IHoroscope)?.dark_icon === 'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={(bData as IHoroscope)?.dark_icon}
                      />
                    </div>
                  )}
                </FormItem>
                <FormItem className="space-y-3">
                  <FormLabel>Light logo</FormLabel>

                  <FileUploader
                    value={lightIcon ? [lightIcon] : []}
                    onValueChange={(newFiles: any) => {
                      setlightIcon(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'light_icon',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />

                  {typeof (bData as IHoroscope)?.light_icon === 'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={(bData as IHoroscope)?.light_icon}
                      />
                    </div>
                  )}
                </FormItem>
                <div className="space-y-1">
                  <Label htmlFor="name">Slug</Label>
                  <Input
                    name="slug"
                    placeholder="Enter Slug"
                    type="text"
                    value={(bData as IHoroscope)?.slug || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Sequence</Label>
                  <Input
                    name="sequence"
                    placeholder="Enter Sequence"
                    type="number"
                    value={(bData as IHoroscope)?.sequence || ''}
                    onChange={handleInputChange}
                  />
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
                            value={(bData as IHoroscope)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.en"
                            placeholder="Enter your Short Description"
                            value={(bData as IHoroscope)?.short_description?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Full Description</Label>
                          <Input
                            name="full_description.en"
                            placeholder="Enter your Full Description"
                            value={(bData as IHoroscope)?.full_description?.en}
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
                            value={(bData as IHoroscope)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.hi"
                            placeholder="Enter your Short Description"
                            value={(bData as IHoroscope)?.short_description?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Full Description</Label>
                          <Input
                            name="full_description.hi"
                            placeholder="Enter your Full Description"
                            value={(bData as IHoroscope)?.full_description?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                    </>
                  </TabsContent>
                </Tabs>
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
