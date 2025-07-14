import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FieldValues, FieldPath, Control } from 'react-hook-form';

interface CustomRadioSelectorProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  className?: string;
  onChange?: (event: { name: string; value: string; type: string }) => void;
}

const CustomRadioSelector = <TFieldValues extends FieldValues>({
  name,
  value,
  control,
  label,
  options,
  className,
  onChange
}: CustomRadioSelectorProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`space-y-3 ${className}`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value); // Sync with form state
                if (onChange) {
                  onChange({ name, value, type: 'radio' });
                }
              }}
              value={value || field.value}
              className="flex space-x-4"
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomRadioSelector;
