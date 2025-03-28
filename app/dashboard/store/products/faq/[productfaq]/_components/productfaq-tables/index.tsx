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
  useFaqTableFilters
} from './use-faq-table-filters';
import { Button } from '@/components/ui/button';
import { ISliders } from '@/redux/slices/slidersSlice';
import { updateSlidersData, addEditSliders } from '@/redux/slices/slidersSlice';
import { CellAction } from '@/app/dashboard/products/faq/[productfaq]/_components/productfaq-tables/cell-action';
import { addEditFaq, IFaq, updateFaqData } from '@/redux/slices/faqSlice';
import {
  addEditproductFaq,
  IProductFaq,
  updateproductFaqData
} from '@/redux/slices/productFaqSlice';

export default function ProductFaqTable({
  data,
  totalData,
  handleSearch
}: {
  data: IProductFaq[];
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
  } = useFaqTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<IProductFaq>[] = [
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
      accessorKey: 'sequence',
      header: 'SEQUENCE NUMBER'
    },
    {
      accessorKey: 'question',
      header: 'QUESTIONS'
    },
    {
      accessorKey: 'answer',
      header: 'ANSWERS'
    },
    {
      accessorKey: 'status',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, status: checked };
          try {
            dispatch(updateproductFaqData(updatedData));
            const result = await dispatch(
              addEditproductFaq(row.original._id || null)
            ).unwrap();
            toast.success('Faq Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating faq status:', error);
            toast.error('Failed to Update Faq');
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
      accessorKey: 'action',
      header: 'ACTIONS',
      cell: ({ row }) => <CellAction data={row.original} />
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
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
