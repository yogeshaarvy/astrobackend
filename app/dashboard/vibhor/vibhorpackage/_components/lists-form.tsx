'use client';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import {
  addEditVibhorPackage,
  IVibhorPackage,
  updateVibhorPackageData,
  fetchSingleVibhorPackage,
  clearVibhorPackageData
} from '@/redux/slices/vibhorPackageSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomDropdown from '@/utils/CusomDropdown';
import CustomTextEditor from '@/utils/CustomTextEditor';

export default function VibhorPackageForm() {
  const params = useSearchParams();
  const entityId = params.get('id');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    singleVibhorPackageState: { loading, data: packageData }
  } = useAppSelector((state) => state.vibhorPackage);

  const form = useForm<IVibhorPackage>({});

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleVibhorPackage(entityId));
    } else {
      // Clear data for new package creation
      dispatch(clearVibhorPackageData());
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearVibhorPackageData());
    };
  }, [entityId, dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    dispatch(
      updateVibhorPackageData({
        [name]:
          type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!packageData) {
      toast.error('Please fill in the required fields');
      return;
    }

    // Basic validation
    if (!packageData.title?.en || !packageData.title?.hi) {
      toast.error('Please provide title in both English and Hindi');
      return;
    }

    if (!packageData.mrp || !packageData.salePrice) {
      toast.error('Please provide MRP and Sale Price');
      return;
    }

    if (!packageData.no_of_types || !packageData.no_of_values) {
      toast.error('Please provide package duration details');
      return;
    }

    try {
      dispatch(addEditVibhorPackage(entityId)).then((response: any) => {
        if (!response?.error) {
          router.push('/dashboard/vibhor/vibhorpackage');
          toast.success(
            response?.payload?.message || 'Package saved successfully'
          );
        } else {
          toast.error(response.payload || 'Something went wrong');
        }
      });
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;
    dispatch(updateVibhorPackageData({ [name]: value }));
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {entityId ? 'Edit' : 'Create'} Vibhor Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                {/* Pricing Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mrp">MRP (₹) *</Label>
                    <Input
                      name="mrp"
                      type="number"
                      placeholder="Enter MRP"
                      value={packageData?.mrp || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price (₹) *</Label>
                    <Input
                      name="salePrice"
                      type="number"
                      placeholder="Enter sale price"
                      value={packageData?.salePrice || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Display calculated discount percentage */}
                {packageData?.mrp &&
                  packageData?.salePrice &&
                  packageData.mrp > packageData.salePrice && (
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="font-medium text-green-700">
                        Discount:{' '}
                        {Math.round(
                          ((packageData.mrp - packageData.salePrice) /
                            packageData.mrp) *
                            100
                        )}
                        % OFF
                      </p>
                    </div>
                  )}

                {/* Duration Section - Updated to match model */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <CustomDropdown
                      label="Duration Type *"
                      name="no_of_types"
                      defaultValue=""
                      data={[{ name: 'Minutes', _id: 'minutes' }]}
                      value={packageData?.no_of_types || ''}
                      onChange={handleDropdownChange}
                    />
                    <p className="text-sm text-gray-500">
                      Package duration is measured in minutes only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no_of_values">
                      Duration Value (Minutes) *
                    </Label>
                    <Input
                      name="no_of_values"
                      type="number"
                      placeholder="Enter duration in minutes"
                      value={packageData?.no_of_values || ''}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                    <p className="text-sm text-gray-500">
                      Enter the total number of minutes for this package
                    </p>
                  </div>
                </div>

                {/* Display formatted duration */}
                {packageData?.no_of_values && packageData?.no_of_types && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="font-medium text-blue-700">
                      Package Duration: {packageData.no_of_values} minutes
                      {packageData.no_of_values >= 60 && (
                        <span className="text-blue-600">
                          {' '}
                          ({Math.floor(packageData.no_of_values / 60)} hour
                          {Math.floor(packageData.no_of_values / 60) > 1
                            ? 's'
                            : ''}
                          {packageData.no_of_values % 60 > 0 &&
                            ` ${packageData.no_of_values % 60} minute${
                              packageData.no_of_values % 60 > 1 ? 's' : ''
                            }`}
                          )
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Sequence */}
                <div className="space-y-2">
                  <Label htmlFor="sequence">Display Sequence</Label>
                  <Input
                    name="sequence"
                    type="number"
                    placeholder="Enter display sequence (optional)"
                    value={packageData?.sequence || ''}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-gray-500">
                    Lower numbers will be displayed first
                  </p>
                </div>

                {/* Title Section with Tabs */}
                <Tabs defaultValue="English" className="w-full">
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
                    <CardContent className="space-y-4 p-0">
                      <div className="space-y-2">
                        <Label htmlFor="title.en">Title (English) *</Label>
                        <Input
                          name="title.en"
                          placeholder="Enter package title in English"
                          value={packageData?.title?.en || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <CustomTextEditor
                        name="feature.en"
                        label="Features (English)"
                        value={packageData?.feature?.en || ''}
                        onChange={(value) =>
                          handleInputChange({
                            target: {
                              name: 'feature.en',
                              value: value,
                              type: 'text'
                            }
                          })
                        }
                      />
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="Hindi">
                    <CardContent className="space-y-4 p-0">
                      <div className="space-y-2">
                        <Label htmlFor="title.hi">Title (Hindi) *</Label>
                        <Input
                          name="title.hi"
                          placeholder="Enter package title in Hindi"
                          value={packageData?.title?.hi || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <CustomTextEditor
                        name="feature.hi"
                        label="Features (Hindi)"
                        value={packageData?.feature?.hi || ''}
                        onChange={(value) =>
                          handleInputChange({
                            target: {
                              name: 'feature.hi',
                              value: value,
                              type: 'text'
                            }
                          })
                        }
                      />
                    </CardContent>
                  </TabsContent>
                </Tabs>

                {/* Active Status */}
                {/* <div className="space-y-2">
                  <Label htmlFor="active" className="flex items-center gap-2">
                    Active Status
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={packageData?.active || false}
                      onCheckedChange={(checked: boolean) =>
                        handleInputChange({
                          target: {
                            type: 'checkbox',
                            name: 'active',
                            checked
                          }
                        })
                      }
                      aria-label="Toggle Active Status"
                    />
                    <span className="text-sm text-gray-600">
                      {packageData?.active ? 'Package is active' : 'Package is inactive'}
                    </span>
                  </div>
                </div> */}
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/vibhor/vibhorpackage')}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading
              ? 'Saving...'
              : entityId
              ? 'Update Package'
              : 'Create Package'}
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
