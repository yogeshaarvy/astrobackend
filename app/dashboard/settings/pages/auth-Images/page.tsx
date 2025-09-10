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
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  addEditAuthImage,
  fetchAuthImage,
  IAuthImages,
  updateAuthImage
} from '@/redux/slices/authImageSlice';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    authImageState: { loading, data: authImageData, error }
  } = useAppSelector((state) => state.authImage);

  // User image states
  const [userLoginImage, setUserLoginImage] = useState<File | null>(null);
  const [userRegistrationImage, setUserRegistrationImage] =
    useState<File | null>(null);
  const [userForgetPasswordImage, setUserForgetPasswordImage] =
    useState<File | null>(null);
  const [userOtpVerifyImage, setUserOtpVerifyImage] = useState<File | null>(
    null
  );
  const [userUpdatePasswordImage, setUserUpdatePasswordImage] =
    useState<File | null>(null);

  // Astrologer image states
  const [astrologerLoginImage, setAstrologerLoginImage] = useState<File | null>(
    null
  );
  const [astrologerRegistrationImage, setAstrologerRegistrationImage] =
    useState<File | null>(null);
  const [astrologerForgetPasswordImage, setAstrologerForgetPasswordImage] =
    useState<File | null>(null);
  const [astrologerOtpVerifyImage, setAstrologerOtpVerifyImage] =
    useState<File | null>(null);
  const [astrologerUpdatePasswordImage, setAstrologerUpdatePasswordImage] =
    useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchAuthImage(null));
  }, [dispatch]);

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateAuthImage({
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
      dispatch(addEditAuthImage(null)).then((response: any) => {
        if (!response?.error) {
          // Clear all image states
          setUserLoginImage(null);
          setUserRegistrationImage(null);
          setUserForgetPasswordImage(null);
          setUserOtpVerifyImage(null);
          setUserUpdatePasswordImage(null);
          setAstrologerLoginImage(null);
          setAstrologerRegistrationImage(null);
          setAstrologerForgetPasswordImage(null);
          setAstrologerOtpVerifyImage(null);
          setAstrologerUpdatePasswordImage(null);
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  const handleFileChange = (
    fieldName: string,
    files: File[],
    setStateFunction: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = files[0] || null;
    setStateFunction(file);
    handleInputChange({
      target: {
        name: fieldName,
        type: 'file',
        files: files
      }
    });
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Authentication Images Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Tabs defaultValue="userAuth" className="mt-4 w-full">
                  <TabsList className="flex w-full space-x-2 p-0">
                    <TabsTrigger
                      value="userAuth"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      User Auth Images
                    </TabsTrigger>
                    <TabsTrigger
                      value="astrologerAuth"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      Astrologer Auth Images
                    </TabsTrigger>
                  </TabsList>

                  {/* User Auth Images Tab */}
                  <TabsContent value="userAuth">
                    <div className="space-y-6">
                      {/* User Login Image */}
                      <div className="mb-4">
                        <FormLabel>User Login Image</FormLabel>
                        <FileUploader
                          value={userLoginImage ? [userLoginImage] : []}
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'user.userLoginImage',
                              newFiles,
                              setUserLoginImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.user?.userLoginImage ===
                          'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.user.userLoginImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* User Registration Image */}
                      <div className="mb-4">
                        <FormLabel>User Registration Image</FormLabel>
                        <FileUploader
                          value={
                            userRegistrationImage ? [userRegistrationImage] : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'user.userRegistrationImage',
                              newFiles,
                              setUserRegistrationImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.user?.userRegistrationImage ===
                          'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.user.userRegistrationImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* User Forget Password Image */}
                      <div className="mb-4">
                        <FormLabel>User Forget Password Image</FormLabel>
                        <FileUploader
                          value={
                            userForgetPasswordImage
                              ? [userForgetPasswordImage]
                              : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'user.userForgetPasswordImage',
                              newFiles,
                              setUserForgetPasswordImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.user?.userForgetPasswordImage ===
                          'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.user.userForgetPasswordImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* User OTP Verify Image */}
                      <div className="mb-4">
                        <FormLabel>User OTP Verify Image</FormLabel>
                        <FileUploader
                          value={userOtpVerifyImage ? [userOtpVerifyImage] : []}
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'user.userOtpVerifyImage',
                              newFiles,
                              setUserOtpVerifyImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.user?.userOtpVerifyImage ===
                          'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.user.userOtpVerifyImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* User Update Password Image */}
                      <div className="mb-4">
                        <FormLabel>User Update Password Image</FormLabel>
                        <FileUploader
                          value={
                            userUpdatePasswordImage
                              ? [userUpdatePasswordImage]
                              : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'user.userUpdatePasswordImage',
                              newFiles,
                              setUserUpdatePasswordImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.user?.userUpdatePasswordImage ===
                          'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.user.userUpdatePasswordImage
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Astrologer Auth Images Tab */}
                  <TabsContent value="astrologerAuth">
                    <div className="space-y-6">
                      {/* Astrologer Login Image */}
                      <div className="mb-4">
                        <FormLabel>Astrologer Login Image</FormLabel>
                        <FileUploader
                          value={
                            astrologerLoginImage ? [astrologerLoginImage] : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'astrologer.astrologerLoginImage',
                              newFiles,
                              setAstrologerLoginImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.astrologer
                          ?.astrologerLoginImage === 'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.astrologer.astrologerLoginImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Astrologer Registration Image */}
                      <div className="mb-4">
                        <FormLabel>Astrologer Registration Image</FormLabel>
                        <FileUploader
                          value={
                            astrologerRegistrationImage
                              ? [astrologerRegistrationImage]
                              : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'astrologer.astrologerRegistrationImage',
                              newFiles,
                              setAstrologerRegistrationImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.astrologer
                          ?.astrologerRegistrationImage === 'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.astrologer
                                  .astrologerRegistrationImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Astrologer Forget Password Image */}
                      <div className="mb-4">
                        <FormLabel>Astrologer Forget Password Image</FormLabel>
                        <FileUploader
                          value={
                            astrologerForgetPasswordImage
                              ? [astrologerForgetPasswordImage]
                              : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'astrologer.astrologerForgetPasswordImage',
                              newFiles,
                              setAstrologerForgetPasswordImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.astrologer
                          ?.astrologerForgetPasswordImage === 'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.astrologer
                                  .astrologerForgetPasswordImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Astrologer OTP Verify Image */}
                      <div className="mb-4">
                        <FormLabel>Astrologer OTP Verify Image</FormLabel>
                        <FileUploader
                          value={
                            astrologerOtpVerifyImage
                              ? [astrologerOtpVerifyImage]
                              : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'astrologer.astrologerOtpVerifyImage',
                              newFiles,
                              setAstrologerOtpVerifyImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.astrologer
                          ?.astrologerOtpVerifyImage === 'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.astrologer
                                  .astrologerOtpVerifyImage
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Astrologer Update Password Image */}
                      <div className="mb-4">
                        <FormLabel>Astrologer Update Password Image</FormLabel>
                        <FileUploader
                          value={
                            astrologerUpdatePasswordImage
                              ? [astrologerUpdatePasswordImage]
                              : []
                          }
                          onValueChange={(newFiles: any) =>
                            handleFileChange(
                              'astrologer.astrologerUpdatePasswordImage',
                              newFiles,
                              setAstrologerUpdatePasswordImage
                            )
                          }
                          accept={{ 'image/*': [] }}
                          maxSize={1024 * 1024 * 2}
                        />
                        {typeof authImageData?.astrologer
                          ?.astrologerUpdatePasswordImage === 'string' && (
                          <div className="mt-2 max-h-48 space-y-4">
                            <FileViewCard
                              existingImageURL={
                                authImageData.astrologer
                                  .astrologerUpdatePasswordImage
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            onClick={handleSubmit}
            // disabled={loading}
            className="min-w-32"
          >
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
};

export default Page;
