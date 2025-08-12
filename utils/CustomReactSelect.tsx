import { debounce } from 'lodash';
import React, { useState, useCallback } from 'react';
import ReactSelect from 'react-select';

interface CustomReactSelectProps {
  label?: string;
  placeholder?: string;
  value?: any; // Adjust type if necessary
  options?: any[];
  isMulti?: boolean;
  isLoading?: boolean;
  className?: string;
  errorMsg?: string;
  onInputChange?: (inputValue: string) => void; // Handles debounced input
  onChange?: (selectedOption: any) => void;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;
}

const CustomReactSelect: React.FC<CustomReactSelectProps> = ({
  label,
  placeholder = 'Select...',
  value,
  options = [],
  isMulti = false,
  isLoading = false,
  className,
  errorMsg,
  onInputChange,
  onChange,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value
}) => {
  const [searchQuery, setSearchQuery] = useState('');


  // Debounced input handler
  const debouncedInputChange = useCallback(
    debounce((inputValue: string) => {
      if (onInputChange) {
        onInputChange(inputValue);
      }
    }, 800),
    [onInputChange]
  );

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    debouncedInputChange(inputValue);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <ReactSelect
        options={options}
        isMulti={isMulti}
        isLoading={isLoading}
        placeholder={placeholder}
        onInputChange={handleInputChange}
        onChange={onChange}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        value={value}
      />
      {errorMsg && <span className="text-sm text-red-500">{errorMsg}</span>}
    </div>
  );
};

export default CustomReactSelect;
