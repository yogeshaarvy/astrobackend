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
  control?: Control<TFieldValues>;
  label: string;
  placeholder?: string; // Placeholder for the dropdown
  value?: any; // Current value of the dropdown
  defaultValue?: string | boolean; // Default value for the dropdown
  data?: any[]; // Data for dropdown options
  type?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  errorMsg?: string;
  loading?: boolean;
  onChange?: (e: { name: string; value: string; type: string }) => void;
}

const CustomDropdown = <TFieldValues extends FieldValues>({
  name,
  control,
  value,
  disabled,
  label,
  placeholder = '',
  defaultValue,
  data,
  required,
  className,
  errorMsg,
  onChange,
  loading = false
}: CustomDropdownProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {'  '}
            {required && <span className="text-red-600"> *</span>}
          </FormLabel>
          <Select
            onValueChange={(selectedValue) => {
              field.onChange(selectedValue);
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
                    {item.name || item.title}
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
