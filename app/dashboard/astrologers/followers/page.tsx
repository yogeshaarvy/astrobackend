'use client';
import React, { useState, useEffect } from 'react';
import {
  UserMinus,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

const FollowersTable = () => {
  const [followers, setFollowers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit] = useState(10);

  // Mock API function to simulate fetching followers
  const fetchFollowers = async (page: number, limit: number) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const total = followers?.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFollowers = followers?.slice(startIndex, endIndex);

    setLoading(false);

    return {
      followers: paginatedFollowers,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  };

  // Load followers on component mount and when page changes
  useEffect(() => {
    loadFollowers(currentPage, limit);
  }, [currentPage, limit]);

  const loadFollowers = async (page: number, limit: number) => {
    try {
      const response = await fetchFollowers(page, limit);
      setFollowers(response?.followers);
      setTotalFollowers(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const removeFollower = async (id: any) => {
    // Optimistic update - remove from UI immediately
    setFollowers(followers.filter((follower) => (follower as any)?._id !== id));
    setTotalFollowers((prev) => prev - 1);

    // In a real app, you would make an API call here:
    // await deleteFollower(id);

    // If the current page becomes empty and it's not the first page, go to previous page
    if (followers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (followers.length === 1 && currentPage === 1) {
      // If we're on the first page and it becomes empty, reload to show updated data
      loadFollowers(currentPage, limit);
    }
  };

  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <PageContainer scrollable>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Followers Management
          </h1>
        </div>
        <p className="text-gray-600">
          Manage your followers list - {totalFollowers} total followers
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Followed Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-lg font-medium">Loading followers...</p>
                  </td>
                </tr>
              ) : followers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No followers yet</p>
                    <p className="text-sm">Your followers will appear here</p>
                  </td>
                </tr>
              ) : (
                followers.map((follower: any) => (
                  <tr
                    key={follower?._id}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                            <span className="text-sm font-semibold text-white">
                              {follower?.name
                                .split(' ')
                                .map((n: any) => n[0])
                                .join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {follower.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{follower.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {follower.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(follower.followedDate).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => removeFollower(follower.id)}
                        className="inline-flex items-center gap-2 rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 transition-colors duration-200 hover:bg-red-200 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <UserMinus className="h-4 w-4" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * limit + 1} to{' '}
                {Math.min(currentPage * limit, totalFollowers)} of{' '}
                {totalFollowers} followers
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </button>

                <div className="flex space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === 'number' && handlePageChange(page)
                      }
                      disabled={page === '...'}
                      className={`rounded-md px-3 py-2 text-sm font-medium leading-4 transition-colors duration-200 ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : page === '...'
                          ? 'cursor-default text-gray-500'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default FollowersTable;
