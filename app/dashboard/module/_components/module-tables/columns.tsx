'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { IEmployee } from '@/redux/slices/employeeSlice';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { addEditModule, updateModuleData } from '@/redux/slices/moduleSlice';
import { useAppDispatch } from '@/redux/hooks';

export const columns: ColumnDef<IEmployee>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />;
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'active',
    header: 'ACTIVE',
    cell: ({ row }) => {
      // const dispatch = useAppDispatch();
      // const handleToggle = async (checked: boolean) => {
      //   const updatedData = { ...row.original, active: checked };
      //   try {
      //     dispatch(updateModuleData(updatedData));
      //     const result = await dispatch(
      //       addEditModule(row.original._id || null)
      //     ).unwrap();
      //     toast.success('Status updated successfully!');
      //   } catch (error) {
      //     console.error('Error updating active status:', error);
      //     toast.error('Failed to update status.');
      //   }
      // };

      return (
        <Switch
          checked={row.original.active}
          // onCheckedChange={handleToggle} // Call handleToggle on change
          aria-label="Toggle Active Status"
        />
      );
    }
  },
  {
    header: 'ACTIONS',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
