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
  useContactsTableFilters
} from './use-newsletter-table-filters';
import { Button } from '@/components/ui/button';
import { ISliders } from '@/redux/slices/slidersSlice';
import { updateSlidersData, addEditSliders } from '@/redux/slices/slidersSlice';
// import { CellAction } from '@/app/dashboard/home/about/_components/about-tables/cell-action';
import { addEditFaq, IFaq, updateFaqData } from '@/redux/slices/faqSlice';
import {
  addEditHomeAboutList,
  IHomeAboutList,
  updateHomeAboutListData
} from '@/redux/slices/homeaboutlistSlice';
import { IContactUs } from '@/redux/slices/contact/contactSlice';

export default function ContactsTable({
  data,
  totalData,
  handleSearch
}: {
  data: IContactUs[];
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
  } = useContactsTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<IContactUs>[] = [
    {
      id: 'number',
      header: 'S.No.',
      cell: ({ row, table }) => {
        const currentPage = table.getState().pagination.pageIndex; // Current page index
        const pageSize = table.getState().pagination.pageSize; // Number of items per page
        return <span>{currentPage * pageSize + row.index + 1}</span>; // Calculate correct S.No
        // return <p>this is demo</p>
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
      accessorKey: 'email',
      header: 'EMAIL'
    },
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'message',
      header: 'Message'
    }
  ];
  {
  }
  return (
    <div className="space-y-4 ">
      {/* <div className="flex flex-wrap items-center gap-4">
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
          filterKey="active"
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
      </div> */}
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
