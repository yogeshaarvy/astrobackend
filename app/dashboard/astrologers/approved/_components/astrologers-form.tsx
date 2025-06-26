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

export default function RequestForm() {
  const languageList = [
    { name: 'Hindi', _id: 'hindi' },
    { name: 'English', _id: 'english' }
  ];
  const educationsList = [
    { name: 'Primary School', _id: 'primary_school' },
    { name: 'Middle School', _id: 'middle_school' },
    { name: 'High School / Secondary', _id: 'high_school' },
    { name: 'Higher Secondary / Intermediate / 12th', _id: 'higher_secondary' },
    { name: 'Diploma', _id: 'diploma' },
    { name: 'Bachelor’s Degree', _id: 'bachelor' },
    { name: 'Master’s Degree', _id: 'master' },
    { name: 'M.Phil', _id: 'mphil' },
    { name: 'Ph.D.', _id: 'phd' },
    { name: 'Postdoctoral', _id: 'postdoc' },
    { name: 'Other', _id: 'other' }
  ];

  const gendersList = [
    { name: 'Female', _id: 'female' },
    { name: 'Male', _id: 'male' },
    { name: 'Other', _id: 'other' }
  ];
  const skillsList = [
    { name: 'Tarot Reading', _id: 'tarot' },
    { name: 'Astrology', _id: 'astrology' },
    { name: 'Numerology', _id: 'numerology' }
  ];

  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleRequestState: { data: requestData }
  } = useAppSelector((state) => state.astrologersData);

  const form = useForm({});
  const [Image, setImage] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleRequest(entityId));
    }
  }, [entityId]);

  const getSelectedSkill = () => {
    const skillValues = (requestData as IRequest)?.skills || [];
    return skillsList.filter((skill) => skillValues.includes(skill._id));
  };

  const getSelectedLanguage = () => {
    const languageValues = (requestData as IRequest)?.languages || [];
    return languageList.filter((lang) => languageValues.includes(lang._id));
  };
  const getSelectedEducation = () => {
    const educationValues = (requestData as IRequest)?.education || [];
    return educationsList.filter((ed) => educationValues.includes(ed._id));
  };

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
          router.push('/dashboard/astrologers/approved');
          toast.success(response?.payload?.message);
        } else {
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  // Helper functions to find selected options

  const getSelectedGender = () => {
    const genderValue = (requestData as IRequest)?.gender;
    return gendersList.find((gender) => gender._id === genderValue) || null;
  };

  // Format date for input field
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Astrologer
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
                label="Name"
                required
                placeholder="Enter your name"
                value={(requestData as IRequest)?.name || ''}
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
              <CustomReactSelect
                options={gendersList}
                label="Gender"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select gender"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'gender', value: e?._id }
                  })
                }
                value={getSelectedGender()}
              />

              <CustomTextField
                name="dob"
                label="DOB"
                placeholder="Enter your DOB"
                type="date"
                value={formatDateForInput((requestData as IRequest)?.dob)}
                onChange={handleInputChange}
              />

              <CustomReactSelect
                options={skillsList}
                label="Skills"
                isMulti
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select skills"
                onChange={(selectedOptions: any) =>
                  handleInputChange({
                    target: {
                      name: 'skills',
                      value: selectedOptions?.map((opt: any) => opt._id) || []
                    }
                  })
                }
                value={getSelectedSkill()}
              />

              <CustomReactSelect
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
              />
              <CustomTextField
                name="expierience"
                label="Expierience In Years"
                placeholder="Enter your expierience"
                type="number"
                value={(requestData as IRequest)?.expierience || 0}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="charges"
                label="Charges In Rupees"
                placeholder="Enter your charges"
                type="number"
                value={(requestData as IRequest)?.charges || 0}
                onChange={handleInputChange}
              />
              <CustomReactSelect
                options={educationsList}
                label="Education"
                // isMulti
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Education"
                onChange={(selectedOptions: any) =>
                  handleInputChange({
                    target: {
                      name: 'education',
                      value: selectedOptions?.map((opt: any) => opt._id) || []
                    }
                  })
                }
                value={getSelectedEducation()}
              />

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
