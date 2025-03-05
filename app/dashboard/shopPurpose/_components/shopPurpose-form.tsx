'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';
import {
  addEditShopPurposes,
  IShopPurposes,
  updateShopPurposesData,
  fetchSingleShopPurpose
} from '@/redux/slices/shopPurposeSlice';
import { FileUploader } from '@/components/file-uploader';

export default function shopPurposeform() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleShopPurposeState: { loading, data: bData }
  } = useAppSelector((state) => state.shopPurpose);

  // const [showButtonFields, setShowButtonFields] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const form = useForm<IShopPurposes>({
    defaultValues: {
      sequence: 0,
      dividing_image: '',
      main_title: '',
      product_image: '',
      image_link: '',
      title: ''
    }
  });

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleShopPurpose(entityId));
    }
  }, [entityId, dispatch]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('sequence', (bData as IShopPurposes)?.sequence || 0);
      form.setValue(
        'dividing_image',
        (bData as IShopPurposes)?.dividing_image || ''
      );
      form.setValue('main_title', (bData as IShopPurposes)?.main_title || '');
      form.setValue(
        'product_image',
        (bData as IShopPurposes)?.product_image || ''
      );
      form.setValue('image_link', (bData as IShopPurposes)?.image_link || '');
      form.setValue('title', (bData as IShopPurposes)?.title || '');
    }
  }, [bData, entityId, form]);

  function onSubmit() {
    dispatch(addEditShopPurposes(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/shopPurpose');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateShopPurposesData({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  const handleFileChange = (name: string, file: File[]) => {
    setFiles(file);

    // Create image preview
    if (file && file.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file[0]);
    }
    // Update Redux state with the uploaded file
    dispatch(updateShopPurposesData({ [name]: file[0] }));
  };
  //  React.useEffect(() => {
  //    if (files && files?.length > 0) {
  //      dispatch(updateSlidersData({ image: files }));
  //    }
  //  }, [files]);

  console.log('The formData value is:', bData as IShopPurposes);
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateShopPurposesData({
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

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Shop Purpose Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <CustomTextField
                  name="main_title"
                  control={form.control}
                  label="Main Title"
                  placeholder="Enter Main Title"
                  value={(bData as IShopPurposes)?.main_title}
                  onChange={handleInputChange}
                />

                <FormItem className="space-y-3">
                  <FormLabel>Product Image</FormLabel>
                  <FileUploader
                    value={files}
                    onValueChange={(file) =>
                      handleFileChange('product_image', files)
                    }
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                </FormItem>

                <CustomTextField
                  name="image_link"
                  control={form.control}
                  label="Image Link"
                  placeholder="Enter Image Link"
                  value={(bData as IShopPurposes)?.image_link}
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="title"
                  control={form.control}
                  label="Title"
                  placeholder="Enter Title"
                  value={(bData as IShopPurposes)?.title}
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="sequence"
                  control={form.control}
                  label="Sequence Number"
                  placeholder="Enter sequence number"
                  value={(bData as IShopPurposes)?.sequence}
                  onChange={handleInputChange}
                />
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
