import { DataTable } from '@/components/ui/table/data-table';
import {
  addEditBlogsCategory,
  IBlogsCategory,
  updateBlogsCategoryData
} from '@/redux/slices/pages/bloges/categorySlice';
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
} from './use-category-table-filters';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';

export default function BlogsCategoryTable({
  data,
  totalData,
  handleSearch
}: {
  data: IBlogsCategory[];
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

  const columns: ColumnDef<IBlogsCategory>[] = [
    {
      accessorKey: 'name',
      header: 'NAME',
      size: 500,
      maxSize: 700
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      size: 300
    },
    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          try {
            dispatch(updateBlogsCategoryData(updatedData));
            const result = await dispatch(
              addEditBlogsCategory(row.original._id || null)
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
