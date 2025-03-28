'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateTaxData,
  setTaxData,
  ITax,
  addEditTax,
  fetchSingleTax
} from '@/redux/slices/taxsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

export default function TaxForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleTaxState: { loading, data: bData }
  } = useAppSelector((state) => state.taxsdata);

  const form = useForm<ITax>({
    defaultValues: {
      name: '',
      active: false
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleTax(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('name', (bData as ITax)?.name || '');
      form.setValue('rate', (bData as ITax)?.rate || '');
    }
  }, [bData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateTaxData({
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

  function onSubmit() {
    dispatch(addEditTax(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/store/taxs');
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
            Tax Information
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
                  value={(bData as ITax)?.name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="rate"
                  control={form.control}
                  label="Rate"
                  placeholder="Enter Rate"
                  value={(bData as ITax)?.rate}
                  onChange={handleInputChange}
                  type="number"
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
