import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';

interface VariationsFormProps {
  newAttributes: any[];
  handleInputChange: any;
  stockmanagemet: any;
  pData: any;
  onVariationsChange: (variations: any[]) => void; // Add a prop for sending variations data to the parent
}

const VariationsForm: React.FC<VariationsFormProps> = ({
  newAttributes,
  handleInputChange,
  stockmanagemet,
  onVariationsChange,
  pData
}) => {
  const form = useFormContext();
  const [combinations, setCombinations] = useState<any[]>([]);
  const [variationImage, setVariationImage] = React.useState<File | null>(null);
  const [variationImagePreview, setVariationImagePreview] = React.useState<
    string | null
  >(null);
  // Handle variations Image Upload
  const handleVariationImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setVariationImage(file);
    setVariationImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // Remove variations Image
  const handleRemoveVariationImage = () => {
    setVariationImage(null);
    setVariationImagePreview(null);
  };
  // Generate combinations of all values from attributes
  const generateCombinations = (attributes: any[]) => {
    if (attributes.length === 0) return [];
    // Use recursive method to generate combinations
    const combine = (arr1: any[], arr2: any[]) => {
      const result: any = [];
      arr1.forEach((item1) => {
        arr2.forEach((item2) => {
          result.push([...item1, item2]);
        });
      });

      return result;
    };

    // Start with the first attribute's values
    let combinations = attributes[0].values.map((value: any) => [value]);
    // Combine with subsequent attributes' values
    for (let i = 1; i < attributes.length; i++) {
      combinations = combine(combinations, attributes[i].values);
    }

    return combinations.map((combination: any) => ({
      values: combination,
      price: '',
      special_price: '',
      weight: '',
      height: '',
      breadth: '',
      length: '',
      sku: '',
      totalStock: '',
      stock_status: ''
    }));
  };

  useEffect(() => {
    if (pData && pData?.variants) {
      setCombinations(pData?.variants);
    } else {
      const newCombinations = generateCombinations(newAttributes);
      setCombinations(newCombinations);
      onVariationsChange(newCombinations);
    }
  }, [newAttributes, pData]);

  // Handle input change and send updated variations data to the parent
  const handleFieldChange = (index: number, field: string, value: any) => {
    const updatedCombinations = [...combinations];
    updatedCombinations[index] = {
      ...updatedCombinations[index],
      [field]: value
    };
    setCombinations(updatedCombinations);
    // Extract only the _id from the values
    const combinationsWithIds = updatedCombinations.map((combination) => ({
      ...combination,
      values: combination.values.map((value: any) => value._id)
    }));
    onVariationsChange(combinationsWithIds);
  };
  return (
    <div className="mb-5 pb-5">
      {combinations?.length === 0 ? (
        <div className="text-md border-black-1000 border bg-gray-100 py-4 text-center font-medium">
          No Product Variations Are Added!
        </div>
      ) : (
        <div className="shadow-l bg-white-700 relative ring-1 ring-gray-900/5">
          <div className="mx-auto px-5">
            <div className="grid divide-y divide-neutral-200">
              {combinations.map((combination: any, index: any) => (
                <div className="py-5" key={`combination-${index}`}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                      <div className="flex">
                        {combination.values.map(
                          (value: any, valueIndex: number) => (
                            <div
                              className="mx-2 rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900"
                              key={`value-${index}-${valueIndex}`}
                            >
                              {value?.short_name}
                            </div>
                          )
                        )}
                      </div>
                      <span className="transition group-open:rotate-180">
                        <svg
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </span>
                    </summary>

                    <div className="border-black-1000 mt-4 border bg-white p-3">
                      <div className="grid grid-cols-1 gap-6  md:grid-cols-2">
                        <CustomTextField
                          label="Price*"
                          name={`combinations[${index}].price`}
                          control={form.control}
                          placeholder="Enter price"
                          onChange={(e) =>
                            handleFieldChange(index, 'price', e.target.value)
                          }
                          value={combination.price}
                          type="number"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                        <CustomTextField
                          label="Special Price*"
                          name={`combinations[${index}].special_price`}
                          control={form.control}
                          placeholder="Enter special price"
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'special_price',
                              e.target.value
                            )
                          }
                          value={combination.special_price}
                          type="number"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                        <CustomTextField
                          label="SKU:"
                          name={`combinations[${index}].sku`}
                          control={form.control}
                          placeholder="Enter SKU"
                          onChange={(e) =>
                            handleFieldChange(index, 'sku', e.target.value)
                          }
                          value={combination.sku}
                          type="text"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                        {stockmanagemet === 'variable_level' && (
                          <>
                            <CustomTextField
                              label="Total Stock*"
                              name={`combinations[${index}].totalStock`}
                              control={form.control}
                              placeholder="Enter total stock"
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  'totalStock',
                                  e.target.value
                                )
                              }
                              value={combination.totalStock}
                              type="number"
                              disabled={!!pData?.variants} // Disable field if pData is present
                            />
                            {/* <CustomDropdown
                              control={form.control}
                              label="Stock Status*"
                              name="stock_status"
                              placeholder="Select stock status"
                              defaultValue={combination.stock_status || 'true'}
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
                              onChange={(e: any) =>
                                handleFieldChange(index, 'stock_status', e._id)
                              }
                              value={combination.stock_status || 'true'}
                              disabled={!!pData?.variants} // Disable field if pData is present
                            /> */}
                            <div className="d-flex">
                              <h6>Stock status*</h6>
                              <select
                                className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900"
                                name={`combinations[${index}].stock_status`}
                                value={combination.stock_status || 'true'} // Ensure it has a valid value
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    'stock_status',
                                    e.target.value
                                  )
                                }
                                disabled={!!pData?.variants} // Disable if pData is present
                              >
                                <option value="">Select Stock status</option>
                                <option value="true">In Stock</option>
                                <option value="false">Out Of Stock</option>
                              </select>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <CustomTextField
                          label="Weight(kg)*"
                          name={`combinations[${index}].weight`}
                          control={form.control}
                          placeholder="Enter Weight"
                          onChange={(e) =>
                            handleFieldChange(index, 'weight', e.target.value)
                          }
                          value={combination.weight}
                          type="number"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                        <CustomTextField
                          label="Height(cms)*"
                          name={`combinations[${index}].height`}
                          control={form.control}
                          placeholder="Enter height"
                          onChange={(e) =>
                            handleFieldChange(index, 'height', e.target.value)
                          }
                          value={combination.height}
                          type="number"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                        <CustomTextField
                          label="Breadth(cms)*"
                          name={`combinations[${index}].breadth`}
                          control={form.control}
                          placeholder="Enter breadth"
                          onChange={(e) =>
                            handleFieldChange(index, 'breadth', e.target.value)
                          }
                          value={combination.breadth}
                          type="number"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                        <CustomTextField
                          label="Length(cms)*"
                          name={`combinations[${index}].length`}
                          control={form.control}
                          placeholder="Enter length"
                          onChange={(e) =>
                            handleFieldChange(index, 'length', e.target.value)
                          }
                          value={combination.length}
                          type="number"
                          disabled={!!pData?.variants} // Disable field if pData is present
                        />
                      </div>

                      {/* Main Image Uploader */}
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Main Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleVariationImageUpload}
                          className="file:bg-black-100 hover:file:bg-black-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-500"
                        />
                        {variationImagePreview && (
                          <div
                            className="relative mt-4 "
                            style={{
                              display: 'flex',
                              right: '650px',
                              justifyContent: 'flex-end'
                            }}
                          >
                            <img
                              src={variationImagePreview}
                              alt="Main Preview"
                              className="h-32 w-32 rounded-md border object-cover"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveVariationImage}
                              className="absolute right-0 top-0 rounded-full bg-white p-1 text-red-500 shadow-md"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div> */}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariationsForm;
