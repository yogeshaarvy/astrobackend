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
  handleInputChange: (e: {
    target: { name: string; type?: string; checked?: boolean; value?: string };
  }) => void;
  producttype?: string;
  disabled: boolean;
  pData: any;
}

const StockmanagmentProductForm: React.FC<StockmanagmentProductFormProps> = ({
  handleInputChange,
  producttype,
  pData,
  disabled
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

  const handleStockToggleChange = (checked: boolean) => {
    const updated = {
      ...stockManagement,
      stock_management: checked
    };
    setStockManagement(updated);
    dispatch(updateProductsData({ stockManagement: updated }));
  };

  const handleDropdownStockStatusChange = (e: any) => {
    if (e?.target?.name) {
      const { name, value } = e.target;
      dispatch(updateProductsData({ [name]: value }));
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
        <FormLabel>Enable Stock Management</FormLabel>
        <Switch
          className="!m-0"
          checked={stockManagement.stock_management}
          onCheckedChange={handleStockToggleChange}
          aria-label="Toggle Stock Management"
        />
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
                name="stock_value"
                placeholder="Enter stock value"
                type="number"
                onChange={handleInputChange}
                value={form.watch('stock_value')}
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
                onChange={(e) => {
                  form.setValue('stock_status', e.target.value);
                  handleDropdownStockStatusChange(e);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockmanagmentProductForm;
