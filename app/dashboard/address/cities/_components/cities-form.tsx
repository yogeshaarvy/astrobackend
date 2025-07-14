'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateCitiesData,
  setCitiesData,
  ICities,
  addEditCities,
  fetchSingleCities
} from '@/redux/slices/citiesSlice';
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
    singleCitiesState: { loading, data: bData }
  } = useAppSelector((state) => state.Citiesdata);

  const form = useForm<ICities>({
    defaultValues: {
      name: '',
      active: false
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleCities(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('name', (bData as ICities)?.name || '');
    }
  }, [bData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateCitiesData({
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
    dispatch(addEditCities(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/address/cities');
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
            City Information
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
                  value={(bData as ICities)?.id}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="name"
                  control={form.control}
                  label="Name"
                  placeholder="Enter your name"
                  value={(bData as ICities)?.name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="state_id"
                  control={form.control}
                  label="State ID"
                  placeholder="Enter State ID"
                  value={(bData as ICities)?.state_id}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="state_code"
                  control={form.control}
                  label="State Code"
                  placeholder="Enter your name"
                  value={(bData as ICities)?.state_code}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="country_code"
                  control={form.control}
                  label="country Code"
                  placeholder="Enter Country code"
                  value={(bData as ICities)?.country_code}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="country_id"
                  control={form.control}
                  label="country ID"
                  placeholder="Enter Country ID"
                  value={(bData as ICities)?.country_id}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="longitude"
                  control={form.control}
                  label="Longitude"
                  placeholder="Longitude"
                  value={(bData as ICities)?.longitude}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="latitude"
                  control={form.control}
                  label="latitude"
                  placeholder="Latitude"
                  value={(bData as ICities)?.latitude}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="flag"
                  control={form.control}
                  label="Flag"
                  placeholder="Flag"
                  value={(bData as ICities)?.flag}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="wikiDataId"
                  control={form.control}
                  label="Wiki Data"
                  placeholder="Wikidata"
                  value={(bData as ICities)?.wikiDataId}
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
