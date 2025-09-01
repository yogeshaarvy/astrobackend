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
  addEditConsultationConfig,
  fetchConsultationConfig,
  IConsultationConfig,
  updateConsultationConfig
} from '@/redux/slices/consultationSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    consultationConfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.consultationConfig);
  const [bannerImage, setbannerImage] = React.useState<File | null>(null);
  console.log('cData value is:', cData);

  useEffect(() => {
    dispatch(fetchConsultationConfig(null));
  }, []);
  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateConsultationConfig({
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
      dispatch(addEditConsultationConfig(null)).then((response: any) => {
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
      updateConsultationConfig({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Consultation Config
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
                value={(cData as IConsultationConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                // control={form.control}
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IConsultationConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                // control={form.control}
                label="Meta keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IConsultationConfig)?.metaKeyword}
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
                        name: 'mainSection.bannerImage',
                        type: 'file',
                        files: newFiles
                      }
                    });
                  }}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />
                {typeof (cData as IConsultationConfig)?.mainSection
                  ?.bannerImage === 'string' && (
                  <div className="max-h-48 space-y-4">
                    <FileViewCard
                      existingImageURL={
                        (cData as IConsultationConfig)?.mainSection?.bannerImage
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
                    EN
                  </TabsTrigger>
                  <TabsTrigger
                    value="Hindi"
                    className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                  >
                    HI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="English">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      name="mainSection.title.en"
                      placeholder="Enter title"
                      value={
                        (cData as IConsultationConfig)?.mainSection?.title?.en
                      }
                      onChange={handleInputChange}
                    />
                    {/* <Label>Description</Label> */}
                    <CustomTextEditor
                      name="mainSection.description.en"
                      label="Description"
                      value={
                        (cData as IConsultationConfig)?.mainSection?.description
                          ?.en
                      }
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'mainSection.description.en',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                    <CustomTextEditor
                      name="mainSection.short_description.en"
                      label="Short Description"
                      value={
                        (cData as IConsultationConfig)?.mainSection
                          ?.short_description?.en
                      }
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'mainSection.short_description.en',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="Hindi">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      name="mainSection.title.hi"
                      placeholder="Enter title"
                      value={
                        (cData as IConsultationConfig)?.mainSection?.title
                          ?.hi || ''
                      }
                      onChange={handleInputChange}
                    />
                    {/* <Label>Description</Label> */}
                    <CustomTextEditor
                      name="mainSection.description.hi"
                      label="Description"
                      value={
                        (cData as IConsultationConfig)?.mainSection?.description
                          ?.hi || ''
                      }
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'mainSection.description.hi',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                    <CustomTextEditor
                      name="mainSection.short_description.hi"
                      label="Short Description"
                      value={
                        (cData as IConsultationConfig)?.mainSection
                          ?.short_description?.hi
                      }
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'mainSection.short_description.hi',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
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
