'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { ColumnDef } from '@tanstack/react-table';
// import { CellAction } from './cell-action';

import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  useAllUsersFilters
} from './use-newsletter-table-filters';
import { Button } from '@/components/ui/button';

import {
  IAllUsers,
  updateUserActiveStatus
} from '@/redux/slices/allusersSlice';

export default function AllusersTable({
  data,
  totalData,
  handleSearch
}: {
  data: IAllUsers[];
  totalData: number;
  handleSearch: any;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    fieldFilter,
    setFieldFilter,
    searchQuery,
    statusFilter,
    setStatusFilter,
    setPage,
    setSearchQuery
  } = useAllUsersFilters();
  const dispatch = useAppDispatch();

  // const columns: ColumnDef<IAllUsers>[] = [
  //   {
  //     id: 'number',
  //     header: 'S.No.',
  //     cell: ({ row, table }) => {
  //       const currentPage = table.getState().pagination.pageIndex; // Current page index
  //       const pageSize = table.getState().pagination.pageSize; // Number of items per page
  //       return <span>{currentPage * pageSize + row.index + 1}</span>; // Calculate correct S.No
  //       // return <p>this is demo</p>
  //     },
  //     enableSorting: false,
  //     enableHiding: false
  //   },
  //   {
  //     id: 'select',
  //     header: ({ table }) =>
  //       // <Checkbox
  //       //   checked={table.getIsAllPageRowsSelected()}
  //       //   onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       //   aria-label="Select all"
  //       // />
  //       '',
  //     cell: ({ row }) =>
  //       // <Checkbox
  //       //   checked={row.getIsSelected()}
  //       //   onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       //   aria-label="Select row"
  //       // />
  //       '',
  //     enableSorting: false,
  //     enableHiding: false
  //   },
  //   {
  //     accessorKey: 'name',
  //     header: 'NAME'
  //   },

  //   {
  //     accessorKey: 'email',
  //     header: 'EMAIL'
  //   },
  //   {
  //     accessorKey: 'phone',
  //     header: 'PHONE'
  //   }
  // ];
  const columns: ColumnDef<IAllUsers>[] = [
    {
      id: 'number',
      header: 'S.No.',
      cell: ({ row, table }) => {
        const currentPage = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span>{currentPage * pageSize + row.index + 1}</span>;
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: 'NAME'
    },
    {
      accessorKey: 'email',
      header: 'EMAIL'
    },
    {
      accessorKey: 'phone',
      header: 'PHONE'
    },
    {
      accessorKey: 'active',
      header: 'STATUS',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Switch
            checked={user.active}
            onCheckedChange={(value) => {
              dispatch(
                updateUserActiveStatus({
                  userId: user._id,
                  active: value
                })
              );
            }}
          />
        );
      }
    }
  ];

  {
  }
  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="field"
          title="Filetr By Field"
          options={FIELD_OPTIONS}
          setFilterValue={setFieldFilter}
          filterValue={fieldFilter}
        />
        {/* <DataTableFilterBox
          filterKey="active"
          title="Filter By Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        /> */}
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
