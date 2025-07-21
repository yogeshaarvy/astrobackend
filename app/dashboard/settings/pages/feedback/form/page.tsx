'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  User,
  Phone,
  MessageSquare,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { fetchFeedback } from '@/redux/slices/feedback';
import { RootState } from '@/redux/store';
import PageContainer from '@/components/layout/page-container';

export default function FeedbackPage() {
  const dispatch = useDispatch();
  const { FeedbackState } = useSelector((state: RootState) => state.feedback);
  const { data, loading, error, pagination } = FeedbackState;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    handleFetchFeedback();
  }, [currentPage, pageSize, statusFilter]);

  // Fetch feedback data
  const handleFetchFeedback = () => {
    dispatch(
      fetchFeedback({
        page: currentPage,
        pageSize,
        keyword: searchKeyword,
        field: fieldFilter,
        status: statusFilter,
        limit: pageSize
      }) as any
    );
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    handleFetchFeedback();
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(pagination.totalCount / pageSize);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <PageContainer scrollable>
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Feedback Management</h1>
            <p className="text-muted-foreground">
              Manage and review customer feedback
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Field</label>
                <Select value={fieldFilter} onValueChange={setFieldFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Size</label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchKeyword('');
                  setStatusFilter('');
                  setFieldFilter('');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Feedback
                  </p>
                  <p className="text-2xl font-bold">{pagination.totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Page</p>
                  <p className="text-2xl font-bold">{currentPage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pages</p>
                  <p className="text-2xl font-bold">{totalPages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Per Page</p>
                  <p className="text-2xl font-bold">{pageSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : data && data.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Feedback List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((feedback: any) => (
                      <TableRow key={feedback.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {feedback.name || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{feedback.email || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{feedback.phone || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="truncate" title={feedback.message}>
                              {feedback.message || 'No message'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {feedback.createdAt
                            ? new Date(feedback.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No Feedback Found</h3>
              <p className="text-muted-foreground">
                {searchKeyword || statusFilter || fieldFilter
                  ? 'No feedback matches your current filters.'
                  : 'No feedback has been submitted yet.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, pagination.totalCount)} of{' '}
                  {pagination.totalCount} results
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant={
                            currentPage === totalPages ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
