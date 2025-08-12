'use client';

import { searchParams } from '@/lib/searchparams';
import { fetchAstrologersList } from '@/redux/slices/astrologersSlice';
import { AppDispatch } from '@/redux/store';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export const STATUS_OPTIONS = [
  // { value: 'pending', label: 'Pending' },
  // { value: 'rejected', label: 'Rejected' },
  // { value: 'accepted', label: 'Accepted' },
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
  { value: '', label: 'All' }
];
export const FIELD_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'gender', label: 'Gender' },
  { value: 'dob', label: 'DOB' },
  { value: 'languages', label: 'Languages' },
  { value: 'skills', label: 'Skills' },
  { value: 'phoneType', label: 'Phone Type' }
];
export function useRequestTableFilters() {
  const dispatch = useDispatch<AppDispatch>();
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
    setFieldFilter(null);

    setStatusFilter(null);
    setPage(1);
    dispatch(fetchAstrologersList({ status: 'pending' }));
  }, [setSearchQuery, setPage, setStatusFilter, setFieldFilter, dispatch]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fieldFilter,
    setFieldFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
