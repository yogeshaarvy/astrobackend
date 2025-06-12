'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { ColumnDef } from '@tanstack/react-table';

import {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  useRequestTableFilters
} from './use-requested-table-filters';
import { Button } from '@/components/ui/button';
import {
  addEditRequest,
  IRequest,
  updateRequestData
} from '@/redux/slices/astrologer_requestsSlice';
import RequestStatusSelect from './RequestStatusSelect';
import { CellAction } from './cell-action';

export default function RequestTable({
  data,
  totalData,
  handleSearch
}: {
  data: IRequest[];
  totalData: number;
  handleSearch: any;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    statusFilter,
    setStatusFilter,
    fieldFilter,
    setFieldFilter,
    setPage,
    setSearchQuery
  } = useRequestTableFilters();

  const columns: ColumnDef<IRequest>[] = [
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
      accessorKey: 'image',
      header: 'IMAGE',
      cell: ({ row }) => {
        const imageUrl = row.original.image;

        return imageUrl ? (
          <img
            src={imageUrl}
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">No Image</span>
        );
      }
    },
    {
      accessorKey: 'name',
      header: ' NAME'
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
      accessorKey: 'phoneType',
      header: 'PHONE TYPE'
    },
    {
      accessorKey: 'gender',
      header: 'GENDER'
    },
    {
      accessorKey: 'languages',
      header: 'LANGUAGE'
    },

    {
      accessorKey: 'skills',
      header: 'SKILL'
    },
    {
      accessorKey: 'dob',
      header: 'DOB',
      cell: ({ row }) => {
        const date = new Date(row.original.dob ?? '');
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
    },
    {
      accessorKey: 'status',
      header: 'REQUEST STATUS',
      cell: ({ row }) => <RequestStatusSelect request={row.original} />
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
        <DataTableFilterBox
          filterKey="field"
          title="Filter By Field"
          options={FIELD_OPTIONS}
          setFilterValue={setFieldFilter}
          filterValue={fieldFilter}
        />

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
