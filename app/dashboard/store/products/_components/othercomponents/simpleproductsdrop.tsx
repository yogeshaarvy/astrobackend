'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';

import { useDispatch } from 'react-redux';
import { useAppDispatch } from '@/redux/hooks';
import { ISimpleProduct } from '@/redux/slices/store/productSlice';

interface SimpleProductFormProps {
  handleInputChange: any;
  disabled: boolean;
  pData: any;
  entityId: any;
  onVariationsChange: any;
}

const SimpleProductForm: React.FC<SimpleProductFormProps> = ({
  handleInputChange,
  disabled,
  pData,
  entityId,
  onVariationsChange
}) => {
  const form = useFormContext(); // Use the form context from the parent
  const dispatch = useAppDispatch();
  const [variationData, setVariationData] = useState<ISimpleProduct[]>([
    {
      price: 0,
      special_price: 0,
      weight: 0,
      height: 0,
      breadth: 0,
      length: 0
    }
  ]);
  useEffect(() => {
    if (pData?.variants?.length > 0) {
      setVariationData(pData?.variants);
    }
  }, [dispatch, pData]);
  const handleVariationsChange = (index: number, field: string, value: any) => {
    const updatedCombinations = [...variationData];
    updatedCombinations[index] = {
      ...updatedCombinations[index],
      [field]: value
    };
    setVariationData(updatedCombinations);
    // Extract only the _id from the values
    const combinationsWithIds = updatedCombinations.map((combination) => ({
      ...combination,
      values: []
    }));
    // dispatch(
    //   updateProductsData({
    //     variations: combinationsWithIds
    //   })
    // );
    onVariationsChange(combinationsWithIds);
  };
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CustomTextField
          label="Price*"
          name="price"
          control={form.control}
          placeholder="Enter price"
          onChange={(e) => handleVariationsChange(0, 'price', e.target.value)} // Handled by `react-hook-form`
          value={variationData[0]?.price}
          type="number"
          // disabled={disabled}
        />
        <CustomTextField
          label="Special Price*"
          name="special_price"
          control={form.control}
          placeholder="Enter special price"
          onChange={(e) =>
            handleVariationsChange(0, 'special_price', e.target.value)
          } // Handled by `react-hook-form`
          value={variationData[0]?.special_price}
          type="number"
          // disabled={disabled}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-4">
        <CustomTextField
          label="Weight(gm)*"
          name="weight"
          control={form.control}
          placeholder="Enter weight"
          onChange={(e) => handleVariationsChange(0, 'weight', e.target.value)} // Handled by `react-hook-form`
          value={variationData[0]?.weight}
          type="number"
          // disabled={disabled}
        />
        <CustomTextField
          label=" Height(cms)*"
          name="height"
          control={form.control}
          placeholder="Enter height"
          onChange={(e) => handleVariationsChange(0, 'height', e.target.value)} // Handled by `react-hook-form`
          value={variationData[0]?.height}
          type="number"
          // disabled={disabled}
        />
        <CustomTextField
          label=" Breadth(cms)*"
          name="breadth"
          control={form.control}
          placeholder="Enter breadth"
          onChange={(e) => handleVariationsChange(0, 'breadth', e.target.value)} // Handled by `react-hook-form`
          value={variationData[0]?.breadth}
          type="number"
          // disabled={disabled}
        />
        <CustomTextField
          label="Length(cms)*"
          name="length"
          control={form.control}
          placeholder="Enter length"
          onChange={(e) => handleVariationsChange(0, 'length', e.target.value)} // Handled by `react-hook-form`
          value={variationData[0]?.length}
          type="number"
          // disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SimpleProductForm;
