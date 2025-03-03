'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { fetchSlidersList } from '@/redux/slices/slidersSlice';
import { fetchFaqList } from '@/redux/slices/faqSlice';
import { fetchHomeAboutList } from '@/redux/slices/homeaboutlistSlice';
export const STATUS_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];
export const FIELD_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
  { value: 'searchpage', label: 'Search Page' }
];
export function useFaqTableFilters() {
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
    dispatch(fetchHomeAboutList());
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
