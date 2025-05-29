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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      name: {
        en: '',
        hi: ''
      },
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
      form.setValue('name.en', (bData as ITax)?.name?.en || '');
      form.setValue('name.hi', (bData as ITax)?.name?.hi || '');
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
                  {/* <CardHeader className="!px-0">
                      <CardTitle className="text-lg font-bold ">
                        ENGLISH
                      </CardTitle>
                    </CardHeader> */}
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="name.en"
                      control={form.control}
                      label="Name (English)"
                      placeholder="Enter your name"
                      value={(bData as ITax)?.name?.en}
                      onChange={handleInputChange}
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="Hindi">
                  {/* <CardHeader className="!px-0">
                      <CardTitle className="text-lg font-bold ">
                        HINDI
                      </CardTitle>
                    </CardHeader> */}
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="name.hi"
                      control={form.control}
                      label="Name"
                      placeholder="Enter your name"
                      value={(bData as ITax)?.name?.hi}
                      onChange={handleInputChange}
                    />
                  </CardContent>
                </TabsContent>
              </Tabs>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
