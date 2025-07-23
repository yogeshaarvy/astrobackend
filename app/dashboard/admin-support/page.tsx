'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageContainer from '@/components/layout/page-container';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { fetchAdminSupportTickets } from '@/redux/slices/adminSupportSlice';
import PaginationControls from './components/PaginationControls';
import TicketSkeleton from './components/TicketSkeleton';
import TicketCard from './components/TicketCard';

export default function AdminTicketDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    AdminSupportState: {
      data: tickets,
      loading,
      pagination: {
        page,
        pageSize,
        totalCount,
        inprocessCount,
        closedCount,
        openCount
      }
    }
  } = useSelector((state: RootState) => state.ticketsData);

  const dispatch = useAppDispatch();

  // Add this helper function after the getTicketsByStatus function
  const getCurrentTabCount = () => {
    switch (activeTab) {
      case 'open':
        return openCount;
      case 'in-process':
        return inprocessCount;
      case 'closed':
        return closedCount;
      default:
        return totalCount || 0;
    }
  };

  // Replace the totalPages calculation
  const currentTabCount = getCurrentTabCount();
  const totalPages = Math.ceil(currentTabCount / pageSize);

  // Fetch tickets when component mounts or when search/page changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      dispatch(
        fetchAdminSupportTickets({
          page: currentPage,
          pageSize: 10,
          keyword: searchTerm,
          status: activeTab === 'all' ? '' : activeTab,
          exportData: false
        })
      );
    }, 300); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, currentPage, activeTab, dispatch]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  return (
    <PageContainer scrollable>
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Ticket Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Manage and track support tickets
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Tickets
                    </p>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : totalCount || 0}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open</p>
                    <p className="text-3xl font-bold text-red-600">
                      {loading ? '...' : openCount}
                    </p>
                  </div>
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      In Process
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {loading ? '...' : inprocessCount}
                    </p>
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Closed</p>
                    <p className="text-3xl font-bold text-green-600">
                      {loading ? '...' : closedCount}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
              <TabsTrigger value="in-process">
                In Process ({inprocessCount})
              </TabsTrigger>
              <TabsTrigger value="closed">Closed ({closedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TicketSkeleton key={index} />
                  ))
                ) : tickets?.length > 0 ? (
                  tickets?.map((ticket: any) => (
                    <TicketCard key={ticket?._id} ticket={ticket} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No tickets found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="open" className="mt-6">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TicketSkeleton key={index} />
                  ))
                ) : tickets?.length > 0 ? (
                  tickets?.map((ticket: any) => (
                    <TicketCard key={ticket?._id} ticket={ticket} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No open tickets
                    </h3>
                    <p className="text-gray-500">
                      All tickets are either in process or closed.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="in-process" className="mt-6">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TicketSkeleton key={index} />
                  ))
                ) : tickets?.length > 0 ? (
                  tickets?.map((ticket: any) => (
                    <TicketCard key={ticket?._id} ticket={ticket} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No tickets in process
                    </h3>
                    <p className="text-gray-500">
                      No tickets are currently being worked on.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="closed" className="mt-6">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TicketSkeleton key={index} />
                  ))
                ) : tickets?.length > 0 ? (
                  tickets?.map((ticket: any) => (
                    <TicketCard key={ticket?._id} ticket={ticket} />
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No closed tickets
                    </h3>
                    <p className="text-gray-500">
                      No tickets have been resolved yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {!loading && currentTabCount > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalCount={currentTabCount}
              pageSize={pageSize}
              activeTab={activeTab}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
