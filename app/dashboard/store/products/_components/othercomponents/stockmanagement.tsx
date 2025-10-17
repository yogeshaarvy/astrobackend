'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';
import { CustomMultiDropdown } from '@/utils/CustomMultiDropdown';
import { CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  IProducts,
  IStockManagement,
  updateProductsData
} from '@/redux/slices/store/productSlice';
import CustomDropdown from '@/utils/CusomDropdown';
import { FormLabel } from '@/components/ui/form';
import { useAppDispatch } from '@/redux/hooks';

interface StockmanagmentProductFormProps {
  handleInputChange: (e: any) => void;
  producttype: any;
  disabled: boolean;
  pData: any;
}

const StockmanagmentProductForm: React.FC<StockmanagmentProductFormProps> = ({
  handleInputChange,
  producttype,
  disabled,
  pData
}) => {
  const form = useFormContext();
  const dispatch = useAppDispatch();

  const [stockManagement, setStockManagement] = useState<IStockManagement>({
    stock_management: false,
    stock_management_level: 'product_level'
  });

  useEffect(() => {
    if (pData?.stockManagement) {
      setStockManagement(pData.stockManagement);
    }
  }, [pData]);

  const handleStockCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updated = {
      ...stockManagement,
      stock_management: e.target.checked
    };
    setStockManagement(updated);
    dispatch(updateProductsData({ stockManagement: updated }));
  };

  const handleDropdownStockStatusChange = (e: any) => {
    if (e?.target?.name) {
      const { name, value } = e.target;
      if (name === 'stock_status') {
        const booleanValue = value === 'true';
        dispatch(updateProductsData({ [name]: booleanValue }));
      } else {
        dispatch(updateProductsData({ [name]: value }));
      }
    } else if (e?.name && e?.value) {
      setStockManagement((prev) => {
        const updated = { ...prev, [e.name]: e.value };
        dispatch(updateProductsData({ stockManagement: updated }));
        return updated;
      });
    }
  };

  return (
    <div>
      {/* Enable Stock Management Section */}
      <div className="my-4 flex items-center">
        <input
          id="stock-management-checkbox"
          type="checkbox"
          checked={stockManagement.stock_management}
          onChange={handleStockCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor="stock-management-checkbox"
          className="ms-2 text-sm font-medium text-gray-900"
        >
          Enable Stock Management
        </label>
      </div>

      {/* Stock Management Details */}
      {stockManagement.stock_management && (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-1">
          {producttype === 'variableproduct' && (
            <CustomDropdown
              control={form.control}
              label="Choose Stock Management*"
              name="stock_management_level"
              placeholder="Select stock type"
              defaultValue=""
              data={[
                {
                  name: 'Product Level (Stock will be managed generally)',
                  _id: 'product_level'
                },
                {
                  name: 'Variable Level (Stock will be managed variant-wise)',
                  _id: 'variable_level'
                }
              ]}
              value={stockManagement.stock_management_level}
              onChange={handleDropdownStockStatusChange}
            />
          )}

          {(producttype === 'simpleproduct' ||
            (producttype === 'variableproduct' &&
              stockManagement.stock_management_level === 'product_level')) && (
            <div>
              <CustomTextField
                label="Stock Value*"
                name="totalStock"
                placeholder="Enter stock value"
                type="number"
                onChange={handleInputChange}
                value={pData?.totalStock}
                disabled={disabled}
              />
              <select
                className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900"
                {...form.register('stock_status')}
                value={pData?.stock_status}
                onChange={(e) => {
                  form.setValue('stock_status', e.target.value);
                  handleDropdownStockStatusChange(e);
                }}
              >
                <option value="">Select Stock status</option>
                <option value="true">In Stock</option>
                <option value="false">Out Of Stock</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockmanagmentProductForm;
