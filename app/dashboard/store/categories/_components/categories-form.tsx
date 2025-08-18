'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateCategoryData,
  setCategoryData,
  ICategory,
  addEditCategory,
  fetchSingleCategory,
  fetchCategoryList
} from '@/redux/slices/store/categoriesSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import {
  FileUploader,
  FileViewCard,
  FileCard
} from '@/components/file-uploader';

import { useEffect } from 'react';
import slugify from 'slugify';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomReactSelect from '@/utils/CustomReactSelect';
import { fetchTagList } from '@/redux/slices/store/tagsSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTextEditor from '@/utils/CustomTextEditor';
import { Switch } from '@/components/ui/switch';
export default function CategoryForm() {
  const params = useSearchParams();
  const entityId = params?.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleCategoryState: { loading: categoryLoading, data: bData }
  } = useAppSelector((state) => state.category);
  const {
    tagListState: { loading: tagListLoading, data: tagData = [] }
  } = useAppSelector((state) => state.tags);
  const {
    categoryListState: {
      loading: categoryListLoading,
      data: cData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.category);
  const [lightlogoImage, setLightLogo] = React.useState<File | null>(null);
  const [darklogoImage, setDarkLogo] = React.useState<File | null>(null);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const allCategories: ICategory[] = cData;

  const [files, setFiles] = React.useState<File[]>([]);
  const form = useForm<ICategory>({
    defaultValues: {}
  });
  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleCategory(entityId));
    }
  }, [entityId]);
  const page = 1;
  const pageSize = 100000;
  useEffect(() => {
    dispatch(
      fetchCategoryList({
        page,
        pageSize,
        keyword: '',
        field: '',
        active: '',
        exportData: true,
        entityId: entityId || ''
      })
    );
    dispatch(
      fetchTagList({
        page,
        pageSize,
        keyword: '',
        field: '',
        status: '',
        exportData: 'true'
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!entityId) {
      const name = (bData as ICategory)?.title?.en;
      if (name) {
        const generatedSlug = slugify(name, {
          lower: true,
          strict: true,
          trim: true
        });
        dispatch(updateCategoryData({ ['slug']: generatedSlug }));
      }
    }
  }, [(bData as ICategory)?.title?.en, entityId]);

  //handle dropdon input changes
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateCategoryData({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateCategoryData({
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

  // Handle file changes for logo and banner images
  const handleFileChange = (name: string, file: File[]) => {
    // Update Redux state with the uploaded file
    dispatch(updateCategoryData({ [name]: file[0] }));

    // Update the form with the uploaded file value (could be a file URL or base64 string)
    const fileUrl = URL.createObjectURL(file[0]);
    form.setValue(name as keyof ICategory, fileUrl);
  };

  useEffect(() => {
    if (files && files?.length > 0) {
      dispatch(updateCategoryData({ image: files }));
    }
  }, [files]);

  function onSubmit() {
    dispatch(addEditCategory(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/store/categories');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error(`Error: ${err}`));
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Category Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}

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
                  <CardHeader className="!px-0">
                    <CardTitle className="text-lg font-bold ">
                      ENGLISH-CATEGORIES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="title.en"
                      // control={form.control}
                      label="Title"
                      placeholder="Enter your name"
                      value={(bData as ICategory)?.title?.en}
                      onChange={handleInputChange}
                    />

                    <CustomTextField
                      name="short_description.en"
                      // control={form.control}
                      label="Short description"
                      value={(bData as ICategory)?.short_description?.en}
                      placeholder="Enter your short description"
                      onChange={handleInputChange}
                    />

                    <CustomTextEditor
                      name="long_description.en"
                      label="Full Description"
                      value={(bData as ICategory)?.long_description?.en}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'long_description.en',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="Hindi">
                  <CardHeader className="!px-0">
                    <CardTitle className="text-lg font-bold ">
                      HINDI-CATEGORIES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="title.hi"
                      // control={form.control}
                      label="Title"
                      placeholder="Enter your name"
                      value={(bData as ICategory)?.title?.hi}
                      onChange={handleInputChange}
                    />

                    <CustomTextField
                      name="short_description.hi"
                      // control={form.control}
                      label="Short description"
                      value={(bData as ICategory)?.short_description?.hi}
                      placeholder="Enter your short description"
                      onChange={handleInputChange}
                    />

                    <CustomTextEditor
                      name="long_description.hi"
                      label="Full Description"
                      value={(bData as ICategory)?.long_description?.hi}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'long_description.hi',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                  </CardContent>
                </TabsContent>
              </Tabs>
              <CustomTextField
                name="slug"
                label="Slug"
                placeholder="Enter your Slug"
                value={(bData as ICategory)?.slug}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="sequence"
                // control={form.control}
                label="Sequence"
                placeholder="Enter your Sequence"
                value={(bData as ICategory)?.sequence}
                onChange={handleInputChange}
                type="number"
              />

              <CustomDropdown
                control={form.control}
                label="Is Child"
                name="child"
                // placeholder="Select id child"
                defaultValue="default"
                data={[
                  { name: 'Yes', _id: 'yes' },
                  { name: 'No', _id: 'no' }
                ]}
                value={(bData as ICategory)?.child || 'no'}
                onChange={handleDropdownChange}
              />
              {(bData as ICategory)?.child === 'yes' && (
                <CustomDropdown
                  control={form.control}
                  label="Parent"
                  name="parent"
                  // placeholder="Select id parent"
                  defaultValue="default"
                  data={allCategories.map((category) => ({
                    title: category?.title?.en,
                    _id: category._id
                  }))}
                  loading={categoryListLoading ?? false}
                  value={(bData as ICategory)?.parent}
                  onChange={handleDropdownChange}
                />
              )}
              <CustomTextField
                name="meta_tag"
                label="Meta Tag"
                placeholder="Enter your meta tag"
                value={(bData as ICategory)?.meta_tag}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="meta_description"
                label="Meta Description"
                placeholder="Enter your meta description"
                value={(bData as ICategory)?.meta_description}
                onChange={handleInputChange}
              />
              <CustomTextField
                label="Meta Title"
                name="meta_title"
                placeholder="Enter meta title"
                onChange={handleInputChange}
                value={(bData as ICategory)?.meta_title}
              />
              <CustomReactSelect
                options={tagData}
                label="Tags"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Tags"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'tags', value: e }
                  })
                }
                value={(bData as ICategory)?.tags}
              />
              {/* </div> */}
              <div className="flex items-center gap-3">
                <FormLabel>Show In Home </FormLabel>
                <Switch
                  className="!m-0"
                  checked={(bData as ICategory)?.show_in_home}
                  // onCheckedChange={handleToggle}
                  onCheckedChange={(checked: any) =>
                    handleInputChange({
                      target: {
                        type: 'checkbox',
                        name: 'show_in_home',
                        checked
                      }
                    })
                  }
                  aria-label="Toggle Active Status"
                />
              </div>
              <div className="flex items-center gap-3">
                <FormLabel>Show In Menu</FormLabel>
                <Switch
                  className="!m-0"
                  checked={(bData as ICategory)?.show_in_menu}
                  // onCheckedChange={handleToggle}
                  onCheckedChange={(checked: any) =>
                    handleInputChange({
                      target: {
                        type: 'checkbox',
                        name: 'show_in_menu',
                        checked
                      }
                    })
                  }
                  aria-label="Toggle Active Status"
                />
              </div>

              <div className="space-y-2 pt-0 ">
                <FormItem className="space-y-3">
                  <FormLabel> Banner Image</FormLabel>
                  <FileUploader
                    value={bannerImage ? [bannerImage] : []}
                    onValueChange={(newFiles: any) => {
                      setBannerImage(newFiles[0] || null);
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
                  />{' '}
                  <>
                    {typeof (bData as ICategory)?.banner_image === 'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (bData as ICategory)?.banner_image
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                </FormItem>
                <FormItem className="space-y-3">
                  <FormLabel> Light Logo Image</FormLabel>
                  <FileUploader
                    value={lightlogoImage ? [lightlogoImage] : []}
                    onValueChange={(newFiles: any) => {
                      setLightLogo(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'light_logo_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />{' '}
                  <>
                    {typeof (bData as ICategory)?.light_logo_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (bData as ICategory)?.light_logo_image
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                </FormItem>
                <FormItem className="space-y-3">
                  <FormLabel> Dark Logo Image</FormLabel>
                  <FileUploader
                    value={darklogoImage ? [darklogoImage] : []}
                    onValueChange={(newFiles: any) => {
                      setDarkLogo(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'dark_logo_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />{' '}
                  <>
                    {typeof (bData as ICategory)?.dark_logo_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (bData as ICategory)?.dark_logo_image
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                </FormItem>
              </div>
              {/* <FormItem className="space-y-3">
                <FormLabel>Light Logo Image</FormLabel>
                <FileUploader
                  value={files}
                  onValueChange={(file) =>
                    handleFileChange('light_logo_image', file)
                  }
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />
              </FormItem> */}
              {/* <FormItem className="space-y-3">
                <FormLabel>Dark Logo Image</FormLabel>
                <FileUploader
                  value={files}
                  onValueChange={(file) =>
                    handleFileChange('dark_logo_image', file)
                  }
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />
              </FormItem> */}
              {/* <FormItem className="space-y-3">
                <FormLabel>Banner Image</FormLabel>
                <FileUploader
                  value={files}
                  onValueChange={(file) =>
                    handleFileChange('banner_image', file)
                  }
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />
              </FormItem> */}

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
