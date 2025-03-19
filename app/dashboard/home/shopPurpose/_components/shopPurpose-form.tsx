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
import { FileUploader, FileViewCard } from '@/components/file-uploader';

export default function ShopPurposeForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleShopPurposeState: { loading, data: bData }
  } = useAppSelector((state) => state.shopPurpose);

  // const [showButtonFields, setShowButtonFields] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [product_image, setproduct_image] = React.useState<File | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const form = useForm<IShopPurposes>({
    defaultValues: {
      sequence: 0,
      product_image: '',
      title: '',
      image_link: ''
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
        'product_image',
        (bData as IShopPurposes)?.product_image || ''
      );
      form.setValue('title', (bData as IShopPurposes)?.title || '');
      form.setValue('image_link', (bData as IShopPurposes)?.image_link || '');
    }
  }, [bData, entityId, form]);

  function onSubmit() {
    dispatch(addEditShopPurposes(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/home/shopPurpose');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

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
  //      dispatch(updateShopPurposesData({ image: files }));
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
                  name="sequence"
                  // control={form.control}
                  label="Sequence Number"
                  placeholder="Enter sequence number"
                  value={(bData as IShopPurposes)?.sequence}
                  onChange={handleInputChange}
                />
                <FormItem className="space-y-3">
                  <FormLabel>Product Image</FormLabel>
                  <FileUploader
                    value={product_image ? [product_image] : []}
                    onValueChange={(newFiles: any) => {
                      setproduct_image(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'product_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />{' '}
                  <>
                    {typeof (bData as IShopPurposes)?.product_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (bData as IShopPurposes)?.product_image
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                </FormItem>
                <CustomTextField
                  name="title"
                  // control={form.control}
                  label="Title"
                  placeholder="Enter Title"
                  value={(bData as IShopPurposes)?.title}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="image_link"
                  // control={form.control}
                  label="Image Link"
                  placeholder="Enter Image Link"
                  value={(bData as IShopPurposes)?.image_link}
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
