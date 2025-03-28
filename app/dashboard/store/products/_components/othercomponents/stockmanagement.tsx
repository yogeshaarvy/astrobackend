import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';
import { CustomMultiDropdown } from '@/utils/CustomMultiDropdown';
import CustomDropdown from '@/utils/CusomDropdown';

interface StockmanagmentProductFormProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropdownChange: (value: any) => void;
  producttype: any;
  disabled: boolean;
}

const StockmanagmentProductForm: React.FC<StockmanagmentProductFormProps> = ({
  handleInputChange,
  handleDropdownChange,
  producttype,
  disabled
}) => {
  const form = useFormContext();
  const stockManagementEnabled = form.watch('stock_management'); // Watch for stock_management checkbox changes

  return (
    <div>
      {/* Enable Stock Management Section */}
      <div className="my-4 flex items-center">
        <input
          id="stock-management-checkbox"
          type="checkbox"
          {...form.register('stock_management')} // Bind to react-hook-form
          className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 ${
            disabled ? 'cursor-not-allowed' : ''
          }`} // Styling for disabled state
          disabled={disabled} // Disable checkbox if settings are saved
        />
        <label
          htmlFor="stock-management-checkbox"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Enable Stock Management
        </label>
      </div>

      {/* Stock Management Details */}
      {stockManagementEnabled && (
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
              value={form.getValues('stock_management_level')}
              onChange={handleDropdownChange}
              disabled={disabled} // Disable dropdown if settings are saved
            />
          )}

          {(producttype === 'simpleproduct' ||
            (producttype === 'variableproduct' &&
              form.getValues('stock_management_level') ===
                'product_level')) && (
            <div>
              <CustomTextField
                label="Stock Value*"
                name="stock_value"
                control={form.control}
                placeholder="Enter stock value"
                type="number"
                onChange={handleInputChange}
                value={form.getValues('stock_value')}
                disabled={disabled} // Disable field if settings are saved
              />
              {/* <CustomTextField
                label="SKU"
                name="sku"
                control={form.control}
                placeholder="Enter SKU"
                type="text"
                onChange={handleInputChange}
                value={form.getValues('sku')}
                disabled={disabled} // Disable field if settings are saved
              /> */}
              <CustomDropdown
                control={form.control}
                label="Stock Status*"
                name="stock_status"
                placeholder="Select stock status"
                defaultValue="true"
                data={[
                  {
                    name: 'In Stock',
                    _id: 'true'
                  },
                  {
                    name: 'Out Of Status',
                    _id: 'false'
                  }
                ]}
                value={form.getValues('stock_status')}
                onChange={handleDropdownChange}
                disabled={disabled} // Disable field if settings are saved
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockmanagmentProductForm;
