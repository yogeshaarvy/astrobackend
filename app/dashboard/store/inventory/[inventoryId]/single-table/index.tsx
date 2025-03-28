'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { IInventory } from '@/redux/slices/inventoriesSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ProductInventoryTable({
  data,
  totalData,
  handleSearch,
  setStartDate,
  setEndDate,
  startDate,
  endDate
}: {
  data: IInventory[];
  totalData: number;
  handleSearch: any;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  startDate: any;
  endDate: any;
}) {
  const columns: ColumnDef<IInventory>[] = [
    {
      accessorKey: 'createdAt',
      header: 'CREATED AT',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString()
    },
    {
      accessorKey: 'value',
      header: 'STOCK',
      cell: ({ row }) => {
        const stockValue = row.original.value;
        const isCredit = row.original.type.toLowerCase() === 'credit';

        return (
          <span className={isCredit ? 'text-red-500' : 'text-green-500'}>
            {isCredit ? `-${stockValue}` : `+${stockValue}`}
          </span>
        );
      }
    },
    {
      accessorKey: 'current_stock',
      header: 'CURRENT STOCK'
    },

    {
      accessorKey: 'message',
      header: 'MESSAGE'
    }
  ];

  const handleSearchWithDates = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    handleSearch(startDate, endDate);
  };

  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DatePicker
          selected={startDate}
          onChange={(date: any) => {
            setStartDate(date);
          }}
          placeholderText="Start Date"
          className="rounded border p-2"
        />
        <DatePicker
          selected={endDate}
          onChange={(date: any) => {
            setEndDate(date);
          }}
          placeholderText="End Date"
          className="rounded border p-2"
        />
        <Button variant="outline" onClick={handleSearchWithDates}>
          Search
        </Button>
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
