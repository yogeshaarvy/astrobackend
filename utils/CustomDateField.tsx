'use client';
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

interface CustomDateFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  value?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  errorMsg?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomDateField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = '',
  value,
  minDate,
  maxDate,
  className,
  errorMsg,
  onChange
}: CustomDateFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type="date"
              value={value}
              min={minDate}
              max={maxDate}
              className={className}
              onChange={(e) => {
                field.onChange(e);
                if (onChange) onChange(e);
              }}
            />
          </FormControl>
          {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default CustomDateField;
