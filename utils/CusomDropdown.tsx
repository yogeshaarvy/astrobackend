import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { FieldValues, FieldPath, Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface CustomDropdownProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string; // Placeholder for the dropdown
  value?: string | boolean; // Current value of the dropdown
  defaultValue?: any; // Default value for the dropdown
  data?: any[]; // Data for dropdown options
  type?: string;
  className?: string;
  errorMsg?: string;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (e: { name: string; value: string; type: string }) => void;
}

const CustomDropdown = <TFieldValues extends FieldValues>({
  name,
  control,
  value,
  label,
  placeholder,
  defaultValue,
  data,
  className,
  errorMsg,
  onChange,
  disabled = false,
  loading = false
}: CustomDropdownProps<TFieldValues>) => {
  if (disabled) {
    // If disabled, render only the label and the selected value (read-only view)
    const selectedItem = data?.find((item) => item._id === value);

    return (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <div className="rounded-md border bg-gray-100 px-4 py-2 text-gray-600">
          {selectedItem?.name || placeholder || 'No option selected'}
        </div>
        {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
      </FormItem>
    );
  }
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(selectedValue) => {
              // Find the full object based on selectedValue
              const selectedItem = data?.find(
                (item) => item._id === selectedValue
              );

              field.onChange(selectedValue); // Update the form state
              if (onChange) {
                onChange({
                  name,
                  value: selectedValue,
                  type: 'select'
                });
              }
            }}
            value={value || field.value || defaultValue || undefined} // Prioritize props, then form state, then defaultValue
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || 'Select an option'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {placeholder && (
                <SelectItem value="" disabled>
                  {placeholder} {/* Display placeholder as a disabled option */}
                </SelectItem>
              )}
              {data &&
                Array.isArray(data) &&
                data.map((item) => (
                  <SelectItem value={item._id} key={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default CustomDropdown;
