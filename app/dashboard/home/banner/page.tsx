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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
// import CustomTextEditor from '@/utils/CustomTextEditor';
import {
  addEditMidbanner,
  fetchMidbanner,
  IMidbanner,
  updateMidBannerData
} from '@/redux/slices/midbanner';
import { Checkbox } from '@/components/ui/checkbox';
import slugify from 'slugify';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter(); // Ref for file input

  const {
    midbannerState: { data: jData }
  } = useAppSelector((state) => state.midbanner);
  const [iconImg, setIconImg] = React.useState<File | null>(null);

  const form = useForm({});

  useEffect(() => {
    dispatch(fetchMidbanner(null));
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateMidBannerData({
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
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const requiredFields: (keyof IMidbanner)[] = ['title'];

    const missingFields = requiredFields.filter(
      (field) => !(jData as IMidbanner)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof IMidbanner]?: string } = {
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
      dispatch(addEditMidbanner(null)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/home/banner');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  console.log('The jData value is:', jData);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Banner Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full space-y-8"
                  >
                    {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}

                    <FormItem className="space-y-3">
                      <FormLabel>Banner Image</FormLabel>
                      <FileUploader
                        value={iconImg ? [iconImg] : []}
                        onValueChange={(newFiles: any) => {
                          setIconImg(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'image',
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
                        {typeof (jData as IMidbanner)?.image === 'string' && (
                          <>
                            <div className="max-h-48 space-y-4">
                              <FileViewCard
                                existingImageURL={(jData as IMidbanner)?.image}
                              />
                            </div>
                          </>
                        )}
                      </>
                    </FormItem>
                    <div className="space-y-1">
                      <Label htmlFor="name">Title</Label>
                      <Input
                        name="title"
                        placeholder="Enter your Title"
                        value={(jData as IMidbanner)?.title || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="name">Description</Label>
                      <Input
                        name="description"
                        placeholder="Enter your Description"
                        value={(jData as IMidbanner)?.description || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="name">Link</Label>
                      <Input
                        name="link"
                        placeholder="Enter your Link"
                        value={(jData as IMidbanner)?.link || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* <Card>
                      <CardHeader className="flex flex-row items-center justify-center gap-5">
                        <CardTitle>Hero Slider</CardTitle>
                      </CardHeader>
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
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>ENGLISH CONTENT</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="name">Title</Label>
                              <Input
                                name="title.en"
                                placeholder="Enter your Title"
                                value={(jData as IMidbanner)?.title?.en || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                          </CardContent>
                        </TabsContent>

                       
                        <TabsContent value="Hindi">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>HINDI CONTENT</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="name">Title</Label>
                              <Input
                                name="title.hi"
                                placeholder="Enter your Title"
                                value={(jData as IMidbanner)?.title?.hi || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                          </CardContent>
                        </TabsContent>
                      </Tabs>
                    </Card> */}
                  </form>
                </Form>
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
          <Button type="submit" onClick={(e: any) => handleSubmit(e)}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
