import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { CellAction } from './cell-action';
import { Switch } from '@/components/ui/switch';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import {
  FIELD_OPTIONS,
  STATUS_OPTIONS,
  useListTableFilters
} from './use-lists-table-filters';
import {
  addEditListFaq,
  IFaq,
  updateListFaqData
} from '@/redux/slices/panchang/faqSlice';

export default function ListFaqTable({
  data,
  totalData,
  handleSearch
}: {
  data: IFaq[];
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
  } = useListTableFilters();

  const columns: ColumnDef<IFaq>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 500,
      maxSize: 700
    },
    {
      accessorKey: 'sequence',
      header: 'Sequence',
      size: 300
    },
    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          try {
            dispatch(updateListFaqData(updatedData));
            const result = await dispatch(
              addEditListFaq(row.original._id || null)
            ).unwrap();
            toast.success('Status Updated Successfully!');
          } catch (error: any) {
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
