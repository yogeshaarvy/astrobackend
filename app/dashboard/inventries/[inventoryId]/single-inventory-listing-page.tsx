'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import ProductInventoryTable from './single-table';
import {
  addEditInventory,
  fetchInventoryList,
  fetchSingleVariation,
  IInventory,
  setInventoryData,
  updateInventoryData
} from '@/redux/slices/inventoriesSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import CustomTextField from '@/utils/CustomTextField';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

import { CardContent } from '@/components/ui/card';
import CustomDropdown from '@/utils/CusomDropdown';
import { toast } from 'sonner';
export default function ProductInventoryListingPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const variantId = searchParams?.get('variantid') || '';
  const productId = searchParams?.get('productid') || '';
  const producttype = searchParams?.get('producttype') || '';
  const stock_management = searchParams?.get('stock_management') || '';
  const productname = searchParams?.get('productname') || '';
  const page = parseInt(searchParams?.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams?.get('limit') ?? '10', 10);
  let exportData = 'false';
  const {
    inventoryListState: {
      loading: inventoryListLoading,
      data: inventoryData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.inventories);
  const {
    singleVariationState: {
      loading: singleVariationStateLoading,
      data: variationData
    }
  } = useAppSelector((state) => state.inventories);
  useEffect(() => {
    dispatch(
      fetchInventoryList({
        page,
        pageSize,
        productId,
        variantId,
        producttype,
        stock_management,
        exportData,
        startDate,
        endDate
      })
    );

    dispatch(setInventoryData(null));
  }, [page, pageSize, dispatch]); // Ensure this is run only once when the component mounts
  const form = useForm<IInventory>({
    defaultValues: {
      message: '',
      value: 0,
      type: '',
      productId: productId,
      variantId: variantId
    }
  });
  // You can safely assume `inventoryData` is populated now
  const product_Inventories: IInventory[] = inventoryData;
  const handleSearch = (startDate: Date | null, endDate: Date | null) => {
    dispatch(
      fetchInventoryList({
        page,
        pageSize,
        productId,
        variantId,
        producttype,
        stock_management,
        exportData,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null
      })
    );
  };
  useEffect(() => {
    if (variantId == '') {
    }
    if (variantId) {
      dispatch(fetchSingleVariation(variantId));
    }
  }, [variantId]);
  const handleExport = async () => {
    try {
      // Fetch the export data from the API
      const exportResponse = await dispatch(
        fetchInventoryList({
          page,
          pageSize,
          productId,
          variantId,
          producttype,
          stock_management,
          exportData: 'true',
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null
        })
      ).unwrap(); // Ensure this returns a promise that resolves the data
      const exportData = exportResponse.InventoriesData;
      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        ['ID', 'createdAt', 'Time', 'Stock Type', 'Stock', 'Current Stock'], // CSV headers
        ...exportData.map((item: any, index: any) => [
          index + 1,
          new Date(item.createdAt).toLocaleString(),
          item.type,
          item.value,
          item.current_stock
        ])
      ]
        .map((row) => row.join(','))
        .join('\n');

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'productInventories_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('An error occurred while exporting data.');
    }
  };
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateInventoryData({
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
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateInventoryData({ [name]: value }) // .then(handleReduxResponse());
    );
  };
  let entityId;
  function onSubmit(data: any) {
    dispatch(
      updateInventoryData({
        ...data, // Override with new values
        productId: productId,
        variantId: variantId,
        stock_management: stock_management
      })
    );
    dispatch(addEditInventory(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          setIsModalOpen(false);
          dispatch(
            fetchInventoryList({
              page,
              pageSize,
              productId,
              variantId,
              producttype,
              stock_management,
              exportData,
              startDate: startDate ? startDate.toISOString() : null,
              endDate: endDate ? endDate.toISOString() : null
            })
          );
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  }
  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4">
        <div className="flex items-start justify-between pr-4">
          <Heading
            title={`${productname}${
              variationData
                ? `(${variationData.values
                    .map((e: any) => e?.short_name)
                    .join(', ')})`
                : ''
            }`}
            description=""
          />
          <div className="flex items-center">
            <Button
              className="mx-5 py-4"
              variant="default"
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              className={buttonVariants({ variant: 'default' })}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
        </div>
        <Separator />
        <ProductInventoryTable
          data={product_Inventories}
          totalData={totalCount}
          handleSearch={handleSearch}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Inventory"
        description=""
      >
        {/* Modal content goes here */}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="message"
                  control={form.control}
                  label="Message"
                  placeholder="Enter your message"
                  value={(inventoryData as IInventory)?.message}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="value"
                  control={form.control}
                  label="Value"
                  placeholder="0"
                  value={(inventoryData as IInventory)?.value}
                  onChange={handleInputChange}
                  type="number"
                />

                <CustomDropdown
                  control={form.control}
                  label="Type"
                  name="type"
                  placeholder="Select Type"
                  defaultValue=""
                  data={[
                    { name: 'Credit', _id: 'credit' },
                    { name: 'Debit', _id: 'debit' }
                  ]}
                  // loading={brandListLoading ?? false}
                  value={(inventoryData as IInventory)?.type}
                  onChange={handleDropdownChange}
                />
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Modal>
    </PageContainer>
  );
}
