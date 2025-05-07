'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { fetchTypesList } from '@/redux/slices/store/filtersSlice';
import { fetchValuesList } from '@/redux/slices/store/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomReactSelect from '@/utils/CustomReactSelect';
import { debounce } from 'lodash';
import { saveAttributes, loadAttributes } from '@/redux/slices/attributesSlice'; // Import actions
import { toast } from 'sonner';

interface AttributesFormProps {
  onSaveAttributes: any;
  pData: any;
}

const AttributesForm: React.FC<AttributesFormProps> = ({
  onSaveAttributes,
  pData
}) => {
  const {
    typesListState: { loading: typesListLoading, data: tData = [] }
  } = useAppSelector((state) => state.filter);
  const {
    valuesListState: { loading: valuesListLoading, data: vData = [] }
  } = useAppSelector((state) => state.filter);
  console.log('t data is ', tData);
  console.log('v data is ', vData);
  console.log('p data is ', pData);
  const savedAttributes = useAppSelector(
    (state) => state?.attributesSlice?.data
  ); // Get saved attributes from Redux store
  const [attributes, setAttributes] = useState<
    { type: any; values: string[] }[]
  >(savedAttributes || []);
  console.log('attributes...........', attributes);

  const [typesQuery, setTypesQuery] = useState<string>('');
  const dispatch = useAppDispatch();
  const page = 1;
  const pageSize = 100000;

  useEffect(() => {
    if (!savedAttributes) {
      dispatch(loadAttributes()); // Load attributes from Redux store
    }
  }, [dispatch, savedAttributes]);

  const debouncedSearchTypes = useCallback(
    debounce((query) => {
      dispatch(
        fetchTypesList({
          page,
          pageSize,
          keyword: query,
          field: 'name',
          status: '',
          exportData: 'true'
        })
      );
    }, 800),
    [dispatch]
  );

  const handleSearchTypes = (query: string) => {
    setTypesQuery(query);
    debouncedSearchTypes(query);
  };

  // Filter out already selected type
  const getFilteredTypesOptions = () => {
    const selectedTypes = attributes.map((attr) => attr.type._id);
    return tData.filter((type) => !selectedTypes.includes(type._id));
  };

  const handleAddAttributes = () => {
    setAttributes((prev) => [...prev, { type: '', values: [] }]);
  };

  const handleTypeChange = (index: number, selectedTypes: any) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, type: selectedTypes, values: [] } : attr
      )
    );

    if (selectedTypes) {
      dispatch(
        fetchValuesList({
          page,
          pageSize,
          keyword: '',
          field: '',
          status: '',
          exportData: 'true',
          filterByTypes: selectedTypes?._id
        })
      );
    }
  };

  const handleValueChange = (index: number, selectedValues: string[]) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, values: selectedValues } : attr
      )
    );
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAttributes = () => {
    toast.success('Attributes Saved successfully');
    onSaveAttributes(attributes);
    dispatch(saveAttributes(attributes)); // Save attributes to Redux store
  };

  useEffect(() => {
    if (pData?.attributes) {
      setAttributes(pData?.attributes);
    }
  }, [pData]);

  return (
    <div className="mb-5 pb-5">
      {/* {!pData.attributes && ( */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {attributes.length > 0 && (
          <button
            type="button" // Add this line
            onClick={handleSaveAttributes}
            className="my-3 me-4 rounded border border-blue-500 bg-transparent px-4 text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          >
            Save Attributes
          </button>
        )}
        <button
          type="button" // Add this line
          onClick={handleAddAttributes}
          className="my-3 me-4 rounded border border-blue-500 bg-transparent px-4 text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
        >
          Add Attribute
        </button>
      </div>
      {/* )} */}
      {attributes?.length === 0 ? (
        <div className="text-md border-black-1000 border bg-gray-100 p-3 text-center font-medium font-semibold">
          No Product Attributes Are Added!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 border border-black p-4 md:grid-cols-1">
          {attributes?.map((attribute, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <CustomReactSelect
                options={tData}
                label="Types"
                getOptionLabel={(option) => option?.name?.en}
                getOptionValue={(option) => option._id}
                placeholder="Select Types"
                onInputChange={handleSearchTypes}
                onChange={(selectedOption: any) =>
                  handleTypeChange(index, selectedOption)
                }
                value={attribute?.type || []}
                // isDisabled={!!pData} // Disable field if pData is present
              />
              <CustomReactSelect
                options={vData}
                isMulti
                label="Values"
                getOptionLabel={(option) => option?.short_name?.en}
                getOptionValue={(option) => option._id}
                placeholder="Select Values"
                onChange={(e: any) => handleValueChange(index, e)}
                value={attribute.values || []}
                // isDisabled={!!pData} // Disable field if pData is present
              />
              <div
                onClick={() => handleRemoveAttribute(index)}
                className={`cursor-pointer text-red-500 hover:text-red-700 ${
                  !!pData ? 'cursor-not-allowed' : ''
                }`}
                style={{
                  fontSize: '21px',
                  marginTop: '35px',
                  textAlign: 'start'
                }}
              >
                ✖
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttributesForm;
