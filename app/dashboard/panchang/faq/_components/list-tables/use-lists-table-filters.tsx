'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
export const FIELD_OPTIONS = [
  { value: 'name', label: 'Title' },
  { value: 'sequence', label: 'Sequence' }
];
export const STATUS_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

export function useListTableFilters() {
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
  const [activeFilter, setActiveFilter] = useQueryState(
    'active',
    searchParams.active.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setFieldFilter(null);
    setActiveFilter(null);
    // setPage(1);
  }, [setSearchQuery, setFieldFilter, setPage, setActiveFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!fieldFilter || !!activeFilter;
  }, [searchQuery, fieldFilter, activeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    fieldFilter,
    setFieldFilter,
    activeFilter,
    setActiveFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
