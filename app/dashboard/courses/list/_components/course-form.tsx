'use client';
import { FileUploader } from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditCourse,
  ICourse,
  updateCourseData
} from '@/redux/slices/courseSlice';
import CustomTextField from '@/utils/CustomTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function Courseform() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const {
    singleCourseState: { loading, data: eData = [] }
  } = useAppSelector((state) => state.course);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);

  const form = useForm({
    defaultValues: {
      web_eng_title: '',
      web_eng_text: ''
      // web_eng_img: '',
      // web_eng_audio: '',
      // web_hin_title: '',
      // web_hin_text: '',
      // web_hin_img: '',
      // web_hin_audio: ''
    }
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateCourseData({
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

  function onSubmit() {

    dispatch(addEditCourse(entityId));
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center space-x-2">
                <Tabs defaultValue="web" className="mt-4 w-full">
                  <TabsList className="flex w-full space-x-2">
                    <TabsTrigger
                      value="web"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      WEB
                    </TabsTrigger>
                    <TabsTrigger
                      value="app"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      APP
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                    >
                      SEO
                    </TabsTrigger>
                  </TabsList>

                  {/* Web Tab Content */}
                  <TabsContent value="web">
                    <Card>
                      <Tabs defaultValue="English" className="mt-4 w-full">
                        <TabsList className="flex w-full space-x-2">
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

                        {/* English Content */}
                        <TabsContent value="English">
                          <CardHeader>
                            <CardTitle>WEB-English</CardTitle>
                            <CardDescription>
                              Welcome to Web English Course
                            </CardDescription>
                          </CardHeader>

                          {/* English Form */}
                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="name">Title</Label>
                              <Input
                                name="web_eng_title"
                                placeholder="Enter your Title"
                                // aria-controls={form.control}
                                value={(eData as ICourse)?.web_eng_title}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="username">Text</Label>
                              <Input
                                name="web_eng_text"
                                placeholder="Enter Your Text"
                                // aria-controls={form.control}
                                value={(eData as ICourse)?.web_eng_text}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="space-y-1">
                              {/* <Label htmlFor="web-engish-picture">Images</Label>
                              <Input
                                id="web-english-picture"
                                type="file"
                                accept="image/*"
                              /> */}

                              <FormItem className="space-y-3">
                                <FormLabel>Image</FormLabel>
                                <FileUploader
                                  value={imageFiles}
                                  onChange={handleInputChange}
                                  onValueChange={setImageFiles}
                                  accept={{ 'image/*': [] }}
                                  maxSize={1024 * 1024 * 2}
                                />
                              </FormItem>
                            </div>

                            <div className="space-y-1">
                              <FormItem className="space-y-3">
                                <FormLabel>Audio</FormLabel>
                                <FileUploader
                                  value={files}
                                  onChange={handleInputChange}
                                  onValueChange={setFiles}
                                  accept={{ 'audio/*': [] }}
                                  maxSize={1024 * 1024 * 2}
                                />
                              </FormItem>
                            </div>
                          </CardContent>

                          <CardFooter>
                            <Button type="submit">Save changes</Button>
                          </CardFooter>
                        </TabsContent>

                        {/* Hindi Content */}
                        <TabsContent value="Hindi">
                          <CardHeader>
                            <CardTitle>WEB-Hindi</CardTitle>
                            <CardDescription>
                              Welcome to Web Hindi Course
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="name">Title</Label>
                              <Input id="name" defaultValue="Web Hindi Title" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="username">Text</Label>
                              <Input
                                id="username"
                                defaultValue="Web Hindi Text"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="picture">Images</Label>
                              <Input
                                id="picture"
                                type="file"
                                accept="image/*"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="picture">Audio</Label>
                              <Input
                                id="picture"
                                type="file"
                                accept="audio/*"
                              />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button>Save changes</Button>
                          </CardFooter>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  </TabsContent>

                  {/* App Tab Content */}
                  <TabsContent value="app">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, you'll be
                          logged out.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="current">Current password</Label>
                          <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new">New password</Label>
                          <Input id="new" type="password" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save password</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* SEO Tab Content */}
                  <TabsContent value="seo">
                    <Card>
                      <CardHeader>
                        <CardTitle>SEO</CardTitle>
                        <CardDescription>
                          Optimize your content here to improve visibility.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
