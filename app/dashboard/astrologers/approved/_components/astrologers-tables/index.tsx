'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { ColumnDef } from '@tanstack/react-table';

import {
  STATUS_OPTIONS,
  FIELD_OPTIONS,
  useRequestTableFilters
} from './use-astrologers-table-filters';
import { Button } from '@/components/ui/button';
import {
  addEditRequest,
  IRequest,
  updateRequestData
} from '@/redux/slices/astrologersSlice';
import RequestStatusSelect from './AstrologersStatusSelect';
import { CellAction } from './cell-action';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAppDispatch } from '@/redux/hooks';

export default function RequestTable({
  data,
  totalData,
  handleSearch
}: {
  data: IRequest[];
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
  } = useRequestTableFilters();
  const dispatch = useAppDispatch();

  const columns: ColumnDef<IRequest>[] = [
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
      accessorKey: 'image',
      header: 'IMAGE',
      cell: ({ row }) => {
        const imageUrl = row.original.image;

        return imageUrl ? (
          <img
            src={imageUrl}
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">No Image</span>
        );
      }
    },
    {
      accessorKey: 'name',
      header: ' NAME'
    },

    {
      accessorKey: 'email',
      header: 'EMAIL'
    },
    {
      accessorKey: 'phone',
      header: 'PHONE'
    },
    {
      accessorKey: 'gender',
      header: 'GENDER'
    },
    {
      accessorKey: 'languages',
      header: 'LANGUAGE',
      cell: ({ row }) => {
        const languages = Array.isArray(row.original.languages)
          ? row.original.languages
          : [];
        // If languages are objects with a name property, use .name, else use as string
        const languageNames = languages
          .map((item: any) =>
            typeof item === 'object' && item.name ? item.name : item
          )
          .join(', ');
        return <span>{languageNames || ''}</span>;
      }
    },

    {
      accessorKey: 'skills',
      header: 'SKILL',
      cell: ({ row }) => {
        const skills = Array.isArray(row.original.skills)
          ? row.original.skills
          : [];
        // If skills are objects with a name property, use .name, else use as string
        const skillsNames = skills
          .map((item: any) =>
            typeof item === 'object' && item.name ? item.name : item
          )
          .join(', ');
        return <span>{skillsNames || ''}</span>;
      }
    },
    {
      accessorKey: 'dob',
      header: 'DOB',
      cell: ({ row }) => {
        const date = new Date(row.original.dob ?? '');
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
    },
    {
      accessorKey: 'status',
      header: 'REQUEST STATUS',
      cell: ({ row }) => <RequestStatusSelect request={row.original} />
    },
    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          // Ensure about is always an object, even if null or string
          let about = row.original.about;
          if (!about || typeof about === 'string') {
            about = { en: about || '' };
          }
          const updatedData = { ...row.original, active: checked, about };
          try {
            dispatch(updateRequestData(updatedData));
            await dispatch(addEditRequest(row.original._id || null)).unwrap();
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
      accessorKey: 'showinhome',
      header: 'SHOW IN HOME',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          // Ensure about is always an object, even if null or string
          let about = row.original.about;
          if (!about || typeof about === 'string') {
            about = { en: about || '' };
          }
          const updatedData = { ...row.original, showinhome: checked, about };
          try {
            dispatch(updateRequestData(updatedData));
            await dispatch(addEditRequest(row.original._id || null)).unwrap();
            toast.success('Show In Home Status Updated Successfully!');
          } catch (error: any) {
            toast.error('Failed to Update Home Status');
          }
        };
        return (
          <Switch
            checked={row.original.showinhome}
            onCheckedChange={handleToggle}
            aria-label="Toggle home Status"
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
          title="Filter By Field"
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
