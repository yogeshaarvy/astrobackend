'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';

import { fetchLanguageDataList } from '@/redux/slices/languageDataSlice';
export const STATUS_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];
export function useTagTableFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
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
    setPage(1);
    dispatch(fetchLanguageDataList());
  }, [setSearchQuery, setPage, setStatusFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
