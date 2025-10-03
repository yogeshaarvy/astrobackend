'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export const ASSIGN_STATUS_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];
export const FIELD_OPTIONS = [{ value: 'date', label: 'Date' }];
export function useAllOrderTableFilters() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );
  const [fieldFilter, setFieldFilter] = useQueryState(
    'field',
    searchParams.field.withOptions({ shallow: false }).withDefault('')
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );
  const [assignStatusFilter, setAssignStatusFilter] = useQueryState(
    'assignStatus',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setFieldFilter(null);
    setAssignStatusFilter(null);
    setPage(1);
  }, [setSearchQuery, setPage, setStatusFilter, setAssignStatusFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    fieldFilter,
    setFieldFilter,
    statusFilter,
    setStatusFilter,
    assignStatusFilter,
    setAssignStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
