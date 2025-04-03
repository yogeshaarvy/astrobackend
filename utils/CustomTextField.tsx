import React from 'react';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CustomTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  value?: any;
  type?: string;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  required?: boolean;
  errorMsg?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CustomTextField = ({
  name,
  multiple = false,
  value,
  label,
  disabled,
  placeholder = '',
  type = 'text',
  className,
  required = false,
  errorMsg,
  onChange
}: CustomTextFieldProps) => {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {'    '}
        {required && <span className="text-red-600">*</span>}
      </FormLabel>
      <FormControl>
        {multiple ? (
          <Textarea
            name={name}
            placeholder={placeholder}
            value={value}
            className={`textarea-class ${className}`}
            rows={4}
            onChange={(e) => {
              if (onChange) onChange(e);
            }}
          />
        ) : (
          <Input
            name={name}
            placeholder={placeholder}
            type={type}
            value={value}
            className={className}
            onChange={(e) => {
              if (onChange) onChange(e);
            }}
          />
        )}
      </FormControl>
      {errorMsg && <FormMessage>{errorMsg}</FormMessage>}
    </FormItem>
  );
};

export default CustomTextField;
