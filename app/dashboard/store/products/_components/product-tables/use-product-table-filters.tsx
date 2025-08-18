'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { fetchProductsList } from '@/redux/slices/store/productSlice';
export const STATUS_OPTIONS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];
export const FIELD_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'slug', label: 'Slug' },
  { value: 'meta_tag', label: 'Meta Tag' },
  { value: 'meta_title', label: 'Meta Title' },
  { value: 'meta_description', label: 'Meta Description' },
  { value: 'manufacture', label: 'Manufacture' },
  { value: 'brand_name', label: 'Brand Name' },
  { value: 'filtertypes', label: 'Types ' },
  { value: 'filtervalues', label: 'Filter Values' },
  { Value: 'madeIn', label: 'Made In' }
];
export function useProductsTableFilters() {
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
    dispatch(fetchProductsList());
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
