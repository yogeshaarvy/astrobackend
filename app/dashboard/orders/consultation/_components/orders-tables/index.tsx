'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CellAction } from './cell-action';
import { IConsultationsOrdersList } from '@/redux/slices/consultations/consultationsOrdersSlice';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  FIELD_OPTIONS,
  STATUS_OPTIONS,
  useConsultationsOrdersTableFilters
} from './use-allorders-table-filters';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';

export default function AllOrdersTable({
  data,
  totalData,
  handleSearch
}: {
  data: IConsultationsOrdersList[];
  totalData: number;
  handleSearch: any;
}) {
  const {
    fieldFilter,
    setFieldFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    statusFilter,
    setStatusFilter,
    setPage,
    setSearchQuery
  } = useConsultationsOrdersTableFilters();

  const columns: ColumnDef<IConsultationsOrdersList>[] = [
    {
      id: 'number',
      header: 'S.No.',
      cell: ({ row, table }) => {
        const currentPage = table.getState().pagination.pageIndex; // Current page index
        const pageSize = table.getState().pagination.pageSize; // Number of items per page
        return <span>{currentPage * pageSize + row.index + 1}</span>; // Calculate correct S.No
      },
      size: 100,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'orderId',
      header: 'Order ID'
    },
    {
      accessorKey: 'user.email',
      header: 'User Email'
    },
    {
      accessorKey: 'astroId.email',
      header: 'Astrologer Email'
    },
    {
      id: 'bookedDate',
      accessorKey: 'bookedDate',
      header: 'Booked Date'
    },
    {
      accessorKey: 'bookedTime',
      header: 'Booked Time'
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status'
    },
    {
      accessorKey: 'transaction_details.transaction_amount',
      header: 'Total Amount'
    },
    {
      accessorKey: 'action',
      header: 'VIEW DETAILS',
      cell: ({ row }) => {
        return <CellAction data={row.original} />;
      }
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
          title="Filetr By Field"
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
