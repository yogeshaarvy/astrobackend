import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch } from '@/redux/hooks';
import {
  addEditCourse,
  ICourse,
  updateCourseData
} from '@/redux/slices/courseSlice';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { CellAction } from './call-action';

export const columns: ColumnDef<ICourse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
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
    accessorKey: 'web_eng_title',
    header: 'Title'
  },
  {
    accessorKey: 'web_eng_text',
    header: 'Text'
  },
  {
    accessorKey: 'active',
    header: 'ACTIVE',
    cell: ({ row }) => {
      // const dispatch = useAppDispatch();
      // const handleToggle = async (checked: boolean) => {
      //   const updatedData = { ...row.original, active: checked };
      //   try {
      //     dispatch(updateCourseData(updatedData));
      //     const result = await dispatch(
      //       addEditCourse(row.original._id || null)
      //     ).unwrap();
      //     toast.success(`Status Updated Successfully!`);
      //   } catch (error: any) {
      //     console.error('Error updating active status:', error);
      //     toast.error('failed to update Status');
      //   }
      // };
      return (
        <Switch
          checked={row.original.active}
          // onCheckedChange={handleToggle}
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
