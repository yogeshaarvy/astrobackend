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
import { FileUploader } from '@/components/file-uploader';
import {
  addEditFaq,
  fetchsinglefaq,
  updateFaqData,
  IFaq
} from '@/redux/slices/faqSlice';
import {
  addEditproductFaq,
  fetchsingleproductfaq,
  IProductFaq,
  updateproductFaqData
} from '@/redux/slices/productFaqSlice';

export default function ProductFaqForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const productId = params.get('productId');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleproductfaqState: { loading, data: bData }
  } = useAppSelector((state) => state.productfaq);

  const [showButtonFields, setShowButtonFields] = React.useState(false);
  // const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const form = useForm<IProductFaq>({
    defaultValues: {
      sequence: 0,
      question: '',
      answer: '',
      status: false
    }
  });

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchsingleproductfaq(entityId));
    }
  }, [entityId, dispatch]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('sequence', (bData as IProductFaq)?.sequence || 0);
      form.setValue('question', (bData as IProductFaq)?.question || '');
      form.setValue('answer', (bData as IProductFaq)?.answer || '');
      form.setValue('status', (bData as IProductFaq)?.status || false);
    }
  }, [bData, entityId, form]);

  React.useEffect(() => {
    dispatch(
      updateproductFaqData({
        product_id: productId
      })
    );
  }, []);

  function onSubmit() {
    const entityId = params.get('id');
    dispatch(addEditproductFaq({ entityId, productId }))
      .then((response) => {
        if (response.payload.success) {
          dispatch(addEditproductFaq({ entityId, productId }));
          router.push(`/dashboard/products/faq/productFaq?id=${productId}`);
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateproductFaqData({ [name]: value }) // .then(handleReduxResponse());
    );
    if (value === 'true') {
      setShowButtonFields(true);
    } else {
      setShowButtonFields(false);
    }
  };

  const handleFileChange = (name: string, file: File[]) => {
    // Update Redux state with the uploaded file
    dispatch(updateproductFaqData({ [name]: file[0] }));
  };
  //  React.useEffect(() => {
  //    if (files && files?.length > 0) {
  //      dispatch(updateSlidersData({ image: files }));
  //    }
  //  }, [files]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateproductFaqData({
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
            Product Faq Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="sequence"
                  control={form.control}
                  label="Sequence Number"
                  placeholder="Enter sequence number"
                  value={(bData as IProductFaq)?.sequence}
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="question"
                  control={form.control}
                  label="Question"
                  placeholder="Enter Question"
                  value={(bData as IProductFaq)?.question}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="answer"
                  control={form.control}
                  label="Answer"
                  placeholder="Enter Answer"
                  value={(bData as IProductFaq)?.answer}
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
