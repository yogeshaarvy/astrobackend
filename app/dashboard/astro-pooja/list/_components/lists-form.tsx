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
  addEditAstropoojaList,
  IAstropoojaList,
  updateAstropoojaListData,
  fetchSingleAstropoojaList
} from '@/redux/slices/astropooja/list';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';

export default function AstropoojaListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleAstropoojaListState: { loading, data: bData }
  } = useAppSelector((state) => state.astropoojaList);
  const [ThumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [showBannerImage, setShowBannerImage] = useState(true);
  const [showBackgroundColor, setShowBackgroundColor] = useState(false);
  const [showSwitch, setShowSwitch] = useState(true);

  const form = useForm<IAstropoojaList>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleAstropoojaList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateAstropoojaListData({
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
      dispatch(addEditAstropoojaList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/astro-pooja/list');
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
            Astro-Puja List Information
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
                    placeholder="Enter Meta Title"
                    value={(bData as IAstropoojaList)?.metaTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Meta Description</Label>
                  <Input
                    name="metaDescription"
                    placeholder="Enter Meta Description"
                    value={(bData as IAstropoojaList)?.metaDescription}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Meta Keyword</Label>
                  <Input
                    name="metaKeyword"
                    placeholder="Enter Meta Keyword"
                    value={(bData as IAstropoojaList)?.metaKeyword}
                    onChange={handleInputChange}
                  />
                </div>
                <FormItem className="space-y-3">
                  <FormLabel>Thumbnail image</FormLabel>

                  <FileUploader
                    value={ThumbnailImage ? [ThumbnailImage] : []}
                    onValueChange={(newFiles: any) => {
                      setThumbnailImage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'thumbnail_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />

                  {typeof (bData as IAstropoojaList)?.thumbnail_image ===
                    'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={
                          (bData as IAstropoojaList)?.thumbnail_image
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
                            value={(bData as IAstropoojaList)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <CustomTextEditor
                            name="description.en"
                            label="Full Description"
                            value={(bData as IAstropoojaList)?.description?.en}
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
                            value={(bData as IAstropoojaList)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <CustomTextEditor
                            name="description.hi"
                            label="Full Description"
                            value={(bData as IAstropoojaList)?.description?.hi}
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
                    value={(bData as IAstropoojaList)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Slug</Label>
                  <Input
                    name="slug"
                    placeholder="Enter Slug"
                    type="text"
                    value={(bData as IAstropoojaList)?.slug || ''}
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
