'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateBrandData,
  setBrandData,
  IBrand,
  addEditBrand,
  fetchSingleBrand
} from '@/redux/slices/brandSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { FileUploader, FileViewCard } from '@/components/file-uploader';

import { useEffect } from 'react';
import slugify from 'slugify';

import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

export default function BrandForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleBrandState: { loading, data: bData }
  } = useAppSelector((state) => state.brand);
  const [files, setFiles] = React.useState<File[]>([]);
  const [logoImage, setLogoImage] = React.useState<File | null>(null);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);

  const form = useForm<IBrand>({
    defaultValues: {
      name: '',
      short_description: '',
      long_description: '',
      banner_image: '',
      logo_image: '',
      meta_tag: '',
      active: false,
      sequence: 0,
      meta_description: '',
      meta_title: ''
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleBrand(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (bData && entityId) {
      // const {name, email, phone, countryCode, password, bio , role , permissionType} = bData;
      form.setValue('name', (bData as IBrand)?.name || '');
      form.setValue(
        'short_description',
        (bData as IBrand)?.short_description || ''
      );

      form.setValue(
        'long_description',
        (bData as IBrand)?.long_description || ''
      );
      form.setValue('sequence', (bData as IBrand)?.sequence || 0);
      form.setValue('meta_title', (bData as IBrand)?.meta_title ?? '');
      form.setValue(
        'meta_description',
        (bData as IBrand)?.meta_description || ''
      );
      form.setValue('meta_tag', (bData as IBrand)?.meta_tag || '');
      form.setValue('logo_image', (bData as IBrand)?.logo_image || '');
      form.setValue('banner_image', (bData as IBrand)?.banner_image || '');
    }
  }, [bData, entityId, form]);

  // React.useEffect(() => {
  //   const name = form.watch('name'); // Watch for changes in the 'name' field

  //   if (name) {
  //     const generatedSlug = slugify(name, {
  //       lower: true, // Converts to lowercase
  //       strict: true, // Removes special characters
  //       trim: true // Trims whitespace
  //     });

  //     form.setValue('slug', generatedSlug);
  //     dispatch(updateBrandData({ ['slug']: generatedSlug })); // Set the generated slug value
  //   }
  // }, [form.watch('name'), form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateBrandData({
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
    dispatch(updateBrandData({ [name]: file[0] }));

    // Update the form with the uploaded file value (could be a file URL or base64 string)
    const fileUrl = URL.createObjectURL(file[0]);
    form.setValue(name as keyof IBrand, fileUrl);
  };
  useEffect(() => {
    if (files && files?.length > 0) {
      dispatch(updateBrandData({ image: files }));
    }
  }, [files]);

  function onSubmit() {
    dispatch(addEditBrand(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/store/brands');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Brand Information
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
                  value={(bData as IBrand)?.name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="sequence"
                  control={form.control}
                  label="Sequence"
                  placeholder="Enter your Sequence"
                  value={(bData as IBrand)?.sequence}
                  onChange={handleInputChange}
                  type="number"
                />

                <CustomTextField
                  name="short_description"
                  control={form.control}
                  label="Short description"
                  value={(bData as IBrand)?.short_description}
                  placeholder="Enter your short description"
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="meta_tag"
                  control={form.control}
                  label="Meta Tag"
                  placeholder="Enter your meta tag"
                  value={(bData as IBrand)?.meta_tag}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="meta_description"
                  control={form.control}
                  label="Meta Description"
                  placeholder="Enter your meta description"
                  value={(bData as IBrand)?.meta_description}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  label="Meta Title"
                  name="meta_title"
                  control={form.control}
                  placeholder="Enter meta title"
                  onChange={handleInputChange}
                  value={(bData as IBrand)?.meta_title}
                />
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

              <FormItem className="space-y-3">
                <FormLabel>Dark Logo</FormLabel>
                <FileUploader
                  value={logoImage ? [logoImage] : []}
                  onValueChange={(newFiles: any) => {
                    setLogoImage(newFiles[0] || null);
                    handleInputChange({
                      target: {
                        name: 'logo_image',
                        type: 'file',
                        files: newFiles
                      }
                    });
                  }}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />{' '}
                <>
                  {typeof (bData as IBrand)?.logo_image === 'string' && (
                    <>
                      <div className="max-h-48 space-y-4">
                        <FileViewCard
                          existingImageURL={(bData as IBrand)?.logo_image}
                        />
                      </div>
                    </>
                  )}
                </>
              </FormItem>
              <FormItem className="space-y-3">
                <FormLabel>Dark Logo</FormLabel>
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
                  {typeof (bData as IBrand)?.banner_image === 'string' && (
                    <>
                      <div className="max-h-48 space-y-4">
                        <FileViewCard
                          existingImageURL={(bData as IBrand)?.banner_image}
                        />
                      </div>
                    </>
                  )}
                </>
              </FormItem>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
