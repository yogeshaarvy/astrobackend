'use client';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import CustomTextField from '@/utils/CustomTextField';
import CustomTextEditor from '@/utils/CustomTextEditor';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import {
  addEditEventCalendarList,
  fetchEventCalendarList,
  fetchSingleEventCalendarList,
  ICalendar,
  updateEventCalendarListData,
  setEventCalendarListData
} from '@/redux/slices/calendar';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleCalendarState: { loading: eventCalendarLoading, data: wData }
  } = useAppSelector((state) => state.calendar);

  // Get loading state from the correct place
  const isLoading = useAppSelector(
    (state) => state.calendar.singleCalendarState.loading
  );

  const form = useForm();

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleEventCalendarList(entityId));
    } else {
      // Initialize empty form data for new calendar
      dispatch(
        setEventCalendarListData({
          name: '',
          startDateTime: '',
          endDateTime: '',
          content: {
            title: { en: '', hi: '' },
            shortDescription: { en: '', hi: '' }
          },
          active: true
        })
      );
    }
  }, [entityId, dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateEventCalendarListData({
        [name]:
          type === 'file'
            ? files[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  const handleSwitchChange = (checked: boolean) => {
    dispatch(
      updateEventCalendarListData({
        active: checked
      })
    );
  };

  const handleSubmit = () => {
    const requiredFields: (keyof ICalendar)[] = ['name'];

    const missingFields = requiredFields.filter(
      (field) => !(wData as ICalendar)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof ICalendar]?: string } = {
        name: 'Calendar Name'
      };

      const missingFieldLabels = missingFields.map(
        (field) => fieldLabels[field] || field
      );
      toast.error(
        `Please fill the required fields: ${missingFieldLabels.join(', ')}`
      );
      return;
    }

    // Validate date range
    if (wData?.startDateTime && wData?.endDateTime) {
      const startDate = new Date(wData.startDateTime);
      const endDate = new Date(wData.endDateTime);

      if (startDate >= endDate) {
        toast.error('End date must be after start date');
        return;
      }
    }

    try {
      dispatch(addEditEventCalendarList(entityId || null)).then(
        (response: any) => {
          if (!response?.error) {
            router.push(`/dashboard/panchang/hindu-calendar/calendar`);
            toast.success(
              response?.payload?.message || 'Calendar saved successfully'
            );
          } else {
            toast.error(response.payload || 'Something went wrong');
          }
        }
      );
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  // Show loading spinner while fetching data
  if (entityId && eventCalendarLoading) {
    return (
      <PageContainer scrollable>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading calendar data...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {entityId ? 'Edit Calendar' : 'Create Calendar'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <CustomTextField
                name="name"
                label="Calendar Name"
                required={true}
                placeholder="Enter your Calendar Name"
                value={(wData as ICalendar)?.name || ''}
                onChange={handleInputChange}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* <div className="col-span-1">
                  <CustomTextField
                    name="startDateTime"
                    label="Event Start Date & Time"
                    type="datetime-local"
                    value={
                      (wData as ICalendar)?.startDateTime
                        ? new Date((wData as ICalendar)?.startDateTime || '')
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={handleInputChange}
                  />
                </div> */}
                <div className="space-y-1">
                  <Label htmlFor="startDateTime">Start Date</Label>
                  <Input
                    name="startDateTime"
                    placeholder="Enter Start Date"
                    type="date"
                    value={
                      (wData as ICalendar)?.startDateTime
                        ? new Date((wData as ICalendar).startDateTime)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={handleInputChange}
                  />
                </div>
                {/* <div className="col-span-1">
                  <CustomTextField
                    name="endDateTime"
                    label="Event End Date & Time"
                    type="datetime-local"
                    value={
                      (wData as ICalendar)?.endDateTime
                        ? new Date((wData as ICalendar)?.endDateTime || '')
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={handleInputChange}
                  />
                </div> */}
                <div className="space-y-1">
                  <Label htmlFor="endDateTime">End Date</Label>
                  <Input
                    name="endDateTime"
                    placeholder="Enter End Date"
                    type="date"
                    value={
                      (wData as ICalendar)?.endDateTime
                        ? new Date((wData as ICalendar).endDateTime)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={(wData as ICalendar)?.active ?? true}
                  onCheckedChange={handleSwitchChange}
                />
                <FormLabel htmlFor="active">Active</FormLabel>
              </div>

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
                  <div className="space-y-4">
                    <CustomTextField
                      name="content.title.en"
                      label="Calendar Event Title (English)"
                      placeholder="Enter event title in English"
                      value={(wData as ICalendar)?.content?.title?.en || ''}
                      onChange={handleInputChange}
                    />
                    <CustomTextEditor
                      name="content.shortDescription.en"
                      label="Calendar Event Description (English)"
                      value={
                        (wData as ICalendar)?.content?.shortDescription?.en ||
                        ''
                      }
                      onChange={(value: string) =>
                        handleInputChange({
                          target: {
                            name: 'content.shortDescription.en',
                            value: value,
                            type: 'text'
                          }
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="Hindi">
                  <div className="space-y-4">
                    <CustomTextField
                      name="content.title.hi"
                      label="Calendar Event Title (Hindi)"
                      placeholder="Enter event title in Hindi"
                      value={(wData as ICalendar)?.content?.title?.hi || ''}
                      onChange={handleInputChange}
                    />
                    <CustomTextEditor
                      name="content.shortDescription.hi"
                      label="Calendar Event Description (Hindi)"
                      value={
                        (wData as ICalendar)?.content?.shortDescription?.hi ||
                        ''
                      }
                      onChange={(value: string) =>
                        handleInputChange({
                          target: {
                            name: 'content.shortDescription.hi',
                            value: value,
                            type: 'text'
                          }
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!!isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {entityId ? 'Updating...' : 'Creating...'}
              </>
            ) : entityId ? (
              'Update Calendar'
            ) : (
              'Create Calendar'
            )}
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
