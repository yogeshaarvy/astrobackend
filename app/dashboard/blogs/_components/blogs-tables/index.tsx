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
} from './use-about-table-filters';
import { Button } from '@/components/ui/button';
import { ISliders } from '@/redux/slices/slidersSlice';
import { updateSlidersData, addEditSliders } from '@/redux/slices/slidersSlice';
import { CellAction } from '@/app/dashboard/blogs/_components/blogs-tables/cell-action';
import { addEditFaq, IFaq, updateFaqData } from '@/redux/slices/faqSlice';
import {
  addEditHomeAboutList,
  IHomeAboutList,
  updateHomeAboutListData
} from '@/redux/slices/homeaboutlistSlice';
import { addEditBlogsPost, IBlogsPost } from '@/redux/slices/blogspostSlice';

export default function AboutTable({
  data,
  totalData,
  handleSearch
}: {
  data: IBlogsPost[];
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
  const columns: ColumnDef<IBlogsPost>[] = [
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
      accessorKey: 'thumbnail_image',
      header: 'THUMBNAIL_IMAGE',
      cell: ({ row }) => (
        <img
          src={row.original.thumbnail_image}
          alt="Banner"
          className="h-6 w-6 rounded-md object-cover"
        />
      )
    },
    {
      accessorKey: 'main_image',
      header: 'MAIN_IMAGE',
      cell: ({ row }) => (
        <img
          src={row.original.main_image}
          alt="Banner"
          className="h-6 w-6 rounded-md object-cover"
        />
      )
    },
    {
      accessorKey: 'heading',
      header: 'TITLE'
    },
    {
      accessorKey: 'slug',
      header: 'SLUG'
    },
    {
      accessorKey: 'short_description',
      header: 'SHORT_DESCRIPTION'
    },
    {
      accessorKey: 'long_description',
      header: 'LONG_DESCRIPTION'
    },
    {
      accessorKey: 'status',
      header: 'ACTIVE',
      cell: ({ row }) => {

        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, status: checked };

          const formDataToSend = new FormData();
          formDataToSend.append('sequence', updatedData?.sequence.toString());
          formDataToSend.append('heading', updatedData?.heading);
          formDataToSend.append(
            'short_description',
            updatedData?.short_description
          );
          formDataToSend.append(
            'long_description',
            updatedData?.long_description
          );
          formDataToSend.append('status', updatedData.status.toString());
          if (updatedData.thumbnail_image) {
            formDataToSend.append(
              'thumbnail_image',
              updatedData.thumbnail_image
            );
          }
          if (updatedData.main_image) {
            formDataToSend.append('main_image', updatedData.main_image);
          }
          try {
            dispatch(updateHomeAboutListData(updatedData));
            const result = await dispatch(
              addEditBlogsPost({
                formData: formDataToSend,
                entityId: row.original._id || null
              })
            ).unwrap();
            toast.success('Post Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating post status:', error);
            toast.error('Failed to Update Post');
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
      {/* <div className="flex flex-wrap items-center gap-4">
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
      </div> */}
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
