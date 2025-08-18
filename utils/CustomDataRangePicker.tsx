'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultRange?: DateRange;
  minDate?: Date;
  maxDate?: Date;
  onDateChange?: (range: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  defaultRange = {
    from: new Date(),
    to: addDays(new Date(), 7)
  },
  minDate,
  maxDate,
  onDateChange
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(defaultRange);

  const handleSelect = (range: DateRange | undefined) => {
    // Optional: Add validation for minDate and maxDate
    if (range?.from && minDate && range.from < minDate) return;
    if (range?.to && maxDate && range.to > maxDate) return;

    setDate(range);
    if (onDateChange) onDateChange(range);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
