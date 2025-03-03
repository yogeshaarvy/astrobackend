import { Checkbox } from '@/components/ui/checkbox';
import { IEvent } from '@/redux/slices/eventSlice';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

export const columns: ColumnDef<IEvent>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    header: 'ACTIONS',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
