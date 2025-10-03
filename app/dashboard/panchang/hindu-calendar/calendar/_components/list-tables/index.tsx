import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { CellAction } from './cell-action';
import { Switch } from '@/components/ui/switch';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import {
  FIELD_OPTIONS,
  STATUS_OPTIONS,
  useListTableFilters
} from './use-lists-table-filters';
import {
  ICalendar,
  updateEventCalendarListData,
  addEditEventCalendarList
} from '@/redux/slices/calendar';

export default function EventListTable({
  data,
  totalData
}: {
  data: ICalendar[];
  totalData: number;
}) {
  const dispatch = useAppDispatch();
  const {
    fieldFilter,
    setFieldFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    activeFilter,
    setActiveFilter,
    setPage,
    setSearchQuery
  } = useListTableFilters();

  const columns: ColumnDef<ICalendar>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 500,
      maxSize: 700
    },
    {
      accessorKey: 'startDateTime',
      header: () => (
        <div className="flex flex-col">
          <span className="font-medium">Start Date</span>
          {/* <span className="text-sm text-muted-foreground">Start Time</span> */}
        </div>
      ),
      cell: ({ row }) => {
        const dateTime = new Date(row.getValue('startDateTime'));
        const date = dateTime.toISOString().split('T')[0];

        // // Format time with AM/PM
        // let hours = dateTime.getHours();
        // const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        // const ampm = hours >= 12 ? 'PM' : 'AM';

        // // Convert 24-hour to 12-hour format
        // hours = hours % 12;
        // hours = hours ? hours : 12;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{date}</span>
            {/* <span className="text-sm text-muted-foreground">
              {hours}:{minutes} {ampm}
            </span> */}
          </div>
        );
      }
    },
    {
      accessorKey: 'endDateTime',
      header: () => (
        <div className="flex flex-col">
          <span className="font-medium">End Date</span>
          {/* <span className="text-sm text-muted-foreground">End Time</span> */}
        </div>
      ),
      cell: ({ row }) => {
        const dateTime = new Date(row.getValue('endDateTime'));
        const date = dateTime.toISOString().split('T')[0];

        // Format time with AM/PM
        // let hours = dateTime.getHours();
        // const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        // const ampm = hours >= 12 ? 'PM' : 'AM';

        // // Convert 24-hour to 12-hour format
        // hours = hours % 12;
        // hours = hours ? hours : 12;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{date}</span>
            {/* <span className="text-sm text-muted-foreground">
              {hours}:{minutes} {ampm}
            </span> */}
          </div>
        );
      }
    },
    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          try {
            dispatch(updateEventCalendarListData(updatedData));
            const result = await dispatch(
              addEditEventCalendarList(row.original._id || null)
            ).unwrap();
            toast.success('Status Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating active status:', error);
            toast.error('Failed to Update Status');
          }
        };

        return (
          <Switch
            checked={row.original.active}
            onCheckedChange={handleToggle}
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

  return (
    <div className="space-y-4">
      <div className="w-full">
        <DataTable columns={columns} data={data} totalItems={totalData} />
      </div>
    </div>
  );
}
