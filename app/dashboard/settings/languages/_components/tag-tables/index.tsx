'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  addEditLanguageData,
  ILanguageData,
  updateLanguageData
} from '@/redux/slices/languageDataSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { STATUS_OPTIONS, useTagTableFilters } from './use-tag-table-filters';
import { Button } from '@/components/ui/button';

export default function TagTable({
  data,
  totalData,
  handleSearch
}: {
  data: ILanguageData[];
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
  } = useTagTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<ILanguageData>[] = [
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
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          try {
            dispatch(updateLanguageData(updatedData));
            const result = await dispatch(
              addEditLanguageData(row.original._id || null)
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
