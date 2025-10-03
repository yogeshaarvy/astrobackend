'use client';
import { FileUploader } from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  addBulkOrder,
  convertBulkOrderData,
  updateBulkOrderData,
  updateOrderDataError
} from '@/redux/slices/bulkOrderSlice';
import { Form } from '@/components/ui/form';
import * as XLSX from 'xlsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';

export default function BulkOrderPage({ empPermissions }: any) {
  const params = useSearchParams();
  const horoscopesignId = params.get('horoscopesignId');
  const form = useForm({ defaultValues: {} });
  const dispatch = useAppDispatch();
  const [exlFile, setExlFile] = React.useState<File | null>(null);

  const {
    bulkOrderState: { loading: uploadBulkOrderLoading, data }
  } = useAppSelector((state) => state.bulkOrder);

  // Set horoscopesignId when component mounts or when it changes
  useEffect(() => {
    if (horoscopesignId) {
      dispatch(updateBulkOrderData({ horoscopesignId }));
    }
  }, [horoscopesignId, dispatch]);

  const handleInputChange = (e: any) => {
    const { name, type, files } = e.target;
    dispatch(
      updateBulkOrderData({
        [name]: type === 'file' ? files[0] : e.target.value
      })
    );
  };

  const exportErrorsToExcel = (
    errorOrders: any[],
    fileName = 'bulk_order_errors'
  ) => {
    if (!Array.isArray(errorOrders) || errorOrders.length === 0) return;

    const formattedData = errorOrders.map((item: any) => {
      const row = { ...item.data };
      row.Errors = (item.errors || []).join(', ');
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
  };

  const handleSubmit = () => {
    try {
      // Validate horoscopesignId if it's required
      if (!horoscopesignId) {
        toast.error('Horoscope Sign ID is required');
        return;
      }

      if (data && Array.isArray(data?.orderList)) {
        dispatch(addBulkOrder(data?.orderList)).then((response: any) => {
          if (!response?.error) {
            const result = response?.payload;

            if (result?.hasErrors) {
              toast.warning(
                `${result.successCount} orders created successfully, ${result.errorCount} orders failed. Check error details below.`
              );

              exportErrorsToExcel(result.errors);
              setExlFile(null);
              console.log('Error details:', result.errors);
            } else {
              toast.success(
                result?.message ||
                  `All ${result?.successCount} orders created successfully!`
              );
              setExlFile(null);
            }
          } else {
            toast.error(response.payload || 'Failed to create bulk orders');
          }
        });
      } else {
        console.error('Order list is not available or not an array.');
        toast.error('Order list is not available or not an array.');
      }
    } catch (error) {
      setExlFile(null);
      console.error('Handle submit error:', error);
      toast.error('Something Went Wrong');
    }
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Update Bulk Order
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="default"
                  className="px-6 py-2 text-white"
                >
                  <a href={'/files/Upload_Order_Sample_File.xlsx'} download>
                    SAMPLE EXCEL FILE DOWNLOAD (For Bulk Order Upload)
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex-col space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-8">
                  {/* Instructions Box */}
                  <div className="col-span-12">
                    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
                      <Label className="text-base font-semibold">
                        Instructions for Bulk Upload
                      </Label>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        <li>
                          Download and use the provided sample Excel file before
                          uploading your data.
                        </li>
                        <li>
                          Ensure all <strong>column names exactly match</strong>{' '}
                          the schema keys listed in the reference table.
                        </li>
                        <li>
                          <strong>Required columns:</strong> StartDate, EndDate,
                          TitleEnglish, TitleHindi
                        </li>
                        <li>
                          <strong>Optional columns:</strong>{' '}
                          FullDescriptionEnglish, FullDescriptionHindi
                        </li>
                        <li>
                          <strong>StartDate and EndDate</strong> format must be{' '}
                          <code>DD/MM/YYYY</code> (e.g., 15/01/2024,
                          31/12/2023).
                        </li>
                        <li>
                          <strong>TitleEnglish and TitleHindi</strong> are
                          mandatory text fields.
                        </li>
                        <li>
                          <strong>
                            FullDescriptionEnglish and FullDescriptionHindi
                          </strong>{' '}
                          can be left empty or contain detailed text.
                        </li>
                        <li>
                          Upload the file in <strong>.xlsx</strong> format only.
                        </li>
                        {horoscopesignId && (
                          <li className="font-semibold text-blue-600">
                            All orders will be associated with Horoscope Sign
                            ID: {horoscopesignId}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Schema Reference Table */}
                  <div className="col-span-12">
                    <div className="rounded-lg border p-4">
                      <Label className="mb-2 block text-base font-semibold">
                        Excel Column Schema
                      </Label>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left">
                                Column Name
                              </th>
                              <th className="px-4 py-2 text-left">Type</th>
                              <th className="px-4 py-2 text-left">Required</th>
                              <th className="px-4 py-2 text-left">
                                Format/Example
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t">
                              <td className="px-4 py-2 font-mono">StartDate</td>
                              <td className="px-4 py-2">Date</td>
                              <td className="px-4 py-2">Yes</td>
                              <td className="px-4 py-2">
                                DD/MM/YYYY (e.g., 15/01/2024)
                              </td>
                            </tr>
                            <tr className="border-t bg-gray-50">
                              <td className="px-4 py-2 font-mono">EndDate</td>
                              <td className="px-4 py-2">Date</td>
                              <td className="px-4 py-2">Yes</td>
                              <td className="px-4 py-2">
                                DD/MM/YYYY (e.g., 31/12/2024)
                              </td>
                            </tr>
                            <tr className="border-t">
                              <td className="px-4 py-2 font-mono">
                                TitleEnglish
                              </td>
                              <td className="px-4 py-2">Text</td>
                              <td className="px-4 py-2">Yes</td>
                              <td className="px-4 py-2">
                                Order Title in English
                              </td>
                            </tr>
                            <tr className="border-t bg-gray-50">
                              <td className="px-4 py-2 font-mono">
                                TitleHindi
                              </td>
                              <td className="px-4 py-2">Text</td>
                              <td className="px-4 py-2">Yes</td>
                              <td className="px-4 py-2">
                                ऑर्डर शीर्षक हिंदी में
                              </td>
                            </tr>
                            <tr className="border-t">
                              <td className="px-4 py-2 font-mono">
                                FullDescriptionEnglish
                              </td>
                              <td className="px-4 py-2">Text</td>
                              <td className="px-4 py-2">No</td>
                              <td className="px-4 py-2">
                                Detailed description (optional)
                              </td>
                            </tr>
                            <tr className="border-t bg-gray-50">
                              <td className="px-4 py-2 font-mono">
                                FullDescriptionHindi
                              </td>
                              <td className="px-4 py-2">Text</td>
                              <td className="px-4 py-2">No</td>
                              <td className="px-4 py-2">
                                विस्तृत विवरण (वैकल्पिक)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Box */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex-col space-y-3 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <div>
                    <h3 className="text-lg font-semibold">Upload Excel File</h3>
                    <FileUploader
                      value={exlFile ? [exlFile] : []}
                      onValueChange={(newFiles: any) => {
                        const files = newFiles[0] || null;
                        if (files?.length == 0) {
                          dispatch(updateOrderDataError([]));
                        }
                        setExlFile(files || null);
                        handleInputChange({
                          target: {
                            name: 'excel',
                            type: 'file',
                            files: newFiles
                          }
                        });
                        dispatch(convertBulkOrderData());
                      }}
                      accept={{
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                          ['.xlsx'],
                        'application/vnd.ms-excel': ['.xls'],
                        'text/csv': ['.csv']
                      }}
                      maxSize={1024 * 1024 * 5}
                    />

                    <p className="text-sm text-gray-500">
                      Drop files here or click to upload. <br />
                      Allowed <code>*.xlsx</code>, <code>*.xls</code>,{' '}
                      <code>*.csv</code> <br />
                      Max 1 file and max size of 5.0 MB
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="mb-4 flex justify-center">
          <Button
            type="submit"
            variant="default"
            className="px-8 py-2 text-white"
            onClick={() => handleSubmit()}
            disabled={!horoscopesignId}
          >
            {uploadBulkOrderLoading ? 'UPLOADING...' : 'UPLOAD'}
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
