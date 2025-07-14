'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';
import {
  addEditGalleryImages,
  IGalleryImages,
  updateGalleryImagesData,
  fetchSingleGalleryImage
} from '@/redux/slices/store/gallerySlice';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function GalleryImageForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleGalleryImageState: { loading, data: bData }
  } = useAppSelector((state) => state.galleryImage);
  const [productImage, setproduct_image] = useState<File | null>(null);

  const form = useForm<IGalleryImages>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleGalleryImage(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateGalleryImagesData({
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // const requiredFields: (keyof ISliders)[] = ['title'];

    // const missingFields = requiredFields.filter(
    //   (field) => !(bData as ISliders)?.[field]
    // );

    // if (missingFields.length > 0) {
    //   const fieldLabels: { [key in keyof ISliders]?: string } = {
    //     title: 'Title'
    //   };

    //   const missingFieldLabels = missingFields.map(
    //     (field) => fieldLabels[field] || field
    //   );
    //   toast.error(
    //     `Please fill the required fields: ${missingFieldLabels.join(', ')}`
    //   );
    //   return;
    // }

    try {
      dispatch(addEditGalleryImages(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/store/others/gallery');
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
            Gallery Image Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-1">
                <Label htmlFor="name">Title</Label>
                <Input
                  name="title"
                  placeholder="Enter your Title"
                  value={(bData as IGalleryImages)?.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-3">
                <CustomTextField
                  name="sequence"
                  label="Sequence Number"
                  type="number"
                  placeholder="Enter sequence number"
                  value={(bData as IGalleryImages)?.sequence}
                  onChange={handleInputChange}
                />
                <FormItem className="space-y-3">
                  <FormLabel>Gallery Image</FormLabel>
                  <FileUploader
                    value={productImage ? [productImage] : []}
                    onValueChange={(newFiles: any) => {
                      setproduct_image(newFiles[0] || null);
                      handleInputChange({
                        target: {
                          name: 'gallery_image',
                          type: 'file',
                          files: newFiles
                        }
                      });
                    }}
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />{' '}
                  <>
                    {typeof (bData as IGalleryImages)?.gallery_image ===
                      'string' && (
                      <>
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (bData as IGalleryImages)?.gallery_image
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                </FormItem>
              </div>
            </form>
          </Form>
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
