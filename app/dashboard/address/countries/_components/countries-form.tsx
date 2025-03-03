'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateCountriesData,
  setTypesData,
  ICountries,
  addEditCountries
  // fetchSingleTypes
} from '@/redux/slices/countriesSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';

export default function CountriesForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleCountriesState: { loading, data: bData }
  } = useAppSelector((state) => state.countries);

  const form = useForm<ICountries>({
    defaultValues: {
      name: '',
      iso3: '',
      iso2: '',
      phonecode: '',
      capital: ''
    }
  });
  React.useEffect(() => {
    if (entityId) {
      // dispatch(fetchSingleTypes(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (bData && entityId) {
      form.setValue('name', (bData as ICountries)?.name || '');
      form.setValue('iso3', (bData as ICountries)?.iso3 || '');
      form.setValue('iso2', (bData as ICountries)?.iso2 || '');
      form.setValue('phonecode', (bData as ICountries)?.phonecode || '');
      form.setValue('capital', (bData as ICountries)?.capital || '');
    }
  }, [bData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateCountriesData({
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
    dispatch(addEditCountries(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/address/countries');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }
  //handle dropdon input changes
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(updateCountriesData({ [name]: value }));
  };
  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Countries Information
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
                  value={(bData as ICountries)?.name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="iso3"
                  control={form.control}
                  label="ISO3"
                  placeholder="Enter ISO3"
                  value={(bData as ICountries)?.iso3}
                  onChange={handleInputChange}
                  // type="number"
                />
                <CustomTextField
                  name="iso2"
                  control={form.control}
                  label="ISO2"
                  placeholder="Enter ISO 2"
                  value={(bData as ICountries)?.iso2}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="phonecode"
                  control={form.control}
                  label="Phone Code"
                  placeholder="Enter Phone Code"
                  value={(bData as ICountries)?.phonecode}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="capital"
                  control={form.control}
                  label="Capital"
                  placeholder="Enter Capital"
                  value={(bData as ICountries)?.capital}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="currency"
                  control={form.control}
                  label="Currency"
                  placeholder="Enter Currency"
                  value={(bData as ICountries)?.currency}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="native"
                  control={form.control}
                  label="Native"
                  placeholder="Enter Native"
                  value={(bData as ICountries)?.native}
                  onChange={handleInputChange}
                />
                {/* <CustomDropdown
                  control={form.control}
                  label="Search Page"
                  name="iso2"
                  // placeholder="Select id child"
                  defaultValue="default"
                  data={[
                    { name: 'Yes', _id: 'yes' },
                    { name: 'No', _id: 'no' }
                  ]}
                  value={form.getValues('searchpage') || ''}
                  onChange={handleDropdownChange}
                /> */}
                {/* <CustomDropdown
                  control={form.control}
                  label="Type"
                  name="type"
                  // placeholder="Select id child"
                  defaultValue="default"
                  data={[
                    { name: 'Text', _id: 'text' },
                    { name: 'Coluor', _id: 'color' }
                  ]}
                  value={form.getValues('type') || ''}
                  onChange={handleDropdownChange}
                /> */}
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
