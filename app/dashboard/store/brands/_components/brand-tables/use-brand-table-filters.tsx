'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { fetchBrandList } from '@/redux/slices/brandSlice';
import { useDispatch } from 'react-redux';
export const FIELD_OPTIONS = [
  { value: 'name.en', label: 'Name' },
  { value: 'short_description', label: 'Short Deacription' },
  { value: 'long_description', label: 'Long Deacription' },
  { value: 'meta_description', label: 'Meta Deacription' },
  { value: 'meta_title', label: 'Meta Title' },
  { value: 'meta_tag', label: 'Meta Tag' }
];
export const STATUS_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

export function useBrandTableFilters() {
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
    setFieldFilter(null);
    setStatusFilter(null);
    setPage(1);
    dispatch(fetchBrandList());
  }, [setSearchQuery, setFieldFilter, setPage, setStatusFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!fieldFilter || !!statusFilter;
  }, [searchQuery, fieldFilter, statusFilter]);

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
