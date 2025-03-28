'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';

interface SimpleProductFormProps {
  handleInputChange: any;
  disabled: boolean;
  pData: any;
  entityId: any;
}

const SimpleProductForm: React.FC<SimpleProductFormProps> = ({
  handleInputChange,
  disabled,
  pData,
  entityId
}) => {
  const form = useFormContext(); // Use the form context from the parent
  React.useEffect(() => {
    if (entityId && pData && pData?.productype === 'simpleproduct') {
      form.setValue(
        'variants?.special_price',
        pData?.variants[0]?.special_price || 0
      );
      form.setValue('variants?.price', pData?.variants[0]?.price || 0);
      form.setValue('variants?.height', pData?.variants[0]?.height || 0);
      form.setValue('variants?.weight', pData?.variants[0]?.weight || 0);
      form.setValue('variants?.breadth', pData?.variants[0]?.breadth || 0);
      form.setValue('variants?.length', pData?.variants[0]?.length || 0);
    }
  }, [pData, entityId, form]);
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CustomTextField
          label="Price*"
          name="price"
          control={form.control}
          placeholder="Enter price"
          onChange={handleInputChange} // Handled by `react-hook-form`
          value={form.getValues('variants?.price')}
          type="number"
          disabled={disabled}
        />
        <CustomTextField
          label="Special Price*"
          name="special_price"
          control={form.control}
          placeholder="Enter special price"
          onChange={handleInputChange} // Handled by `react-hook-form`
          value={form.getValues('variants?.special_price')}
          type="number"
          disabled={disabled}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-4">
        <CustomTextField
          label="Weight(kg)*"
          name="weight"
          control={form.control}
          placeholder="Enter weight"
          onChange={handleInputChange} // Handled by `react-hook-form`
          value={form.getValues('variants?.weight')}
          type="number"
          disabled={disabled}
        />
        <CustomTextField
          label=" Height(cms)*"
          name="height"
          control={form.control}
          placeholder="Enter height"
          onChange={handleInputChange} // Handled by `react-hook-form`
          value={form.getValues('variants?.height')}
          type="number"
          disabled={disabled}
        />
        <CustomTextField
          label=" Breadth(cms)*"
          name="breadth"
          control={form.control}
          placeholder="Enter breadth"
          onChange={handleInputChange} // Handled by `react-hook-form`
          value={form.getValues('variants?.breadth')}
          type="number"
          disabled={disabled}
        />
        <CustomTextField
          label="Length(cms)*"
          name="length"
          control={form.control}
          placeholder="Enter length"
          onChange={handleInputChange} // Handled by `react-hook-form`
          value={form.getValues('variants?.length')}
          type="number"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SimpleProductForm;
