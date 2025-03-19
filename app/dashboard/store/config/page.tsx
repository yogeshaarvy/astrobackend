'use client';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditStoreconfigPage,
  fetchStoreconfig,
  IStoreconfig,
  setStoreconfig,
  updateStoreconfig
} from '@/redux/slices/store/storeconfigSlice';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import CustomTextField from '@/utils/CustomTextField';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    storeconfigState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.storeconfigs);

  useEffect(() => {
    dispatch(fetchStoreconfig(null));
  }, []);

  const form = useForm({
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      metaKeyword: ''
    }
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateStoreconfig({
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
    if (!cData) {
      toast.error('Please fill in the required fields.');
      return;
    }

    dispatch(addEditStoreconfigPage(null)).then((response: any) => {
      if (!response?.error) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(response.payload);
      }
    });
  };

  return (
    <PageContainer scrollable>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <Card className="mx-auto mb-16 w-full">
              <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                  Store Config List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}

                    <CustomTextField
                      name="metaTitle"
                      // control={form.control}
                      label="Meta Title"
                      placeholder="Enter your Meta Title"
                      value={(cData as IStoreconfig)?.metaTitle}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="metaDescription"
                      // control={form.control}
                      label="Meta Description"
                      placeholder="Enter your Meta Description"
                      value={(cData as IStoreconfig)?.metaDescription}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="metaKeywords"
                      // control={form.control}
                      label="Meta keywords"
                      placeholder="Enter your Meta Keywords"
                      value={(cData as IStoreconfig)?.metaKeyword || ''}
                      onChange={handleInputChange}
                    />
                    <CustomTextField
                      name="name"
                      // control={form.control}
                      label="Name"
                      placeholder="Enter your Name"
                      value={(cData as IStoreconfig)?.name || ''}
                      onChange={handleInputChange}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Button type="submit" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </CardFooter>
    </PageContainer>
  );
};

export default Page;
