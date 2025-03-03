'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  addEditPromoCode,
  IPromoCode,
  updatePromoCodeData
} from '@/redux/slices/promocodeSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  STATUS_OPTIONS,
  usePromoCodeTableFilters
} from './use-promo-table-filters';
import { Button } from '@/components/ui/button';

export default function PromoCodeTable({
  data,
  totalData,
  handleSearch
}: {
  data: IPromoCode[];
  totalData: number;
  handleSearch: any;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    statusFilter,
    setStatusFilter,
    setPage,
    setSearchQuery
  } = usePromoCodeTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<IPromoCode>[] = [
    {
      id: 'number',
      header: 'S.No.',
      cell: ({ row, table }) => {
        const currentPage = table.getState().pagination.pageIndex; // Current page index
        const pageSize = table.getState().pagination.pageSize; // Number of items per page
        return <span>{currentPage * pageSize + row.index + 1}</span>; // Calculate correct S.No
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'select',
      header: ({ table }) =>
        // <Checkbox
        //   checked={table.getIsAllPageRowsSelected()}
        //   onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //   aria-label="Select all"
        // />
        '',
      cell: ({ row }) =>
        // <Checkbox
        //   checked={row.getIsSelected()}
        //   onCheckedChange={(value) => row.toggleSelected(!!value)}
        //   aria-label="Select row"
        // />
        '',
      enableSorting: false,
      enableHiding: false
    },

    {
      accessorKey: 'promocode',
      header: 'PROMOCODE'
    },

    {
      accessorKey: 'minamount',
      header: 'MINIMUM AMOUNT'
    },
    {
      accessorKey: 'maxamount',
      header: 'MAXIMUM AMOUNT'
    },
    {
      accessorKey: 'promocodetype',
      header: 'PROMOCODE TYPE'
    },
    {
      accessorKey: 'promocodevalue',
      header: 'PROMOCODE VALUE'
    },
    {
      accessorKey: 'upto',
      header: 'UPTO '
    },
    {
      accessorKey: 'startdate',
      header: 'START DATE'
    },
    {
      accessorKey: 'enddate',
      header: 'END DATE'
    },
    {
      accessorKey: 'minnooftotaluses',
      header: 'MINIMUM NO. OF TOTAL USES'
    },

    {
      accessorKey: 'noofperuser',
      header: 'NO OF LIMITS PER USER'
    },

    {
      accessorKey: 'users',
      header: 'USERS'
    },
    // {
    //   accessorKey: 'multipleusers',
    //   header: 'MULTIPLE USERS'
    // },

    {
      accessorKey: 'status',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, status: checked };
          try {
            dispatch(updatePromoCodeData(updatedData));
            const result = await dispatch(
              addEditPromoCode(row.original._id || null)
            ).unwrap();
            toast.success('Status Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating brand status:', error);
            toast.error('Failed to Update Status');
          }
        };

        return (
          <Switch
            checked={row.original.status}
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
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        {/* <DataTableSearch
          searchKey="rate"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}

        <DataTableFilterBox
          filterKey="status"
          title="Filter By Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
