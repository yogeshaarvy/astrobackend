'use client';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditConfigPage,
  fetchConfig,
  type IConfig,
  updateConfig
} from '@/redux/slices/home/configSlice';
import CustomTextField from '@/utils/CustomTextField';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    configState: { loading, data: cData = null }
  } = useAppSelector((state) => state.configs);
  const [ourServicesImage, setOurServicesImage] = useState<File | null>(null);
  const [horoscopeForestImage, setHoroscopeForestImage] = useState<File | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchConfig(null));
  }, []);

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateConfig({
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

  const handleActiveToggle = (section: string) => (checked: boolean) => {
    dispatch(updateConfig({ [`${section}.active`]: checked }));
  };

  const handleSubmit = () => {
    try {
      dispatch(addEditConfigPage(null)).then((response: any) => {
        if (!response?.error) {
          setOurServicesImage(null);
          setHoroscopeForestImage(null);
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  const configData = cData as IConfig;

  return (
    <PageContainer scrollable>
      {/* Meta Information Card */}
      <Card className="mx-auto mb-6 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Meta Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <CustomTextField
                name="metaTitle"
                label="Meta Title"
                placeholder="Enter your Meta Title"
                value={(cData as IConfig)?.metaTitle}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaDescription"
                label="Meta Description"
                placeholder="Enter your Meta Description"
                value={(cData as IConfig)?.metaDescription}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="metaKeyword"
                label="Meta Keywords"
                placeholder="Enter your Meta Keywords"
                value={(cData as IConfig)?.metaKeyword}
                onChange={handleInputChange}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Our Services Section Card */}
      <Card className="mx-auto mb-6 w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-2xl font-bold">
              Our Services
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="ourServices-active">Active</Label>
              <Switch
                id="ourServices-active"
                checked={configData?.ourServices?.active || false}
                onCheckedChange={handleActiveToggle('ourServices')}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormItem className="space-y-3">
                <FormLabel>Divider Image</FormLabel>
                <FileUploader
                  value={ourServicesImage ? [ourServicesImage] : []}
                  onValueChange={(newFiles: any) => {
                    setOurServicesImage(newFiles[0] || null);
                    handleInputChange({
                      target: {
                        name: 'ourServices.dividerImage',
                        type: 'file',
                        files: newFiles
                      }
                    });
                  }}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />{' '}
                <>
                  {typeof (cData as IConfig)?.ourServices?.dividerImage ===
                    'string' && (
                    <>
                      <div className="max-h-48 space-y-4">
                        <FileViewCard
                          existingImageURL={
                            (cData as IConfig)?.ourServices?.dividerImage
                          }
                        />
                      </div>
                    </>
                  )}
                </>
              </FormItem>
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

                <TabsContent value="English" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Our Services Title (English)</Label>
                    <Input
                      name="ourServices.title.en"
                      placeholder="Enter Our Services title in English"
                      value={(cData as IConfig)?.ourServices?.title?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Our Services Description (English)</Label>
                    <Input
                      name="ourServices.description.en"
                      placeholder="Enter Our Services description in English"
                      value={(cData as IConfig)?.ourServices?.description?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Our Services Title (Hindi)</Label>
                    <Input
                      name="ourServices.title.hi"
                      placeholder="Enter Our Services title in Hindi"
                      value={(cData as IConfig)?.ourServices?.title?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Our Services Description (Hindi)</Label>
                    <Input
                      name="ourServices.description.hi"
                      placeholder="Enter Our Services description in Hindi"
                      value={(cData as IConfig)?.ourServices?.description?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Horoscope Forest Section Card */}
      <Card className="mx-auto mb-6 w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-2xl font-bold">
              Horoscope Forecast
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="horoscopeForest-active">Active</Label>
              <Switch
                id="horoscopeForest-active"
                checked={configData?.horoscopeForest?.active || false}
                onCheckedChange={handleActiveToggle('horoscopeForest')}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormItem className="space-y-3">
                <FormLabel>Divider Image</FormLabel>
                <FileUploader
                  value={horoscopeForestImage ? [horoscopeForestImage] : []}
                  onValueChange={(newFiles: any) => {
                    setHoroscopeForestImage(newFiles[0] || null);
                    handleInputChange({
                      target: {
                        name: 'horoscopeForest.divide_Image',
                        type: 'file',
                        files: newFiles
                      }
                    });
                  }}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />{' '}
                <>
                  {typeof (cData as IConfig)?.horoscopeForest?.divide_Image ===
                    'string' && (
                    <>
                      <div className="max-h-48 space-y-4">
                        <FileViewCard
                          existingImageURL={
                            (cData as IConfig)?.horoscopeForest?.divide_Image
                          }
                        />
                      </div>
                    </>
                  )}
                </>
              </FormItem>
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

                <TabsContent value="English" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Horoscope Forecast Title (English)</Label>
                    <Input
                      name="horoscopeForest.title.en"
                      placeholder="Enter Horoscope Forecast title in English"
                      value={(cData as IConfig)?.horoscopeForest?.title?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horoscope Forecast Description (English)</Label>
                    <Input
                      name="horoscopeForest.description.en"
                      placeholder="Enter Horoscope Forecast description in English"
                      value={
                        (cData as IConfig)?.horoscopeForest?.description?.en
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Horoscope Forecast Title (Hindi)</Label>
                    <Input
                      name="horoscopeForest.title.hi"
                      placeholder="Enter Horoscope Forecast title in Hindi"
                      value={(cData as IConfig)?.horoscopeForest?.title?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horoscope Forecast Description (Hindi)</Label>
                    <Input
                      name="horoscopeForest.description.hi"
                      placeholder="Enter Horoscope Forecast description in Hindi"
                      value={
                        (cData as IConfig)?.horoscopeForest?.description?.hi
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Our Products Section Card */}
      <Card className="mx-auto mb-6 w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-2xl font-bold">
              Our Products
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="ourProducts-active">Active</Label>
              <Switch
                id="ourProducts-active"
                checked={configData?.ourProducts?.active || false}
                onCheckedChange={handleActiveToggle('ourProducts')}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
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

                <TabsContent value="English" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Our Products Title (English)</Label>
                    <Input
                      name="ourProducts.title.en"
                      placeholder="Enter Our Products title in English"
                      value={(cData as IConfig)?.ourProducts?.title?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Our Products Description (English)</Label>
                    <Input
                      name="ourProducts.description.en"
                      placeholder="Enter Our Products description in English"
                      value={(cData as IConfig)?.ourProducts?.description?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Our Products Title (Hindi)</Label>
                    <Input
                      name="ourProducts.title.hi"
                      placeholder="Enter Our Products title in Hindi"
                      value={(cData as IConfig)?.ourProducts?.title?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Our Products Description (Hindi)</Label>
                    <Input
                      name="ourProducts.description.hi"
                      placeholder="Enter Our Products description in Hindi"
                      value={(cData as IConfig)?.ourProducts?.description?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Latest Articles Section Card */}
      <Card className="mx-auto mb-6 w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-2xl font-bold">
              Latest Articles
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="latestArticles-active">Active</Label>
              <Switch
                id="latestArticles-active"
                checked={configData?.latestArticles?.active || false}
                onCheckedChange={handleActiveToggle('latestArticles')}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
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

                <TabsContent value="English" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Latest Articles Title (English)</Label>
                    <Input
                      name="latestArticles.title.en"
                      placeholder="Enter Latest Articles title in English"
                      value={(cData as IConfig)?.latestArticles?.title?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Latest Articles Description (English)</Label>
                    <Input
                      name="latestArticles.description.en"
                      placeholder="Enter Latest Articles description in English"
                      value={
                        (cData as IConfig)?.latestArticles?.description?.en
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Latest Articles Title (Hindi)</Label>
                    <Input
                      name="latestArticles.title.hi"
                      placeholder="Enter Latest Articles title in Hindi"
                      value={(cData as IConfig)?.latestArticles?.title?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Latest Articles Description (Hindi)</Label>
                    <Input
                      name="latestArticles.description.hi"
                      placeholder="Enter Latest Articles description in Hindi"
                      value={
                        (cData as IConfig)?.latestArticles?.description?.hi
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Talk To Astrologer Section Card */}
      <Card className="mx-auto mb-6 w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-2xl font-bold">
              Talk To Astrologer
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="talkToAstrologer-active">Active</Label>
              <Switch
                id="talkToAstrologer-active"
                checked={configData?.talkToAstrologer?.active || false}
                onCheckedChange={handleActiveToggle('talkToAstrologer')}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
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

                <TabsContent value="English" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Talk To Astrologer Title (English)</Label>
                    <Input
                      name="talkToAstrologer.title.en"
                      placeholder="Enter Talk To Astrologer title in English"
                      value={(cData as IConfig)?.talkToAstrologer?.title?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Talk To Astrologer Description (English)</Label>
                    <Input
                      name="talkToAstrologer.description.en"
                      placeholder="Enter Talk To Astrologer description in English"
                      value={
                        (cData as IConfig)?.talkToAstrologer?.description?.en
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Talk To Astrologer Title (Hindi)</Label>
                    <Input
                      name="talkToAstrologer.title.hi"
                      placeholder="Enter Talk To Astrologer title in Hindi"
                      value={(cData as IConfig)?.talkToAstrologer?.title?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Talk To Astrologer Description (Hindi)</Label>
                    <Input
                      name="talkToAstrologer.description.hi"
                      placeholder="Enter Talk To Astrologer description in Hindi"
                      value={
                        (cData as IConfig)?.talkToAstrologer?.description?.hi
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Ved Mantra Jaap Section Card */}
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-2xl font-bold">
              Ved Mantra Jaap
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="vedMantraJaap-active">Active</Label>
              <Switch
                id="vedMantraJaap-active"
                checked={configData?.vedMantraJaap?.active || false}
                onCheckedChange={handleActiveToggle('vedMantraJaap')}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
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

                <TabsContent value="English" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Ved Mantra Jaap Title (English)</Label>
                    <Input
                      name="vedMantraJaap.title.en"
                      placeholder="Enter Ved Mantra Jaap title in English"
                      value={(cData as IConfig)?.vedMantraJaap?.title?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ved Mantra Jaap Description (English)</Label>
                    <Input
                      name="vedMantraJaap.description.en"
                      placeholder="Enter Ved Mantra Jaap description in English"
                      value={(cData as IConfig)?.vedMantraJaap?.description?.en}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Ved Mantra Jaap Title (Hindi)</Label>
                    <Input
                      name="vedMantraJaap.title.hi"
                      placeholder="Enter Ved Mantra Jaap title in Hindi"
                      value={(cData as IConfig)?.vedMantraJaap?.title?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ved Mantra Jaap Description (Hindi)</Label>
                    <Input
                      name="vedMantraJaap.description.hi"
                      placeholder="Enter Ved Mantra Jaap description in Hindi"
                      value={(cData as IConfig)?.vedMantraJaap?.description?.hi}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
};

export default Page;
