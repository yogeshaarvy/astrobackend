import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';
import { CustomMultiDropdown } from '@/utils/CustomMultiDropdown';
import { CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IProducts } from '@/redux/slices/store/productSlice';
import CustomDropdown from '@/utils/CusomDropdown';
import { FormLabel } from '@/components/ui/form';

interface StockmanagmentProductFormProps {
  handleInputChange: (e: {
    target: { name: string; type?: string; checked?: boolean; value?: string };
  }) => void;
  handleDropdownChange: (value: any) => void;
  producttype?: string;
  disabled: boolean;
  pData: any;
}

const StockmanagmentProductForm: React.FC<StockmanagmentProductFormProps> = ({
  handleInputChange,
  handleDropdownChange,
  producttype,
  pData,
  disabled
}) => {
  const form = useFormContext();
  const stockManagementEnabled =
    pData?.stockManagement?.stock_management ?? false;

  return (
    <div>
      {/* Enable Stock Management Section */}
      <div className="my-4 flex items-center">
        <FormLabel>Enable Stock Management</FormLabel>
        <Switch
          className="!m-0"
          checked={stockManagementEnabled}
          onCheckedChange={(checked) =>
            handleInputChange({
              target: {
                type: 'checkbox',
                name: 'stockManagement.stock_management',
                checked
              }
            })
          }
          aria-label="Toggle Stock Management"
          disabled={disabled}
        />
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
              value={form.watch('stock_management_level')}
              onChange={handleDropdownChange}
              disabled={disabled}
            />
          )}

          {(producttype === 'simpleproduct' ||
            (producttype === 'variableproduct' &&
              form.watch('stock_management_level') === 'product_level')) && (
            <div>
              <CustomTextField
                label="Stock Value*"
                name="stock_value"
                placeholder="Enter stock value"
                type="number"
                onChange={handleInputChange}
                value={form.watch('stock_value')}
                disabled={disabled}
              />
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
                    name: 'Out Of Stock',
                    _id: 'false'
                  }
                ]}
                value={form.watch('stock_status')}
                onChange={handleDropdownChange}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockmanagmentProductForm;
