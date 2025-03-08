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
  addEditSliders,
  ISliders,
  updateSlidersData,
  fetchSingleSlider
} from '@/redux/slices/slidersSlice';
import { FileUploader } from '@/components/file-uploader';

export default function SliderForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleSliderState: { loading, data: bData }
  } = useAppSelector((state) => state.slider);

  const [showButtonFields, setShowButtonFields] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const form = useForm<ISliders>({
    defaultValues: {
      sequence: 0,
      banner_image: '',
      title: '',
      description: '',
      button: false,
      button_name: '',
      button_link: ''
    }
  });

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleSlider(entityId));
    }
  }, [entityId, dispatch]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('sequence', (bData as ISliders)?.sequence || 0);
      form.setValue('banner_image', (bData as ISliders)?.banner_image || '');
      form.setValue('title', (bData as ISliders)?.title || '');
      form.setValue('button', (bData as ISliders)?.button || false);
      form.setValue('button_name', (bData as ISliders)?.button_name || '');
      form.setValue('button_link', (bData as ISliders)?.button_link || '');
    }
  }, [bData, entityId, form]);

  function onSubmit() {
    dispatch(addEditSliders(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/home/sliders');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateSlidersData({ [name]: value }) // .then(handleReduxResponse());
    );
    if (value === 'true') {
      setShowButtonFields(true);
    } else {
      setShowButtonFields(false);
    }
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
    dispatch(updateSlidersData({ [name]: file[0] }));
  };
  //  React.useEffect(() => {
  //    if (files && files?.length > 0) {
  //      dispatch(updateSlidersData({ image: files }));
  //    }
  //  }, [files]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateSlidersData({
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
            Slider Information
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
                  value={(bData as ISliders)?.sequence}
                  onChange={handleInputChange}
                />
                <FormItem className="space-y-3">
                  <FormLabel>Banner Image</FormLabel>
                  <FileUploader
                    value={files}
                    onValueChange={(file) =>
                      handleFileChange('banner_image', file)
                    }
                    accept={{ 'image/*': [] }}
                    maxSize={1024 * 1024 * 2}
                  />
                </FormItem>
                <CustomTextField
                  name="title"
                  // control={form.control}
                  label="Title"
                  placeholder="Enter Title"
                  value={(bData as ISliders)?.title}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="description"
                  // control={form.control}
                  label="Description"
                  placeholder="Enter Description"
                  value={(bData as ISliders)?.description}
                  onChange={handleInputChange}
                />
                <CustomDropdown
                  control={form.control}
                  label="Button"
                  name="button"
                  defaultValue="default"
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'False', _id: 'false' }
                  ]}
                  value={(bData as ISliders)?.button}
                  onChange={handleDropdownChange}
                />
                {showButtonFields && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <CustomTextField
                      name="button_name"
                      // control={form.control}
                      label="Button Name"
                      placeholder="Enter Button Name"
                      value={(bData as ISliders)?.button_name}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="button_link"
                      // control={form.control}
                      label="Button Link"
                      placeholder="Enter Button Link"
                      value={(bData as ISliders)?.button_link}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
