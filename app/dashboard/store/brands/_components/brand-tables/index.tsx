'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  addEditBrand,
  IBrand,
  updateBrandData
} from '@/redux/slices/brandSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  FIELD_OPTIONS,
  STATUS_OPTIONS,
  useBrandTableFilters
} from './use-brand-table-filters';
import { Button } from '@/components/ui/button';

export default function BrandTable({
  data,
  totalData,
  handleSearch
}: {
  data: IBrand[];
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
  } = useBrandTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<IBrand>[] = [
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
      accessorKey: 'name',
      header: 'NAME'
    },
    {
      accessorKey: 'sequence',
      header: 'SEQUENCE'
    },
    {
      accessorKey: 'meta_title',
      header: 'META TITLE'
    },
    {
      accessorKey: 'meta_tag',
      header: 'META TAG'
    },

    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          try {
            dispatch(updateBrandData(updatedData));
            const result = await dispatch(
              addEditBrand(row.original._id || null)
            ).unwrap();
            toast.success('Status Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating brand status:', error);
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
