'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateValuesData,
  setValuesData,
  IValues,
  addEditValues,
  fetchSingleValues
} from '@/redux/slices/valuesSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { CustomMultiDropdown } from '@/utils/CustomMultiDropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

import { toast } from 'sonner';
import { fetchTypesList } from '@/redux/slices/typesSlice';

export default function ValuesForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleValuesState: { loading, data: vData }
  } = useAppSelector((state) => state.filtervalues);
  const {
    typesListState: {
      loading: typesListLoading,
      data: tData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.filtertypes);
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const [typesData, setTypesData] = React.useState([]);
  const form = useForm<IValues>({
    defaultValues: {
      short_name: '',
      full_name: '',
      sequence: 0,
      types: [],
      active: false
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleValues(entityId));
    }
  }, [entityId]);
  const page = 1;
  const pageSize = 100000;

  React.useEffect(() => {
    dispatch(
      fetchTypesList({
        page,
        pageSize,
        keyword: '', // Pass the search query to the API
        field: '',
        status: '',
        exportData: 'true',
        searchKeyword: ''
      })
    );
  }, []);

  // Debounced function for searching usernames
  const debouncedFetchTypes = React.useCallback(
    debounce((query) => {}, 500),
    [dispatch]
  );
  React.useEffect(() => {
    if (searchKeyword) {
      debouncedFetchTypes(searchKeyword);
    }
  }, [searchKeyword, debouncedFetchTypes, vData]);

  React.useEffect(() => {
    if (vData && entityId) {
      form.setValue('short_name', vData?.short_name || '');
      form.setValue('full_name', vData?.full_name || '');
      form.setValue('sequence', vData?.sequence || 0);
      form.setValue('types', vData?.types || []); // Set 'types' as an array
      setTypesData(vData?.types || []);
    }
  }, [vData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateValuesData({
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

  function onSubmit(data: any) {
    dispatch(updateValuesData({ ...data, types: typesData }));

    dispatch(addEditValues(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/filters/values');
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
            Values Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="short_name"
                  control={form.control}
                  label="Short Name"
                  placeholder="Enter your short name"
                  value={(vData as IValues)?.short_name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="full_name"
                  control={form.control}
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={(vData as IValues)?.full_name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="sequence"
                  control={form.control}
                  label="Sequence"
                  placeholder="Enter your sequence"
                  value={(vData as IValues)?.sequence}
                  onChange={handleInputChange}
                  type="number"
                />
                <CustomMultiDropdown
                  name="types"
                  title="Types"
                  options={tData.map((e) => ({
                    value: e._id,
                    label: e.name
                  }))}
                  value={typesData}
                  onChange={setTypesData}
                  // onSearchChange={setSearchKeyword} // Capture the search query
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
