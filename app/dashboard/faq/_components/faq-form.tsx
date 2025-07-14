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

export default function FaqForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singlefaqState: { loading, data: bData }
  } = useAppSelector((state) => state.faq);

  const [showButtonFields, setShowButtonFields] = React.useState(false);
  // const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const form = useForm<IFaq>({
    defaultValues: {
      sequence: 0,
      question: '',
      answer: '',
      status: false
    }
  });

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchsinglefaq(entityId));
    }
  }, [entityId, dispatch]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('sequence', (bData as IFaq)?.sequence || 0);
      form.setValue('question', (bData as IFaq)?.question || '');
      form.setValue('answer', (bData as IFaq)?.answer || '');
      form.setValue('status', (bData as IFaq)?.status || false);
    }
  }, [bData, entityId, form]);

  function onSubmit() {
    dispatch(addEditFaq(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/faq');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateFaqData({ [name]: value }) // .then(handleReduxResponse());
    );
    if (value === 'true') {
      setShowButtonFields(true);
    } else {
      setShowButtonFields(false);
    }
  };

  const handleFileChange = (name: string, file: File[]) => {
    // Update Redux state with the uploaded file
    dispatch(updateFaqData({ [name]: file[0] }));
  };
  //  React.useEffect(() => {
  //    if (files && files?.length > 0) {
  //      dispatch(updateSlidersData({ image: files }));
  //    }
  //  }, [files]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateFaqData({
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
            Faq Information
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
                  value={(bData as IFaq)?.sequence}
                  onChange={handleInputChange}
                />

                <CustomTextField
                  name="question"
                  control={form.control}
                  label="Question"
                  placeholder="Enter Question"
                  value={(bData as IFaq)?.question}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="answer"
                  control={form.control}
                  label="Answer"
                  placeholder="Enter Answer"
                  value={(bData as IFaq)?.answer}
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
