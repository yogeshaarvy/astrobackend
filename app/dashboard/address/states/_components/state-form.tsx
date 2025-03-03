'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateStateData,
  setStateData,
  IState,
  addEditState,
  fetchSingleState
} from '@/redux/slices/statesSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

export default function StateForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleStateState: { loading, data: bData }
  } = useAppSelector((state) => state.statesdata);

  const form = useForm<IState>({
    defaultValues: {
      name: '',
      active: false
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleState(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('name', (bData as IState)?.name || '');
    }
  }, [bData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateStateData({
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
    dispatch(addEditState(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/address/states');
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
            State Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="id"
                  control={form.control}
                  label="ID"
                  placeholder="Enter ID"
                  value={(bData as IState)?.id}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="name"
                  control={form.control}
                  label="Name"
                  placeholder="Enter your name"
                  value={(bData as IState)?.name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="iso2"
                  control={form.control}
                  label="Ios2"
                  placeholder="IOS2"
                  value={(bData as IState)?.iso2}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="country_id"
                  control={form.control}
                  label="Country id"
                  placeholder="country id"
                  value={(bData as IState)?.country_id}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="country_code"
                  control={form.control}
                  label="Country Code"
                  placeholder="Country code"
                  value={(bData as IState)?.country_code}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="fips_code"
                  control={form.control}
                  label="Fips Code"
                  placeholder="Fips Code"
                  value={(bData as IState)?.fips_code}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="flag"
                  control={form.control}
                  label="Flag"
                  placeholder="Flag"
                  value={(bData as IState)?.flag}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="wikiDataId"
                  control={form.control}
                  label="WikiData"
                  placeholder="wikiData"
                  value={(bData as IState)?.wikiDataId}
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
