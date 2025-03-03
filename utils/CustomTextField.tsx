import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FieldValues, FieldPath, Control } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

interface CustomTextFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  value?: string | number;
  type?: string;
  multiple?: boolean;
  className?: string;
  errorMsg?: string;
  disabled?: boolean; // New prop to disable the field

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CustomTextField = <TFieldValues extends FieldValues>({
  name,
  control,
  multiple = false,
  value,
  label,
  placeholder = '',
  type = 'text',
  className,
  errorMsg,
  onChange,
  disabled = false
}: CustomTextFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {multiple ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                value={value}
                disabled={disabled} // Disable the field if required
                className={`textarea-class ${className}`}
                rows={4}
                onChange={(e) => {
                  field.onChange(e);
                  if (onChange) onChange(e);
                }}
              />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                type={type}
                value={value}
                className={className}
                disabled={disabled} // Disable the field if required
                onChange={(e) => {
                  field.onChange(e);
                  if (onChange) onChange(e);
                }}
              />
            )}
          </FormControl>
          {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default CustomTextField;
