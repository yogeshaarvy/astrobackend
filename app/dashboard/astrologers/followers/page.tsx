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

    // Mock data - in real app, this would be your API call
    const mockFollowers = [
      {
        id: 1,
        username: 'john_doe',
        name: 'John Doe',
        email: 'john@example.com',
        followedDate: '2024-01-15'
      },
      {
        id: 2,
        username: 'jane_smith',
        name: 'Jane Smith',
        email: 'jane@example.com',
        followedDate: '2024-02-20'
      },
      {
        id: 3,
        username: 'mike_wilson',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        followedDate: '2024-03-10'
      },
      {
        id: 4,
        username: 'sarah_jones',
        name: 'Sarah Jones',
        email: 'sarah@example.com',
        followedDate: '2024-04-05'
      },
      {
        id: 5,
        username: 'alex_brown',
        name: 'Alex Brown',
        email: 'alex@example.com',
        followedDate: '2024-05-12'
      },
      {
        id: 6,
        username: 'emily_davis',
        name: 'Emily Davis',
        email: 'emily@example.com',
        followedDate: '2024-06-01'
      },
      {
        id: 7,
        username: 'david_lee',
        name: 'David Lee',
        email: 'david@example.com',
        followedDate: '2024-06-15'
      },
      {
        id: 8,
        username: 'lisa_garcia',
        name: 'Lisa Garcia',
        email: 'lisa@example.com',
        followedDate: '2024-06-20'
      },
      {
        id: 9,
        username: 'tom_miller',
        name: 'Tom Miller',
        email: 'tom@example.com',
        followedDate: '2024-06-25'
      },
      {
        id: 10,
        username: 'anna_white',
        name: 'Anna White',
        email: 'anna@example.com',
        followedDate: '2024-06-30'
      },
      {
        id: 11,
        username: 'chris_taylor',
        name: 'Chris Taylor',
        email: 'chris@example.com',
        followedDate: '2024-07-01'
      },
      {
        id: 12,
        username: 'maria_rodriguez',
        name: 'Maria Rodriguez',
        email: 'maria@example.com',
        followedDate: '2024-07-02'
      },
      {
        id: 13,
        username: 'james_anderson',
        name: 'James Anderson',
        email: 'james@example.com',
        followedDate: '2024-07-03'
      },
      {
        id: 14,
        username: 'sophia_thomas',
        name: 'Sophia Thomas',
        email: 'sophia@example.com',
        followedDate: '2024-07-04'
      },
      {
        id: 15,
        username: 'ryan_jackson',
        name: 'Ryan Jackson',
        email: 'ryan@example.com',
        followedDate: '2024-07-05'
      },
      {
        id: 16,
        username: 'olivia_harris',
        name: 'Olivia Harris',
        email: 'olivia@example.com',
        followedDate: '2024-07-06'
      },
      {
        id: 17,
        username: 'ethan_martin',
        name: 'Ethan Martin',
        email: 'ethan@example.com',
        followedDate: '2024-07-07'
      },
      {
        id: 18,
        username: 'ava_thompson',
        name: 'Ava Thompson',
        email: 'ava@example.com',
        followedDate: '2024-07-08'
      },
      {
        id: 19,
        username: 'noah_clark',
        name: 'Noah Clark',
        email: 'noah@example.com',
        followedDate: '2024-07-09'
      },
      {
        id: 20,
        username: 'emma_lewis',
        name: 'Emma Lewis',
        email: 'emma@example.com',
        followedDate: '2024-07-10'
      },
      {
        id: 21,
        username: 'liam_walker',
        name: 'Liam Walker',
        email: 'liam@example.com',
        followedDate: '2024-07-11'
      },
      {
        id: 22,
        username: 'mia_hall',
        name: 'Mia Hall',
        email: 'mia@example.com',
        followedDate: '2024-07-12'
      },
      {
        id: 23,
        username: 'lucas_allen',
        name: 'Lucas Allen',
        email: 'lucas@example.com',
        followedDate: '2024-07-13'
      },
      {
        id: 24,
        username: 'zoe_young',
        name: 'Zoe Young',
        email: 'zoe@example.com',
        followedDate: '2024-07-14'
      },
      {
        id: 25,
        username: 'mason_king',
        name: 'Mason King',
        email: 'mason@example.com',
        followedDate: '2024-07-15'
      }
    ];

    const total = mockFollowers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFollowers = mockFollowers.slice(startIndex, endIndex);

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

  const loadFollowers = async (page, limit) => {
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
    setFollowers(followers.filter((follower) => follower.id !== id));
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

  const handlePageChange = (page) => {
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
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-lg font-medium">Loading followers...</p>
                  </td>
                </tr>
              ) : followers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No followers yet</p>
                    <p className="text-sm">Your followers will appear here</p>
                  </td>
                </tr>
              ) : (
                followers.map((follower) => (
                  <tr
                    key={follower.id}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                            <span className="text-sm font-semibold text-white">
                              {follower.name
                                .split(' ')
                                .map((n) => n[0])
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
