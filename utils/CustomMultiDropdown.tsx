'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/buttonformultiselect';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomMultiDropdownProps {
  name: string;
  title: string;
  options: FilterOption[];
  value: string[]; // Array of selected values
  onChange: (value: string[]) => void; // Function to handle value changes
}

export function CustomMultiDropdown({
  name,
  title,
  options,
  value,
  onChange
}: CustomMultiDropdownProps) {
  const selectedValuesSet = React.useMemo(() => new Set(value), [value]);

  const handleSelect = (optionValue: string) => {
    const newSet = new Set(selectedValuesSet);
    if (newSet.has(optionValue)) {
      newSet.delete(optionValue);
    } else {
      newSet.add(optionValue);
    }
    const newValues = Array.from(newSet);
    onChange(newValues);
  };

  const clearSelection = () => onChange([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h6 className="display-6 mb-2 font-normal">Select {name}</h6>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-dashed">
            {selectedValuesSet.size > 0 ? (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValuesSet.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValuesSet.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValuesSet.size} selected
                    </Badge>
                  ) : (
                    Array.from(selectedValuesSet).map((val) => (
                      <Badge
                        key={val}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {options.find((opt) => opt.value === val)?.label || val}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            ) : (
              `Select ${name}`
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${title}`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => handleSelect(opt.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedValuesSet.has(opt.value)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    {opt.icon && (
                      <opt.icon
                        className="mr-2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span>{opt.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selectedValuesSet.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={clearSelection}
                      className="justify-center text-center"
                    >
                      Clear Selection
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
