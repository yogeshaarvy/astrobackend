import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '@/utils/CustomTextField';
import CustomDropdown from '@/utils/CusomDropdown';
import { fetchApi } from '@/services/utlis/fetchApi';

interface VariationsFormProps {
  newAttributes: any[];
  handleInputChange: any;
  stockmanagemet: any;
  pData: any;
  onVariationsChange: (variations: any[]) => void;
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
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>(
    {}
  );

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
      stock_status: 'true',
      image: null
    }));
  };

  useEffect(() => {
    if (pData && pData?.variants) {
      setCombinations(pData?.variants);

      // Set up image previews for existing images
      const previews: { [key: number]: string } = {};
      pData.variants.forEach((variant: any, index: number) => {
        if (variant.image && typeof variant.image === 'string') {
          previews[index] = variant.image;
        }
      });
      setImagePreviews(previews);
    } else {
      const newCombinations = generateCombinations(newAttributes);
      setCombinations(newCombinations);
      onVariationsChange(newCombinations);
    }
  }, [newAttributes, pData]);

  // Handle input change and send updated variations data to the parent
  const handleFieldChange = (index: number, field: string, value: any) => {
    const updatedCombinations = [...combinations];
    // Convert stock_status string values to boolean
    if (field === 'stock_status') {
      updatedCombinations[index] = {
        ...updatedCombinations[index],
        [field]: value === 'true' || value === true
      };
    } else {
      updatedCombinations[index] = {
        ...updatedCombinations[index],
        [field]: value
      };
    }
    // updatedCombinations[index] = {
    //   ...updatedCombinations[index],
    //   [field]: value
    // };
    setCombinations(updatedCombinations);
    // Extract only the _id from the values
    const combinationsWithIds = updatedCombinations.map((combination) => ({
      ...combination,
      values: combination.values.map((value: any) => value._id)
    }));
    onVariationsChange(combinationsWithIds);
  };

  const handleImageUpload = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [index]: previewUrl
      }));

      handleFieldChange(index, 'image', file);
    }
  };

  const removeImage = (index: number) => {
    // Remove image from combination and preview
    const updatedCombinations = [...combinations];
    updatedCombinations[index] = {
      ...updatedCombinations[index],
      image: null
    };
    setCombinations(updatedCombinations);

    // Remove preview
    const updatedPreviews = { ...imagePreviews };
    delete updatedPreviews[index];
    setImagePreviews(updatedPreviews);

    // Update parent
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
                        />

                        {(stockmanagemet === 'variable_level' ||
                          pData?.stockManagement?.stock_management_level.trim() ===
                            'variable_level') && (
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
                            />
                            <div className="d-flex">
                              <h6>Stock status*</h6>
                              <select
                                className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900"
                                name={`combinations[${index}].stock_status`}
                                value={
                                  combination.stock_status ? 'true' : 'false'
                                }
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    'stock_status',
                                    e.target.value === 'true'
                                  )
                                }
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
                        />
                      </div>

                      {/* Image Uploader with Preview */}
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Image
                        </label>

                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            className="file:bg-black-100 hover:file:bg-black-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-500"
                            onChange={(e) => handleImageUpload(index, e)}
                          />

                          {imagePreviews[index] && (
                            <div className="relative">
                              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                <img
                                  src={imagePreviews[index]}
                                  alt="Variation preview"
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  className="absolute right-0 top-0 rounded-bl-md bg-red-500 p-1 text-white"
                                  onClick={() => removeImage(index)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
