'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateTypesData,
  setTypesData,
  ITypes,
  addEditTypes,
  fetchSingleTypes
} from '@/redux/slices/store/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';

export default function TypesForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleTypesState: { loading, data: bData }
  } = useAppSelector((state) => state.filter);

  const form = useForm<ITypes>({
    defaultValues: {
      name: {
        en: '',
        hi: ''
      },
      active: false,
      sequence: 0,
      type: '',
      searchPage: ''
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleTypes(entityId));
    }
  }, [entityId]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateTypesData({
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
    dispatch(addEditTypes(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/store/filters/types');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }
  //handle dropdon input changes
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(updateTypesData({ [name]: value }));
  };
  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Types Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="name.en"
                  label="English Name"
                  placeholder="Enter your English name"
                  value={(bData as ITypes)?.name?.en}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="name.hi"
                  label="Hindi Name"
                  placeholder="Enter your Hindi name"
                  value={(bData as ITypes)?.name?.hi}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="sequence"
                  label="Sequence"
                  placeholder="Enter your sequence"
                  value={(bData as ITypes)?.sequence}
                  onChange={handleInputChange}
                  type="number"
                />
                <CustomDropdown
                  label="Search Page"
                  name="searchPage"
                  // placeholder="Select id child"
                  defaultValue="no"
                  data={[
                    { name: 'Yes', _id: 'yes' },
                    { name: 'No', _id: 'no' }
                  ]}
                  value={(bData as ITypes)?.searchPage || ''}
                  onChange={handleDropdownChange}
                />
                <CustomDropdown
                  label="Type"
                  name="type"
                  // placeholder="Select id child"
                  defaultValue="color"
                  data={[
                    { name: 'Text', _id: 'text' },
                    { name: 'Color', _id: 'color' }
                  ]}
                  value={(bData as ITypes)?.type || ''}
                  onChange={handleDropdownChange}
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
