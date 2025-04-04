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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditBlog,
  fetchBlog,
  IBlogConfig,
  updateBlog
} from '@/redux/slices/Configs/blogsSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    blogConfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.blogConfig);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);

  console.log('The loading value is:', loading, cData);

  useEffect(() => {
    dispatch(fetchBlog(null));
  }, []);
  console.log('The cData value is:', cData);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    console.log('e-value', name, value);
    dispatch(
      updateBlog({
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

  const handleSubmit = () => {
    try {
      dispatch(addEditBlog(null)).then((response: any) => {
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
      updateBlog({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  console.log('The bannerImage type value is:', cData);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Blog Config List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}

              <CustomTextField
                name="metaTitle"
                // control={form.control}
                label="Meta Title"
                placeholder="Enter your Meta Title"
                value={(cData as IBlogConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                // control={form.control}
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IBlogConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                // control={form.control}
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IBlogConfig)?.metaKeyword}
                onChange={handleInputChange}
              />

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

                {typeof (cData as IBlogConfig)?.banner_image === 'string' && (
                  <div className="max-h-48 space-y-4">
                    <FileViewCard
                      existingImageURL={(cData as IBlogConfig)?.banner_image}
                    />
                  </div>
                )}
              </FormItem>

              <div className="space-y-3">
                <Label htmlFor="backgroundColor">Background Color</Label>

                <Switch
                  className="!m-0"
                  checked={(cData as IBlogConfig)?.backgroundStatus}
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

                {(cData as IBlogConfig)?.backgroundStatus && (
                  <div className="flex items-center gap-2">
                    {/* Color Picker */}
                    <Input
                      type="color"
                      name="backgroundColor"
                      value={
                        (cData as IBlogConfig)?.backgroundColor || '#000000'
                      }
                      onChange={handleInputChange}
                      className="h-10 w-12 cursor-pointer p-1"
                    />

                    {/* Hex Code Input */}
                    <Input
                      type="text"
                      name="backgroundColor"
                      value={
                        (cData as IBlogConfig)?.backgroundColor || '#000000'
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
                          value={(cData as IBlogConfig)?.title?.en}
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
                          value={(cData as IBlogConfig)?.title?.hi}
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                  </>
                </TabsContent>
              </Tabs>

              <div className="space-y-3">
                <Label htmlFor="textColour">Text Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    name="textColour"
                    value={(cData as IBlogConfig)?.textColour || '#000000'}
                    onChange={handleInputChange}
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                  <Input
                    type="text"
                    name="textColour"
                    value={(cData as IBlogConfig)?.textColour || '#000000'}
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
                  value={(cData as IBlogConfig)?.textAlignment || ''}
                  onChange={handleDropdownChange}
                />
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
