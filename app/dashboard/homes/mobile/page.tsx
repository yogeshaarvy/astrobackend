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
  addEditMobileImage,
  fetchMobileImages,
  IMobileImage,
  updateMobileImage
} from '@/redux/slices/home/mobileImageSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    mobileImageState: { loading, data: cData = null }
  } = useAppSelector((state) => state.mobileImage);

  console.log('this is the cData Value', cData);
  const [consultationEnFile, setConsultationEnFile] =
    React.useState<File | null>(null);
  const [consultationHiFile, setConsultationHiFile] =
    React.useState<File | null>(null);
  const [kundliEnFile, setKundliEnFile] = React.useState<File | null>(null);
  const [kundliHiFile, setKundliHiFile] = React.useState<File | null>(null);
  const [vibhorEnFile, setVibhorEnFile] = React.useState<File | null>(null);
  const [vibhorHiFile, setVibhorHiFile] = React.useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchMobileImages(null));
  }, []);

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateMobileImage({
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
      dispatch(addEditMobileImage(null)).then((response: any) => {
        if (!response?.error) {
          // Reset all file states
          setConsultationEnFile(null);
          setConsultationHiFile(null);
          setKundliEnFile(null);
          setKundliHiFile(null);
          setVibhorEnFile(null);
          setVibhorHiFile(null);
          toast.success(
            response?.payload?.message || 'Images updated successfully'
          );
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
            Mobile Home Page Images
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Consultation Images Section */}
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Consultation Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              <Tabs defaultValue="English" className="w-full">
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
                  <div className="space-y-2 pt-4">
                    <FormItem className="space-y-3">
                      <FormLabel>Consultation Image (English)</FormLabel>
                      <FileUploader
                        value={consultationEnFile ? [consultationEnFile] : []}
                        onValueChange={(newFiles: any) => {
                          setConsultationEnFile(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'consultationImage.en',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IMobileImage)?.consultationImage?.en ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMobileImage)?.consultationImage?.en
                            }
                          />
                        </div>
                      )}
                    </FormItem>
                  </div>
                </TabsContent>

                <TabsContent value="Hindi">
                  <div className="space-y-2 pt-4">
                    <FormItem className="space-y-3">
                      <FormLabel>Consultation Image (Hindi)</FormLabel>
                      <FileUploader
                        value={consultationHiFile ? [consultationHiFile] : []}
                        onValueChange={(newFiles: any) => {
                          setConsultationHiFile(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'consultationImage.hi',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IMobileImage)?.consultationImage?.hi ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMobileImage)?.consultationImage?.hi
                            }
                          />
                        </div>
                      )}
                    </FormItem>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Kundli Images Section */}
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Kundli Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              <Tabs defaultValue="English" className="w-full">
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
                  <div className="space-y-2 pt-4">
                    <FormItem className="space-y-3">
                      <FormLabel>Kundli Image (English)</FormLabel>
                      <FileUploader
                        value={kundliEnFile ? [kundliEnFile] : []}
                        onValueChange={(newFiles: any) => {
                          setKundliEnFile(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'kundliImage.en',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IMobileImage)?.kundliImage?.en ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMobileImage)?.kundliImage?.en
                            }
                          />
                        </div>
                      )}
                    </FormItem>
                  </div>
                </TabsContent>

                <TabsContent value="Hindi">
                  <div className="space-y-2 pt-4">
                    <FormItem className="space-y-3">
                      <FormLabel>Kundli Image (Hindi)</FormLabel>
                      <FileUploader
                        value={kundliHiFile ? [kundliHiFile] : []}
                        onValueChange={(newFiles: any) => {
                          setKundliHiFile(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'kundliImage.hi',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IMobileImage)?.kundliImage?.hi ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMobileImage)?.kundliImage?.hi
                            }
                          />
                        </div>
                      )}
                    </FormItem>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Vibhor Images Section */}
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Vibhor Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              <Tabs defaultValue="English" className="w-full">
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
                  <div className="space-y-2 pt-4">
                    <FormItem className="space-y-3">
                      <FormLabel>Vibhor Image (English)</FormLabel>
                      <FileUploader
                        value={vibhorEnFile ? [vibhorEnFile] : []}
                        onValueChange={(newFiles: any) => {
                          setVibhorEnFile(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'vibhorImage.en',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IMobileImage)?.vibhorImage?.en ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMobileImage)?.vibhorImage?.en
                            }
                          />
                        </div>
                      )}
                    </FormItem>
                  </div>
                </TabsContent>

                <TabsContent value="Hindi">
                  <div className="space-y-2 pt-4">
                    <FormItem className="space-y-3">
                      <FormLabel>Vibhor Image (Hindi)</FormLabel>
                      <FileUploader
                        value={vibhorHiFile ? [vibhorHiFile] : []}
                        onValueChange={(newFiles: any) => {
                          setVibhorHiFile(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'vibhorImage.hi',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (cData as IMobileImage)?.vibhorImage?.hi ===
                        'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as IMobileImage)?.vibhorImage?.hi
                            }
                          />
                        </div>
                      )}
                    </FormItem>
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
        <Button type="submit" onClick={() => handleSubmit()} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </CardFooter>
    </PageContainer>
  );
};

export default Page;
