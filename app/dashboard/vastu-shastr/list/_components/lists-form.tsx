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
  addEditVastushastrList,
  IVastushastrList,
  updateVastushastrListData,
  fetchSingleVastushastrList
} from '@/redux/slices/vastushastr/list';
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
    singleVastushastrListState: { loading, data: bData }
  } = useAppSelector((state) => state.vastushastrList);
  const [ThumbnailImage, setThumbnailImage] = useState<File | null>(null);
  console.log('this is the bdata', bData);

  const form = useForm<IVastushastrList>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleVastushastrList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateVastushastrListData({
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
      dispatch(addEditVastushastrList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/vastu-shastr/list');
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
            Astropooja List Information
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
                  <FormLabel>icon</FormLabel>

                  <FileUploader
                    value={ThumbnailImage ? [ThumbnailImage] : []}
                    onValueChange={(newFiles: any) => {
                      setThumbnailImage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'icon',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />

                  {typeof (bData as IVastushastrList)?.icon === 'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={(bData as IVastushastrList)?.icon}
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
                            value={(bData as IVastushastrList)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <CustomTextEditor
                            name="short_description.en"
                            label="Short Description"
                            value={
                              (bData as IVastushastrList)?.short_description?.en
                            }
                            onChange={(value) =>
                              handleInputChange({
                                target: {
                                  name: 'short_description.en',
                                  value: value,
                                  type: 'text'
                                }
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <CustomTextEditor
                            name="description.en"
                            label="Full Description"
                            value={(bData as IVastushastrList)?.description?.en}
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
                            value={(bData as IVastushastrList)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <CustomTextEditor
                            name="short_description.hi"
                            label="Short Description"
                            value={
                              (bData as IVastushastrList)?.short_description?.hi
                            }
                            onChange={(value) =>
                              handleInputChange({
                                target: {
                                  name: 'short_description.hi',
                                  value: value,
                                  type: 'text'
                                }
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <CustomTextEditor
                            name="description.hi"
                            label="Full Description"
                            value={(bData as IVastushastrList)?.description?.hi}
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
                    value={(bData as IVastushastrList)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Css ID</Label>
                  <Input
                    name="cssid"
                    placeholder="Enter Css Id"
                    type="text"
                    value={(bData as IVastushastrList)?.cssid || ''}
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
