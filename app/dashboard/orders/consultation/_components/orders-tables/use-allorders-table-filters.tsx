'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export const STATUS_OPTIONS = [
  { value: 'succcess', label: 'Succcess' },
  { value: 'panding', label: 'Panding' },
  { value: 'failed', label: 'Failed' }
];
export const ORDER_STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'panding', label: 'Panding' },
  { value: 'failed', label: 'Failed' }
];
export const FIELD_OPTIONS = [
  { value: 'orderId', label: 'Order Id' },
  { value: 'bookedDate', label: 'Booked Date (Ex :-2025-10-31)' }
];

export function useConsultationsOrdersTableFilters() {
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

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setFieldFilter(null);
    setPage(1);
  }, [setSearchQuery, setPage, setStatusFilter]);

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
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
