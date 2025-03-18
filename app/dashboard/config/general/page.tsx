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
  addEditConfigPage,
  fetchConfig,
  IConfig,
  setConfig,
  updateConfig
} from '@/redux/slices/home/configSlice';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    configState: { loading, data: cData = [] }
  } = useAppSelector((state) => state.configs);

  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [lightLogo, setLightLogo] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchConfig(null));
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
      updateConfig({
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

    dispatch(addEditConfigPage(null)).then((response: any) => {
      if (!response?.error) {
        setLightLogo(null);
        setDarkLogo(null);
        toast.success(response?.payload?.message);
      } else {
        toast.error(response.payload);
      }
    });
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Home Config
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <div className="space-y-1">
                  {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
                  <Label htmlFor="name">Meta Title</Label>
                  <Input
                    name="metaTitle"
                    placeholder="Enter Meta Title "
                    value={(cData as IConfig)?.metaTitle}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="name">Meta Description</Label>
                  <Input
                    name="metaDescription"
                    placeholder="Enter Meta Description "
                    value={(cData as IConfig)?.metaDescription}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="name">Meta Keyword</Label>
                  <Input
                    name="metaKeyword"
                    placeholder="Enter Meta Keyword"
                    value={(cData as IConfig)?.metaKeyword}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="name">Name </Label>
                  <Input
                    name="name"
                    placeholder="Enter Meta Keyword"
                    value={(cData as IConfig)?.name}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </Form>
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
      </Card>
    </PageContainer>
  );
};

export default Page;
