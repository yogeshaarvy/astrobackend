'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  addEditEmployee,
  IEmployee,
  updateEmployeeData
} from '@/redux/slices/employeeSlice';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  GENDER_OPTIONS,
  useEmployeeTableFilters
} from './use-employee-table-filters';

export default function EmployeeTable({
  data,
  totalData
}: {
  data: IEmployee[];
  totalData: number;
}) {
  const {
    genderFilter,
    setGenderFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useEmployeeTableFilters();

  const dispatch = useAppDispatch();

  const columns: ColumnDef<IEmployee>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: 'NAME'
    },
    {
      accessorKey: 'phone',
      header: 'PHONE'
    },
    {
      accessorKey: 'email',
      header: 'EMAIL'
    },
    {
      accessorKey: 'role',
      header: 'ROLE',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <>
            {role === 'admin'
              ? 'Admin'
              : role === 'employee'
              ? 'Employee'
              : 'Unknown'}
          </>
        );
      }
    },
    {
      accessorKey: 'permissionType',
      header: 'PERMISSION TYPE',
      cell: ({ row }) => {
        const permissionType = row.original.permissionType;
        return (
          <>
            {permissionType === 'default'
              ? 'Default'
              : permissionType === 'custom'
              ? 'Custom'
              : 'Not Set'}
          </>
        );
      }
    },
    {
      accessorKey: 'active',
      header: 'ACTIVE',
      cell: ({ row }) => {
        const handleToggle = async (checked: boolean) => {
          const updatedData = { ...row.original, active: checked };
          try {
            dispatch(updateEmployeeData(updatedData));
            const result = await dispatch(
              addEditEmployee(row.original._id || null)
            );
            toast.success('Status Updated Successfully!');
          } catch (error: any) {
            console.error('Error updating active status of brand:', error);
            toast.error('Failed to Update Status of brand');
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
          filterKey="gender"
          title="Gender"
          options={GENDER_OPTIONS}
          setFilterValue={setGenderFilter}
          filterValue={genderFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
