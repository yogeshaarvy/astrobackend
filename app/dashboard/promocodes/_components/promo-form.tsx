'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updatePromoCodeData,
  setPromoCodeData,
  IPromoCode,
  addEditPromoCode,
  fetchSinglePromoCode
} from '@/redux/slices/promocodeSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomReactSelect from '@/utils/CustomReactSelect';

export default function PromoCodeForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singlePromoCodeState: { loading, data: promoData }
  } = useAppSelector((state) => state.promoCodesdata);

  const form = useForm<IPromoCode>({
    defaultValues: {
      promocode: '',
      minamount: 0,
      maxamount: 0,
      promocodetype: '',
      promocodevalue: 0,
      upto: 0,
      status: false,
      startdate: '',
      enddate: '',
      minnooftotaluses: '',
      nooflimit1: 0,
      noofperuser: '',
      nooflimit2: 0,
      users: '',
      multipleusers: []
    }
  });
  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSinglePromoCode(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (promoData && entityId) {
      form.setValue('promocode', (promoData as IPromoCode)?.promocode || '');
      form.setValue('minamount', (promoData as IPromoCode)?.minamount || 0);
      form.setValue('maxamount', (promoData as IPromoCode)?.maxamount || 0);
      form.setValue(
        'promocodetype',
        (promoData as IPromoCode)?.promocodetype || ''
      );
      form.setValue(
        'promocodevalue',
        (promoData as IPromoCode)?.promocodevalue || 0
      );
      form.setValue('upto', (promoData as IPromoCode)?.upto || 0);
      form.setValue('status', (promoData as IPromoCode)?.status || false);
      form.setValue('startdate', (promoData as IPromoCode)?.startdate || '');
      form.setValue('enddate', (promoData as IPromoCode)?.enddate || '');
      form.setValue(
        'minnooftotaluses',
        (promoData as IPromoCode)?.minnooftotaluses || ''
      );
      form.setValue('nooflimit1', (promoData as IPromoCode)?.nooflimit1 || 0);
      form.setValue(
        'noofperuser',
        (promoData as IPromoCode)?.noofperuser || ''
      );
      form.setValue('nooflimit2', (promoData as IPromoCode)?.nooflimit2 || 0);
      form.setValue('users', (promoData as IPromoCode)?.users || '');
      form.setValue(
        'multipleusers',
        (promoData as IPromoCode)?.multipleusers || []
      );
    }
  }, [promoData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updatePromoCodeData({
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
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updatePromoCodeData({ [name]: value }) // .then(handleReduxResponse());
    );
  };
  function onSubmit() {
    dispatch(addEditPromoCode(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          router.push('/dashboard/promocodes');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }
  const promocodetypes = [
    { name: 'Fixed', _id: 'fixed' },
    { name: 'Percentage', _id: 'percentage' }
  ];

  const limitselect = [
    { name: 'Limited', _id: 'limited' },
    { name: 'Unlimited', _id: 'unlimited' }
  ];

  const limitUsers = [
    { name: 'All', _id: 'all' },
    { name: 'Selected', _id: 'selected' }
  ];
  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            PromoCode Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="promocode"
                  control={form.control}
                  label="Promocode"
                  placeholder="Enter promocode"
                  value={(promoData as IPromoCode)?.promocode}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="minamount"
                  control={form.control}
                  label="Min Amount"
                  placeholder="Enter minimum amount"
                  value={(promoData as IPromoCode)?.minamount}
                  onChange={handleInputChange}
                  type="number"
                />
                <CustomTextField
                  name="maxamount"
                  control={form.control}
                  label="Max Amount"
                  placeholder="Enter maximum amount"
                  value={(promoData as IPromoCode)?.maxamount}
                  onChange={handleInputChange}
                  type="number"
                />

                <CustomDropdown
                  control={form.control}
                  label="Promocode type "
                  name="promocodetype"
                  placeholder="Select Promocode type"
                  defaultValue="fixed"
                  data={promocodetypes}
                  value={(promoData as IPromoCode)?.promocodetype}
                  onChange={handleDropdownChange}
                />
                <CustomTextField
                  name="promocodevalue"
                  control={form.control}
                  label="Promo code value"
                  placeholder="Enter promocde value"
                  value={(promoData as IPromoCode)?.promocodevalue}
                  onChange={handleInputChange}
                  type="number"
                />
                <CustomTextField
                  name="upto"
                  control={form.control}
                  label="Upto"
                  placeholder="Enter upto amount"
                  value={(promoData as IPromoCode)?.upto}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="startdate"
                  control={form.control}
                  label="Start Date"
                  placeholder="Enter Start date"
                  value={(promoData as IPromoCode)?.startdate}
                  onChange={handleInputChange}
                  type="date"
                />
                <CustomTextField
                  name="enddate"
                  control={form.control}
                  label="End Date"
                  placeholder="Enter End Date"
                  value={(promoData as IPromoCode)?.enddate}
                  onChange={handleInputChange}
                  type="date"
                />
                <CustomDropdown
                  control={form.control}
                  label="Minimum Total Uses "
                  name="minnooftotaluses"
                  placeholder="Select Minimum Total Uses"
                  defaultValue="unlimited"
                  data={limitselect}
                  value={(promoData as IPromoCode)?.minnooftotaluses}
                  onChange={handleDropdownChange}
                />

                {promoData?.minnooftotaluses == 'limited' && (
                  <CustomTextField
                    name="nooflimit1"
                    control={form.control}
                    label="No. of limited user"
                    placeholder="Enter no. of limited user"
                    value={(promoData as IPromoCode)?.nooflimit1}
                    onChange={handleInputChange}
                    type="number"
                  />
                )}
                <CustomDropdown
                  control={form.control}
                  label="Limit of per user "
                  name="noofperuser"
                  placeholder="Select Limit of per user"
                  defaultValue="unlimited"
                  data={limitselect}
                  value={(promoData as IPromoCode)?.noofperuser}
                  onChange={handleDropdownChange}
                />

                {promoData?.noofperuser === 'limited' && (
                  <CustomTextField
                    name="nooflimit2"
                    control={form.control}
                    label="No. of uses per user"
                    placeholder="Enter No. of uses per user"
                    value={(promoData as IPromoCode)?.nooflimit2}
                    onChange={handleInputChange}
                    type="number"
                  />
                )}
                <CustomDropdown
                  control={form.control}
                  label="Allowed Users "
                  name="users"
                  placeholder="Select Allowed Users"
                  defaultValue="all"
                  data={limitUsers}
                  value={(promoData as IPromoCode)?.users}
                  onChange={handleDropdownChange}
                />

                {promoData?.users == 'selected' && (
                  <CustomReactSelect
                    label="User Name"
                    isMulti={true}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option._id}
                    placeholder="Select User"
                    onChange={(e: any) =>
                      handleInputChange({
                        target: { name: 'multipleusers', value: e }
                      })
                    }
                    value={(promoData as IPromoCode)?.multipleusers}
                  />
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
