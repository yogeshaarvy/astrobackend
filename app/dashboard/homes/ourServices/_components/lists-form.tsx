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
  addEditOurServicesList,
  IOurServices,
  updateOurServicesListData,
  fetchSingleOurServicesList
} from '@/redux/slices/home/ourServices';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';

export default function OurServicesForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleOurServicesState: { loading, data: bData }
  } = useAppSelector((state) => state.ourService);
  const [IconImage, setIconImage] = useState<File | null>(null);
  const [showBannerImage, setShowBannerImage] = useState(true);
  const [showBackgroundColor, setShowBackgroundColor] = useState(false);
  const [showSwitch, setShowSwitch] = useState(true);

  const form = useForm<IOurServices>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleOurServicesList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateOurServicesListData({
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
      dispatch(addEditOurServicesList(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/homes/ourServices');
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
            OurService List Information
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
                  <FormLabel>icon image</FormLabel>

                  <FileUploader
                    value={IconImage ? [IconImage] : []}
                    onValueChange={(newFiles: any) => {
                      setIconImage(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'icon_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />

                  {typeof (bData as IOurServices)?.icon_image === 'string' && (
                    <div className="max-h-48 space-y-4">
                      <FileViewCard
                        existingImageURL={(bData as IOurServices)?.icon_image}
                      />
                    </div>
                  )}
                </FormItem>

                <div className="space-y-3">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-2">
                    {/* Color Picker */}
                    <Input
                      type="color"
                      name="backgroundColor"
                      value={
                        (bData as IOurServices)?.backgroundColor || '#000000'
                      }
                      onChange={handleInputChange}
                      className="h-10 w-12 cursor-pointer p-1"
                    />

                    {/* Hex Code Input */}
                    <Input
                      type="text"
                      name="backgroundColor"
                      value={
                        (bData as IOurServices)?.backgroundColor || '#000000'
                      }
                      // onChange={handleInputChange}
                      placeholder="Enter color hex code"
                      className="flex-1"
                    />
                  </div>
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
                            value={(bData as IOurServices)?.title?.en}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.en"
                            placeholder="Enter your Short Description"
                            value={
                              (bData as IOurServices)?.short_description?.en
                            }
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
                            value={(bData as IOurServices)?.title?.hi}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="short_description.hi"
                            placeholder="Enter your Short Description"
                            value={
                              (bData as IOurServices)?.short_description?.hi
                            }
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
                    value={(bData as IOurServices)?.sequence || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      name="textColor"
                      value={(bData as IOurServices)?.textColor || '#000000'}
                      onChange={handleInputChange}
                      className="h-10 w-12 cursor-pointer p-1"
                    />
                    <Input
                      type="text"
                      name="textColor"
                      value={(bData as IOurServices)?.textColor || '#000000'}
                      // onChange={handleInputChange}
                      placeholder="Enter color hex code"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-1 ">
                  <Label htmlFor="name" className="space-x-3">
                    Read Button Status
                  </Label>
                  <Switch
                    className="!m-0"
                    checked={(bData as IOurServices)?.readStatus}
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

                {(bData as IOurServices)?.readStatus && (
                  <>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button English Title</Label>
                      <Input
                        name="readTitle.en"
                        placeholder="Enter English Button Titlte"
                        value={(bData as IOurServices)?.readTitle?.en}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button Hindi Title</Label>
                      <Input
                        name="readTitle.hi"
                        placeholder="Enter Hindi Button Titlte"
                        value={(bData as IOurServices)?.readTitle?.hi}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="!mt-3">
                      <Label htmlFor="name">Button Link</Label>
                      <Input
                        name="readLinks"
                        placeholder="Enter Button Link"
                        value={(bData as IOurServices)?.readLinks}
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
                            (bData as IOurServices)?.readTextColor || '#000000'
                          }
                          onChange={handleInputChange}
                          className="h-10 w-12 cursor-pointer p-1"
                        />
                        <Input
                          type="text"
                          name="readTextColor"
                          value={
                            (bData as IOurServices)?.readTextColor || '#000000'
                          }
                          // onChange={handleInputChange}
                          placeholder="Enter color hex code"
                          className="flex-1"
                        />
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
