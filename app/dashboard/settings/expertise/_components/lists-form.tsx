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
import { Input } from '@/components/ui/input';
import slugify from 'slugify';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import {
  ISkills,
  fetchSingleSkills,
  addEditSkills,
  updateSkillData
} from '@/redux/slices/skillsSlice';

export default function ListForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    singleSkillState: { data: bData }
  } = useAppSelector((state) => state.skills);

  const form = useForm({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleSkills(entityId));
    }
  }, [entityId]);

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateSkillData({
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
    const requiredFields: (keyof ISkills)[] = ['name'];

    const missingFields = requiredFields.filter(
      (field) => !(bData as ISkills)?.[field]
    );

    if (missingFields.length > 0) {
      const fieldLabels: { [key in keyof ISkills]?: string } = {
        name: 'Name'
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
      dispatch(addEditSkills(entityId || null)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/settings/expertise');
          toast.success(response?.payload?.message);
        } else {
          console.log('error');
          toast.error(response.payload);
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Skills Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <div className="flex items-center space-x-2">
                  <Tabs defaultValue="seo" className="mt-4 w-full">
                    <TabsContent value="seo">
                      <Card>
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
                            <>
                              <CardContent className="space-y-2">
                                <div className="space-y-1">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    name="name.en"
                                    type="text"
                                    placeholder="Enter Skills Name in English"
                                    value={(bData as ISkills)?.name?.en}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </CardContent>
                            </>
                          </TabsContent>

                          <TabsContent value="Hindi">
                            <>
                              <CardContent className="space-y-2">
                                <div className="space-y-1">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    name="name.hi"
                                    placeholder="Enter Skills Name in Hindi"
                                    value={(bData as ISkills)?.name?.hi}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </CardContent>
                            </>
                          </TabsContent>
                        </Tabs>
                      </Card>
                    </TabsContent>
                  </Tabs>
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
}
