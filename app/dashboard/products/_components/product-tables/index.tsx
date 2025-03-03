'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  addEditProducts,
  IProducts,
  updateProductsData
} from '@/redux/slices/productSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  FIELD_OPTIONS,
  STATUS_OPTIONS,
  useProductsTableFilters
} from './use-product-table-filters';
import { Button } from '@/components/ui/button';

export default function ProductsTable({
  data,
  totalData,
  handleSearch
}: {
  data: IProducts[];
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
  } = useProductsTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<IProducts>[] = [
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
      accessorKey: 'slug',
      header: 'SLUG'
    },
    {
      accessorKey: 'model_no',
      header: 'MODEL NO.'
    },

    {
      accessorKey: 'manufacture',
      header: 'MANUFACTURE'
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
      accessorKey: 'meta_description',
      header: 'META DESCRIPTION'
    },
    // {
    //   accessorKey: 'price',
    //   header: 'PRICE'
    // },
    // {
    //   accessorKey: 'special_price',
    //   header: 'SPECAIL PRICE'
    // },
    {
      accessorKey: 'sequence',
      header: 'SEQUENCE'
    },
    {
      accessorKey: 'brand_name',
      header: 'BRAND NAME',
      cell: ({ row }) => {
        const typesNames = row.original?.name;
        return <span>{typesNames || 'No types'}</span>;
      }
    },

    {
      accessorKey: 'categories',
      header: 'TYPES',
      cell: ({ row }) => {
        const categoriesNames = row.original?.categories
          .map((e: any) => e?.name)
          .join(', ');
        return <span>{categoriesNames || 'No Category'}</span>;
      }
    },

    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          // const preparePayload = (data: any) => ({
          //   ...data
          // });

          // const updatedData = preparePayload(row.original );
          try {
            // Update the Redux state
            dispatch(updateProductsData(updatedData));

            // Send the updated data to the API
            const result = await dispatch(
              addEditProducts(row.original._id || null)
            ).unwrap();

            toast.success('Status Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating product status:', error);
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
