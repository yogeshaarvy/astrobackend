'use client';
import {
  FileCard,
  FileUploader,
  FileViewCard
} from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CustomReactSelect from '@/utils/CustomReactSelect';
import {
  createOrSendMobileNotification,
  IMobileNotification,
  updateMobileNotificationData
} from '@/redux/slices/notifications/notificationSlice';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import { TCurrentEmployeePermission } from '@/types/globals';
import EmployeeNotAllwoed from '@/components/not-allowed';
import EmployeeNotAllowedToAdd from '@/components/not-allowed-add';
import { fetchAllUsers } from '@/redux/slices/allusersSlice';
import CustomDropdown from '@/utils/CusomDropdown';

// type TMobileAppNotification = {
//   empPermissions: TCurrentEmployeePermission;
// };

const MobileAppNotificationComponent = () => {
  const dispatch = useAppDispatch();
  const {
    singleMobileNotificationState: {
      loading,
      addEditLoading,
      data: nData = null
    }
  } = useAppSelector((state) => state.mobileNotifications);

  const {
    AllUsersState: {
      loading: usersList,
      data: usersData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.allusers);

  const [notificationImage, setNotificationImage] = React.useState<File | null>(
    null
  );

  const [registeredEmailQuery, setRegisteredEmailQuery] =
    React.useState<string>('');

  const debouncedRegisteredUserEmail = React.useCallback(
    debounce((query) => {
      if (query) {
        dispatch(fetchAllUsers({ field: 'name', keyword: query }));
      }
    }, 800),
    [dispatch]
  );

  const handleRegisteredUserEmail = (inputValue: any) => {
    setRegisteredEmailQuery(inputValue);
    debouncedRegisteredUserEmail(inputValue);
  };

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    const newValue =
      type === 'file'
        ? files[0]
        : type === 'checkbox'
        ? checked
        : type === 'number'
        ? Number(value)
        : value;

    const updates: Record<string, any> = {
      [name]: newValue
    };

    if (name === 'userSelectionType' && newValue === 'all') {
      updates.users = [];
    }

    dispatch(updateMobileNotificationData(updates));
  };

  const handleSubmit = () => {
    const requiredFields: (keyof IMobileNotification)[] = ['title'];

    const missingFields = requiredFields.filter(
      (field) => !(nData as IMobileNotification)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof IMobileNotification]?: string } = {
        title: 'Title'
      };

      const missingFieldLabels = missingFields.map(
        (field) => fieldLabels[field] || field
      );
      toast.error(
        `Please fill the required fields: ${missingFieldLabels.join(', ')}`
      );
      return;
    }

    try {
      dispatch(createOrSendMobileNotification(null)).then((response: any) => {
        if (!response?.error) {
          // Reset image states
          // setNotificationImage(null);
          toast.success(
            response?.payload?.message || 'Configuration saved successfully'
          );
        } else {
          toast.error(response.payload || 'Failed to save configuration');
        }
      });
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const userOptions = [
    { _id: 'all', name: 'All' },
    { _id: 'specific', name: 'Specific' }
  ];
  const platformOptions = [
    { _id: 'all', name: 'All' },
    { _id: 'onlyAndroid', name: 'Only Android' },
    { _id: 'onlyIOS', name: 'Only IOS' }
  ];

  // if (empPermissions?.permission?.view === false) {
  //   return (
  //     <EmployeeNotAllwoed
  //       cardTitle={'Access Denied'}
  //       cardDescription={'You do not have permission to view this page'}
  //       cardContent={
  //         'If you believe this is an error, please contact your administrator or support team.'
  //       }
  //     />
  //   );
  // } else {
  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Send Notification to Mobile Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <Card className="mx-auto mb-16 w-full">
                <CardContent>
                  <div className="mt-5 space-y-5">
                    <CustomTextField
                      name="title"
                      label="Title"
                      placeholder="Enter the Title for Mobile Application Notification"
                      value={(nData as IMobileNotification)?.title || ''}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="message"
                      label="Message"
                      placeholder="Enter the Message for Mobile Application Notification"
                      value={(nData as IMobileNotification)?.message || ''}
                      onChange={handleInputChange}
                    />
                    <FormItem className="space-y-3">
                      <FormLabel>Notification Image</FormLabel>
                      <FileUploader
                        value={notificationImage ? [notificationImage] : []}
                        onValueChange={(newFiles: any) => {
                          setNotificationImage(newFiles[0] || null);
                          handleInputChange({
                            target: {
                              name: 'notificationImage',
                              type: 'file',
                              files: newFiles
                            }
                          });
                        }}
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof (nData as IMobileNotification)
                        ?.notificationImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={
                              (nData as IMobileNotification)?.notificationImage
                            }
                          />
                        </div>
                      )}
                    </FormItem>
                    <CustomDropdown
                      label="Select User Seclection Type"
                      name="userSelectionType"
                      placeholder="Select User Type Specific or All"
                      value={
                        (nData as IMobileNotification)?.userSelectionType ?? ''
                      }
                      defaultValue={
                        (nData as IMobileNotification)?.userSelectionType ?? ''
                      }
                      data={userOptions}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'userSelectionType',
                            value: value.value
                          }
                        })
                      }
                    />
                    {(nData as IMobileNotification)?.userSelectionType ==
                      'specific' && (
                      <CustomReactSelect
                        className="z-100"
                        options={
                          registeredEmailQuery
                            ? Array.isArray(usersData)
                              ? usersData
                              : []
                            : []
                        }
                        isMulti
                        label="Search and Select Specific User"
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        placeholder="Search and Select Specific User"
                        onInputChange={handleRegisteredUserEmail}
                        onChange={(e: any) =>
                          handleInputChange({
                            target: {
                              name: 'users',
                              value: e
                            }
                          })
                        }
                        value={(nData as IMobileNotification)?.users ?? []}
                      />
                    )}
                    <CustomDropdown
                      label="Select the Platform"
                      name="platformSelectionType"
                      placeholder="Select the Platform Type"
                      value={
                        (nData as IMobileNotification)?.platformSelectionType ??
                        ''
                      }
                      defaultValue={
                        (nData as IMobileNotification)?.platformSelectionType ??
                        ''
                      }
                      data={platformOptions}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'platformSelectionType',
                            value: value.value
                          }
                        })
                      }
                    />

                    {/* <CustomDropdown
                             label="Select Type of Notification Feature"
                             name="feature"
                             placeholder="Select Type of Notification Feature"
                             value={
                               (nData as IMobileNotification)?.feature ?? ''
                             }
                             defaultValue={
                               (nData as IMobileNotification)?.feature ?? ''
                             }
                             data={featureOptions}
                             onChange={(value) =>
                               handleInputChange({
                                 target: {
                                   name: 'feature',
                                   value: value.value
                                 }
                               })
                             }
                           /> */}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </CardContent>
        <CardFooter
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          {/* {empPermissions.permission.edit ? (
              <> */}
          <Button
            type="submit"
            onClick={() => handleSubmit()}
            disabled={!!addEditLoading}
          >
            {addEditLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submit
              </>
            ) : (
              'Submit'
            )}
          </Button>
          {/* </>
            ) : (
              <EmployeeNotAllowedToAdd
                label={'Submit'}
                isIconVisilbe={false}
                name="Mobile Application Notification"
              />
            )} */}
        </CardFooter>
      </Card>
    </PageContainer>
  );
  // }
};

export default MobileAppNotificationComponent;
