'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  Mail,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';
import { fetchContactUs } from '@/redux/slices/contact/contactSlice';
import PageContainer from '@/components/layout/page-container';

export default function ContactPage() {
  const dispatch = useDispatch();
  const { ContactState } = useSelector((state: RootState) => state.contactUs);
  const { data, loading, error, pagination } = ContactState;

  // Local state for filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState('allFields');
  const [statusFilter, setStatusFilter] = useState('allStatuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    handleFetchContacts();
  }, [currentPage, pageSize, statusFilter]);

  const handleFetchContacts = () => {
    dispatch(
      fetchContactUs({
        page: currentPage,
        pageSize: pageSize,
        keyword: searchKeyword,
        field: searchField,
        status: statusFilter,
        limit: pageSize,
        exportData: false
      }) as any
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    handleFetchContacts();
  };

  const handleExport = () => {
    dispatch(
      fetchContactUs({
        page: 1,
        pageSize: pagination.totalCount,
        keyword: searchKeyword,
        field: searchField,
        status: statusFilter,
        limit: pagination.totalCount,
        exportData: true
      }) as any
    );
    toast.success('Export initiated');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(pagination.totalCount / pageSize);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PageContainer scrollable>
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contact Management
            </h1>
            <p className="text-muted-foreground">
              Manage and view all contact submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleFetchContacts} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              Search and filter contact submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search Field</label>
                <Select value={searchField} onValueChange={setSearchField}>
                  <SelectTrigger>
                    <SelectValue placeholder="All fields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allFields">All fields</SelectItem>
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
                  setSearchField('allFields');
                  setStatusFilter('allStatuses');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>
                  {pagination.totalCount} total contacts found
                </CardDescription>
              </div>
              <Badge variant="secondary">
                Page {currentPage} of {totalPages}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertDescription>
                  Error loading contacts: {error}
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <LoadingSkeleton />
            ) : data && data.length > 0 ? (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((contact: any) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {contact.name || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {contact.email || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                              <span className="truncate">
                                {contact.message || 'No message'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {contact.createdAt
                              ? new Date(contact.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-4 md:hidden">
                  {data.map((contact: any) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {contact.name || 'N/A'}
                              </span>
                            </div>
                            <Badge
                              variant={
                                contact.isActive ? 'default' : 'secondary'
                              }
                            >
                              {contact.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {contact.email || 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {contact.message || 'No message'}
                            </span>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {contact.createdAt
                              ? new Date(contact.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No contacts found</h3>
                <p className="text-muted-foreground">
                  No contact submissions match your current filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, pagination.totalCount)} of{' '}
                  {pagination.totalCount} results
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
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
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
