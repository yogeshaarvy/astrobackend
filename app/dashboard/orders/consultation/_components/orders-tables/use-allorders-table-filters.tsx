'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export const STATUS_OPTIONS = [
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
  { value: 'falied', label: 'Failed' }
];
export const ORDER_STATUS_OPTIONS = [
  { value: 'no started', label: 'Not started' },
  // { value: 'progress', label: 'Progress' },
  // { value: 'start', label: 'Start' },
  { value: 'complete', label: 'Complete' }
  // { value: 'cancel', label: 'Cancel' }
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
    'paymentStatus',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [orderStatusFilter, setOrderStatusFilter] = useQueryState(
    'orderStatus',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setOrderStatusFilter(null);
    setFieldFilter(null);
    setPage(1);
  }, [
    setSearchQuery,
    setPage,
    setStatusFilter,
    setOrderStatusFilter,
    setFieldFilter
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery || !!statusFilter || !!orderStatusFilter || !!fieldFilter
    );
  }, [searchQuery, statusFilter, orderStatusFilter, fieldFilter]);

  return {
    searchQuery,
    setSearchQuery,
    fieldFilter,
    setFieldFilter,
    statusFilter,
    setStatusFilter,
    orderStatusFilter,
    setOrderStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
