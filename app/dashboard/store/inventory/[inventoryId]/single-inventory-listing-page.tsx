'use client';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ProductInventoryTable from './single-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  fetchInventoryList,
  fetchSingleVariation,
  IInventory,
  setInventoryData,
  addEditInventory
} from '@/redux/slices/inventoriesSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductInventoryListingPage() {
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

  // State for the add inventory popup
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [inventoryFormData, setInventoryFormData] = useState({
    value: '',
    type: 'credit',
    message: '',
    stock_management
  });

  const {
    inventoryListState: {
      loading: inventoryListLoading,
      data: inventoryData = [],
      pagination: { totalCount }
    },
    singleInventoryState: { loading: inventoryLoading, data: iData = [] }
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
        exportData
      })
    );

    dispatch(setInventoryData(null));
  }, [page, pageSize, dispatch]);

  // You can safely assume `inventoryData` is populated now
  const product_Inventories: IInventory[] = inventoryData;

  const handleSearch = () => {
    dispatch(
      fetchInventoryList({
        page,
        pageSize,
        productId,
        variantId,
        producttype,
        stock_management,
        exportData
      })
    );
  };

  useEffect(() => {
    if (variantId) {
      dispatch(fetchSingleVariation(variantId));
    }
  }, [variantId, dispatch]);

  // Handle Add Inventory button click
  const handleAddInventry = () => {
    setIsAddInventoryOpen(true);
  };

  // Handle input changes in the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInventoryFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmitInventory = () => {
    // Set the inventory data in the Redux store first
    const inventoryData = {
      ...inventoryFormData,
      productId,
      variationId: variantId
    };

    // Set the data in Redux state
    dispatch(setInventoryData(inventoryData));

    // Then call the addEditInventory thunk with null to indicate it's a new entry
    dispatch(addEditInventory(null))
      .unwrap()
      .then((result) => {
        // Close the dialog on success
        setIsAddInventoryOpen(false);

        // Reset the form
        setInventoryFormData({
          value: '',
          type: 'credit',
          message: '',
          stock_management: stock_management
        });
      })
      .catch((error) => {
        console.error('Failed to add inventory:', error);
        // You might want to display an error message here
      });
  };

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
          exportData: 'true'
        })
      ).unwrap();
      const exportData = exportResponse.InventoriesData;

      if (!exportData || exportData.length === 0) {
        alert('No data available to export');
        return;
      }

      // Generate CSV content
      const csvContent = [
        ['ID', 'Name', 'Rate', 'Active'], // CSV headers
        ...exportData.map((item: any) => [
          item._id,
          item.name,
          item.rate,
          item.active
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

  return (
    <PageContainer scrollable>
      <div className="mr-5 space-y-4">
        <div className="flex items-start justify-between pr-4">
          <Heading
            title={`${productname}${
              variationData?.values?.map(
                (e: any) => '(' + e?.short_name + ')'
              ) || ''
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
              onClick={handleAddInventry}
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
        />
      </div>

      {/* Add Inventory Dialog/Popup */}
      <Dialog open={isAddInventoryOpen} onOpenChange={setIsAddInventoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Inventory</DialogTitle>
            <DialogDescription>
              Enter the inventory details for {productname}
              {variationData?.values?.map(
                (e: any) => ' (' + e?.short_name + ')'
              ) || ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <select
                id="type"
                name="type"
                value={inventoryFormData.type}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                value={inventoryFormData.value}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Input
                id="message"
                name="message"
                value={inventoryFormData.message}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional inventory note"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddInventoryOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmitInventory}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
