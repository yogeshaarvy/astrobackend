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
import CustomTextEditor from '@/utils/CustomTextEditor';
import {
  addEditHomeBannerList,
  fetchSingleHomeBannerList,
  IHomeBanner,
  updateHomeBannerListData
} from '@/redux/slices/home/banner';
import { Checkbox } from '@/components/ui/checkbox';
import slugify from 'slugify';
import CustomDropdown from '@/utils/CusomDropdown';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleHomeBannerState: { data: jData }
  } = useAppSelector((state) => state.homeBanner);
  const [thumbnailImage, setThumbnailImage] = React.useState<File | null>(null);

  const form = useForm({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleHomeBannerList(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateHomeBannerListData({
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
    const requiredFields: (keyof IHomeBanner)[] = ['title'];

    const missingFields = requiredFields.filter(
      (field) => !(jData as IHomeBanner)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof IHomeBanner]?: string } = {
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
      dispatch(addEditHomeBannerList(entityId || '')).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/homes/banner');
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
            Home Banner List
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
                  <Label htmlFor="name">Sequence</Label>
                  <Input
                    name="sequence"
                    placeholder="Enter Sequence"
                    type="number"
                    value={(jData as IHomeBanner)?.sequence || ''}
                    onChange={handleInputChange}
                  />
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
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="title.en"
                            placeholder="Enter your Title"
                            value={(jData as IHomeBanner)?.title?.en || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="description.en"
                            placeholder="Enter your Short Description"
                            value={
                              (jData as IHomeBanner)?.description?.en || ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                    </>
                  </TabsContent>

                  <TabsContent value="Hindi">
                    <>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Title</Label>
                          <Input
                            name="title.hi"
                            placeholder="Enter your Title"
                            value={(jData as IHomeBanner)?.title?.hi || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name">Short Description</Label>
                          <Input
                            name="description.hi"
                            placeholder="Enter your Short Description"
                            value={
                              (jData as IHomeBanner)?.description?.hi || ''
                            }
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                    </>
                  </TabsContent>
                </Tabs>

                <CustomDropdown
                  label="Read Type"
                  name="readStatus"
                  placeholder="Select Content Type"
                  value={(jData as IHomeBanner)?.readStatus ?? false} // Ensure value is always boolean
                  defaultValue={false}
                  data={[
                    { _id: true, name: 'True' },
                    { _id: false, name: 'False' }
                  ]}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: 'readStatus',
                        value: value.value // Already boolean
                      }
                    })
                  }
                />

                {(jData as IHomeBanner)?.readStatus && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <CustomTextField
                      name="readTitle.en"
                      label="English Button Name"
                      placeholder="Enter English Button Name"
                      value={(jData as IHomeBanner)?.readTitle?.en}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="readTitle.hi"
                      label="Hindi Button Name"
                      placeholder="Enter Hindi Button Name"
                      value={(jData as IHomeBanner)?.readTitle?.hi}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="readLinks"
                      label="Button Link"
                      placeholder="Enter Button Link"
                      value={(jData as IHomeBanner)?.readLinks}
                      onChange={handleInputChange}
                    />
                  </div>
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
