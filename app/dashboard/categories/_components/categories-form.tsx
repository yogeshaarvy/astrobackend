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
} from '@/redux/slices/categoriesSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import {
  FileUploader,
  FileViewCard,
  FileCard
} from '@/components/file-uploader';

import { useEffect } from 'react';
import slugify from 'slugify';

import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomReactSelect from '@/utils/CustomReactSelect';
import { fetchTagList } from '@/redux/slices/tagsSlice';
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
    defaultValues: {
      name: '',
      short_description: '',
      long_description: '',
      banner_image: '',
      light_logo_image: '',
      dark_logo_image: '',
      meta_tag: '',
      active: false,
      sequence: 0,
      meta_description: '',
      meta_title: '',
      slug: '',
      child: '',
      parent: '',
      show_in_menu: false,
      show_in_home: false,
      tags: ''
    }
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
        status: '',
        exportData: 'true',
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
    if (bData && entityId) {
      // const {name, email, phone, countryCode, password, bio , role , permissionType} = bData;
      form.setValue('name', (bData as ICategory)?.name || '');
      form.setValue(
        'short_description',
        (bData as ICategory)?.short_description || ''
      );

      form.setValue(
        'long_description',
        (bData as ICategory)?.long_description || ''
      );
      form.setValue('slug', (bData as ICategory)?.slug || '');
      form.setValue('sequence', (bData as ICategory)?.sequence || 0);
      form.setValue('child', (bData as ICategory)?.child || '');
      form.setValue('parent', (bData as ICategory)?.parent || '');
      form.setValue('meta_title', (bData as ICategory)?.meta_title ?? '');
      form.setValue('tags', (bData as ICategory)?.tags ?? '');
      form.setValue(
        'meta_description',
        (bData as ICategory)?.meta_description || ''
      );
      form.setValue('meta_tag', (bData as ICategory)?.meta_tag || '');
      form.setValue(
        'light_logo_image',
        (bData as ICategory)?.light_logo_image || ''
      );
      form.setValue(
        'dark_logo_image',
        (bData as ICategory)?.dark_logo_image || ''
      );
      form.setValue('banner_image', (bData as ICategory)?.banner_image || '');
      form.setValue('show_in_menu', (bData as ICategory)?.show_in_menu);
      form.setValue('show_in_home', (bData as ICategory)?.show_in_home);
    }
  }, [bData, entityId, form]);

  React.useEffect(() => {
    const name = form.watch('name'); // Watch for changes in the 'name' field

    if (name) {
      const generatedSlug = slugify(name, {
        lower: true, // Converts to lowercase
        strict: true, // Removes special characters
        trim: true // Trims whitespace
      });

      form.setValue('slug', generatedSlug);
      dispatch(updateCategoryData({ ['slug']: generatedSlug })); // Set the generated slug value
    }
  }, [form.watch('name'), form]);

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
    const formData = form.getValues(); // Get all form values
    dispatch(
      addEditCategory(entityId || null) // Pass `entityId` to determine if it's a new or existing category
    )
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/categories');
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="name"
                  control={form.control}
                  label="Name"
                  placeholder="Enter your name"
                  value={(bData as ICategory)?.name}
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="slug"
                  control={form.control}
                  label="Slug"
                  placeholder="Enter your Slug"
                  value={form.getValues('slug')}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="sequence"
                  control={form.control}
                  label="Sequence"
                  placeholder="Enter your Sequence"
                  value={(bData as ICategory)?.sequence}
                  onChange={handleInputChange}
                  type="number"
                />

                <CustomTextField
                  name="short_description"
                  control={form.control}
                  label="Short description"
                  value={(bData as ICategory)?.short_description}
                  placeholder="Enter your short description"
                  onChange={handleInputChange}
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
                  value={form.getValues('child') || ''}
                  onChange={handleDropdownChange}
                />
                {form.getValues('child') === 'yes' && (
                  // <CustomReactSelect
                  //   options={allCategories}
                  //   label="Parent"
                  //   getOptionLabel={(option) => option.name}
                  //   getOptionValue={(option) => option._id}
                  //   placeholder="Select Parent"
                  //   onChange={(e: any) =>
                  //     handleInputChange({
                  //       target: { name: 'parent', value: e }
                  //     })
                  //   }
                  //   value={(bData as ICategory)?.parent}
                  // />
                  <CustomDropdown
                    control={form.control}
                    label="Parent"
                    name="parent"
                    // placeholder="Select id parent"
                    defaultValue="default"
                    data={allCategories.map((category) => ({
                      name: category.name,
                      _id: category._id
                    }))}
                    loading={categoryListLoading ?? false}
                    // value={form.getValues('parent') || ''}
                    value={(bData as ICategory)?.parent}
                    onChange={handleDropdownChange}
                  />
                )}
                <CustomTextField
                  name="meta_tag"
                  control={form.control}
                  label="Meta Tag"
                  placeholder="Enter your meta tag"
                  value={(bData as ICategory)?.meta_tag}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="meta_description"
                  control={form.control}
                  label="Meta Description"
                  placeholder="Enter your meta description"
                  value={(bData as ICategory)?.meta_description}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  label="Meta Title"
                  name="meta_title"
                  control={form.control}
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
              </div>
              <div className="my-4 flex items-center">
                <input
                  id="show-in-home"
                  type="checkbox"
                  checked={form.getValues('show_in_home')} // Bind to form state
                  className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600`} // Styling for disabled state
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    form.setValue('show_in_home', isChecked); // Update react-hook-form value
                    dispatch(updateCategoryData({ show_in_home: isChecked })); // Update Redux state
                  }}
                />
                <label
                  htmlFor="show-in-home"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Show In Home Section
                </label>
              </div>
              <div className="my-4 flex items-center">
                <input
                  id="show-in-menu"
                  type="checkbox"
                  checked={form.getValues('show_in_menu')} // Bind to form state
                  className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600`} // Styling for disabled state
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    form.setValue('show_in_menu', isChecked); // Update react-hook-form value
                    dispatch(updateCategoryData({ show_in_menu: isChecked })); // Update Redux state
                  }}
                />
                <label
                  htmlFor="show-in-menu"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Show In Menu Section
                </label>
              </div>
              {/* Quill Editor for Long Description */}
              <FormItem className="space-y-3">
                <FormLabel>Long Description</FormLabel>
                <FormControl>
                  <ReactQuill
                    value={form.getValues('long_description')}
                    onChange={(value) =>
                      form.setValue('long_description', value)
                    }
                    placeholder="Enter your long description"
                    modules={{
                      toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ align: [] }],
                        ['image']
                      ]
                    }}
                  />
                </FormControl>
              </FormItem>
              <div className="space-y-2 p-6 pt-0 ">
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
                    {typeof (cData as ICategory)?.banner_image === 'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as ICategory)?.banner_image
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
                    {typeof (cData as ICategory)?.light_logo_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as ICategory)?.light_logo_image
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
                    {typeof (cData as ICategory)?.dark_logo_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (cData as ICategory)?.dark_logo_image
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
