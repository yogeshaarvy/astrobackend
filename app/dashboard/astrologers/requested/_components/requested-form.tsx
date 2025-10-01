'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import { debounce } from 'lodash';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomReactSelect from '@/utils/CustomReactSelect';
import {
  addEditRequest,
  fetchSingleRequest,
  IRequest,
  updateRequestData
} from '@/redux/slices/astrologersSlice';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import CustomDropdown from '@/utils/CusomDropdown';
import { fetchSkillsList, ISkills } from '@/redux/slices/skillsSlice';

export default function RequestForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleRequestState: { data: requestData }
  } = useAppSelector((state) => state.astrologersData);

  const {
    SkillsList: { loading: ListLoading, data: skillsData = [] }
  } = useAppSelector((state) => state.skills);

  const form = useForm({});
  const [Image, setImage] = React.useState<File | null>(null);
  const [skillsListQuery, setSkillsListQuery] = React.useState<string>('');

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleRequest(entityId));
    }
  }, [entityId]);

  const debouncedSearchSkillList = React.useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        dispatch(
          fetchSkillsList({
            field: 'name',
            keyword: query,
            active: 'true'
          })
        );
      }
    }, 800),
    [dispatch]
  );

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target || {};

    // For array values from react-select (multi-select)
    if (Array.isArray(value)) {
      dispatch(updateRequestData({ [name]: value }));
      return;
    }

    dispatch(
      updateRequestData({
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

  const handleSubmit = () => {
    try {
      dispatch(addEditRequest(entityId || null)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/astrologers/requested');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  // Format date for input field
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  const handleInputSkills = (inputValue: string) => {
    setSkillsListQuery(inputValue);
    debouncedSearchSkillList(inputValue);
  };

  const cleanedSkillsListQuery = skillsData?.map((skill: ISkills) => skill);

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Requested Astrologer
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
                label="First Name"
                required
                placeholder="Enter your name"
                value={(requestData as IRequest)?.name || ''}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="last_name"
                label="Last Name"
                required
                placeholder="Enter your last name"
                value={(requestData as IRequest)?.last_name || ''}
                onChange={handleInputChange}
              />
              <CustomTextField
                required
                name="email"
                label="Email"
                placeholder="Enter your Email"
                value={(requestData as IRequest)?.email || ''}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="phone"
                label="Phone"
                placeholder="Enter your Phone"
                type="number"
                value={(requestData as IRequest)?.phone || ''}
                onChange={handleInputChange}
              />
              {/* <CustomReactSelect
                options={phoneTypes}
                label="Phone Type"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select phoneType"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'phoneType', value: e?._id }
                  })
                }
                value={(requestData as IRequest)?.phone || ''}
              /> */}
              <CustomDropdown
                label="Gender"
                name="gender"
                required={true}
                placeholder="Select gender"
                data={[
                  { _id: 'male', name: 'Male' },
                  { _id: 'female', name: 'Female' },
                  { _id: 'other', name: 'Other' }
                ]}
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'gender', value: e?._id }
                  })
                }
                value={(requestData as IRequest)?.gender || ''}
              />

              <CustomTextField
                name="date_of_birth"
                label="DOB"
                placeholder="Enter your DOB"
                type="date"
                value={formatDateForInput(
                  (requestData as IRequest)?.date_of_birth
                )}
                onChange={handleInputChange}
              />

              <CustomReactSelect
                options={skillsListQuery ? cleanedSkillsListQuery : []}
                label="Skills"
                isMulti
                placeholder="Select skills"
                getOptionLabel={(option) => option?.name?.en}
                getOptionValue={(option) => option._id}
                onInputChange={handleInputSkills}
                onChange={(selectedOptions: any) =>
                  handleInputChange({
                    target: {
                      name: 'skills',
                      value: selectedOptions
                    }
                  })
                }
                value={(requestData as IRequest)?.skills || []}
              />

              {/* <CustomReactSelect
                options={languageList}
                label="Languages"
                isMulti
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Languages"
                onChange={(selectedOptions: any) =>
                  handleInputChange({
                    target: {
                      name: 'languages',
                      value: selectedOptions?.map((opt: any) => opt._id) || []
                    }
                  })
                }
                value={getSelectedLanguage()}
              /> */}

              <FormItem className="space-y-3">
                <FormLabel>Astrologer Image</FormLabel>
                <FileUploader
                  value={Image ? [Image] : []}
                  onValueChange={(newFiles: any) => {
                    setImage(newFiles[0] || null);
                    handleInputChange({
                      target: {
                        name: 'image',
                        type: 'file',
                        files: newFiles
                      }
                    });
                  }}
                  accept={{ 'image/*': [] }}
                  maxSize={1024 * 1024 * 2}
                />
                {typeof (requestData as IRequest)?.image === 'string' && (
                  <div className="max-h-48 space-y-4">
                    <FileViewCard
                      existingImageURL={(requestData as IRequest)?.image}
                    />
                  </div>
                )}
              </FormItem>

              <div className="flex justify-center pt-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
