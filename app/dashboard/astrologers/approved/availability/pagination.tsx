'use client';

import { useState } from 'react';

interface PaginationState {
  currentPage: number;
  limit: number;
  hasMore: boolean;
  totalCount: number;
}

interface UsePaginationProps {
  initialLimit?: number;
}

export const usePagination = ({
  initialLimit = 10
}: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    limit: initialLimit,
    hasMore: true,
    totalCount: 0
  });

  const [loadingMore, setLoadingMore] = useState(false);

  const updatePagination = (updates: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  };

  const resetPagination = () => {
    setPagination({
      currentPage: 1,
      limit: initialLimit,
      hasMore: true,
      totalCount: 0
    });
  };

  const getNextPage = () => pagination.currentPage + 1;

  const handleApiResponse = (response: any) => {
    const hasMore = response.data?.length === pagination.limit;
    const totalCount = response.totalCount || pagination.totalCount;

    updatePagination({
      totalCount,
      hasMore
    });
  };

  return {
    pagination,
    loadingMore,
    setLoadingMore,
    updatePagination,
    resetPagination,
    getNextPage,
    handleApiResponse
  };
};
