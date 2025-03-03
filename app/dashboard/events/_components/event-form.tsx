'use client';
import { FileUploader } from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditEvent,
  IEvent,
  updateEventData
} from '@/redux/slices/eventSlice';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomDateField from '@/utils/CustomDateField';
import CustomRadioSelector from '@/utils/CustomRadioSelector';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function EventForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleEventState: { loading, data: eData }
  } = useAppSelector((state) => state.event);

  const {
    eventListState: {
      loading: eventListLoading,
      data: eventData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.event);

  const [bannerFiles, setBannerFiles] = React.useState<File[]>([]);
  const [contentFiles, setContentFiles] = React.useState<File[]>([]);

  const form = useForm<IEvent>({
    defaultValues: {
      title: '',
      shortdescription: '',
      eventType: '',
      start_Date: '',
      end_Date: '',
      eventSchedule: '',
      isPaid: ''
    },
    mode: 'onBlur'
  });

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;
    dispatch(updateEventData({ [name]: value }));
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateEventData({
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
    dispatch(addEditEvent(entityId || null))
      .then((response) => {
        if (response.payload.success) {
          router.push('/dashboard/events');
          toast.success('Successfully saved.');

          // Reset the form after successful submission
          form.reset();
          setBannerFiles([]);
          setContentFiles([]);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }

  useEffect(() => {
    if (bannerFiles.length > 0) {
      dispatch(updateEventData({ image: bannerFiles }));
    }
  }, [bannerFiles]);

  useEffect(() => {
    if (contentFiles.length > 0) {
      dispatch(updateEventData({ contentImages: contentFiles }));
    }
  }, [contentFiles, dispatch]);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="title"
                  control={form.control}
                  label="Event Title"
                  placeholder="Enter your Event Name"
                  onChange={handleInputChange}
                />

                <CustomDropdown
                  control={form.control}
                  label="Event Type"
                  name="eventType"
                  placeholder="Select a Type of Event"
                  value={form.getValues('eventType')}
                  defaultValue={form.getValues('eventType') || ''}
                  loading={eventListLoading ?? false}
                  data={[
                    { name: 'Online', _id: 'online' },
                    { name: 'Offline', _id: 'offline' }
                  ]}
                  onChange={handleDropdownChange}
                />

                <CustomDropdown
                  control={form.control}
                  label="Event Schedule"
                  name="eventSchedule"
                  placeholder="Select Schedule"
                  loading={eventListLoading ?? false}
                  data={[
                    { name: 'Months', _id: 'months' },
                    { name: 'Year', _id: 'year' },
                    { name: 'Date', _id: 'date' }
                  ]}
                  onChange={handleDropdownChange}
                />

                <CustomRadioSelector
                  name="isPaid"
                  control={form.control}
                  label="Paid/Free"
                  options={[
                    { value: 'free', label: 'Free' },
                    { value: 'paid', label: 'Paid' }
                  ]}
                  onChange={handleDropdownChange}
                />

                <CustomDateField
                  label="Date"
                  name="start_Date"
                  value={(eData as IEvent)?.start_Date}
                  onChange={handleInputChange}
                  control={form.control}
                />
              </div>

              <CustomTextField
                name="shortdescription"
                control={form.control}
                label="Short Description"
                onChange={handleInputChange}
              />

              {/* Banner Image Upload */}
              <FormItem className="space-y-3">
                <FormLabel>Banner Image</FormLabel>
                <FileUploader
                  onValueChange={setBannerFiles}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2} // 2MB
                />
              </FormItem>

              {/* Content Images Upload */}
              <FormItem className="space-y-3">
                <FormLabel>Content Images</FormLabel>
                <FileUploader
                  onValueChange={setContentFiles}
                  accept={{ 'image/*': [] }}
                  multiple={true}
                  maxSize={1024 * 1024 * 2} // 2MB
                />
              </FormItem>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
