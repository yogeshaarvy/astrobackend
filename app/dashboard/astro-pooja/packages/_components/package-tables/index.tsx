import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch } from '@/redux/hooks';
import { Checkbox } from '@radix-ui/react-checkbox';
import { toast } from 'sonner';
import { CellAction } from './cell-action';
import { Switch } from '@/components/ui/switch';
import {
  FIELD_OPTIONS,
  STATUS_OPTIONS,
  useCategoryTableFilters
} from './use-package-table-filters';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { IAstroPackage } from '@/redux/slices/astropooja/packageSlice';

export default function AstroPackageTable({
  data,
  totalData,
  handleSearch
}: {
  data: IAstroPackage[];
  totalData: number;
  handleSearch: any;
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
  } = useCategoryTableFilters();

  const columns: ColumnDef<IAstroPackage>[] = [
    {
      accessorKey: 'title.en',
      header: 'TITLE',
      size: 500,
      maxSize: 700
    },
    {
      accessorKey: 'description.en',
      header: 'DESCRIPTION',
      size: 500,
      maxSize: 700
    },
    {
      accessorKey: 'price',
      header: 'PRICE',
      size: 500,
      maxSize: 700
    },

    {
      header: 'ACTIONS',
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];

  return (
    <div className="space-y-4">
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
          setFilterValue={setActiveFilter}
          filterValue={activeFilter}
        />
        <Button variant="default" onClick={handleSearch}>
          Search
        </Button>
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={data} totalItems={totalData} />
      </div>
    </div>
  );
}
