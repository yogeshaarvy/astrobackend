'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Search,
  Download,
  Eye,
  Mail,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { RootState } from '@/redux/store';
import { fetchCarrier, ICarrier } from '@/redux/slices/career/carrier';

export default function CarriersPage() {
  const dispatch = useDispatch();
  const { CarrierState } = useSelector((state: RootState) => state.carrier);
  const { data, loading, error, pagination } = CarrierState;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState('allFields');
  const [status, setStatus] = useState('allStatus');
  const [selectedCarrier, setSelectedCarrier] = useState<ICarrier | null>(null);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    dispatch(
      fetchCarrier({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        field: searchField,
        status: status,
        limit: pagination.pageSize
      }) as any
    );
  }, [dispatch, pagination.page, pagination.pageSize]);

  const handleSearch = () => {
    dispatch(
      fetchCarrier({
        page: 1,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        field: searchField,
        status: status,
        limit: pagination.pageSize
      }) as any
    );
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchCarrier({
        page: newPage,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        field: searchField,
        status: status,
        limit: pagination.pageSize
      }) as any
    );
  };

  const handleExport = () => {
    dispatch(
      fetchCarrier({
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        field: searchField,
        status: status,
        limit: pagination.pageSize,
        exportData: true
      }) as any
    );
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading carriers: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Career forms ({pagination.totalCount}){' '}
          </h1>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search carriers..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Search field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allFields">All fields</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allStatus">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select> */}
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Career Applications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Resume</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data && data.length > 0 ? (
                      data.map((carrier: ICarrier) => (
                        <TableRow
                          key={carrier.email || carrier.name || Math.random()}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {carrier.name || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {carrier.email || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {carrier.info || 'No information provided'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {carrier.resume ? (
                              <Badge
                                variant="outline"
                                className="flex w-fit items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Not provided</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedCarrier(carrier)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Career Details</DialogTitle>
                                </DialogHeader>
                                {selectedCarrier && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Name
                                        </label>
                                        <p className="text-sm">
                                          {selectedCarrier.name || 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Email
                                        </label>
                                        <p className="text-sm">
                                          {selectedCarrier.email || 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">
                                        Information
                                      </label>
                                      <p className="mt-1 text-sm">
                                        {selectedCarrier.info ||
                                          'No information provided'}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">
                                        Resume
                                      </label>
                                      {selectedCarrier.resume ? (
                                        <div className="mt-1">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                          >
                                            <a
                                              href={selectedCarrier.resume}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2"
                                            >
                                              <FileText className="h-4 w-4" />
                                              View Resume
                                            </a>
                                          </Button>
                                        </div>
                                      ) : (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                          No resume provided
                                        </p>
                                      )}
                                    </div>
                                    {selectedCarrier.createdAt && (
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Applied On
                                        </label>
                                        <p className="text-sm">
                                          {new Date(
                                            selectedCarrier.createdAt
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <User className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              No Career found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.totalCount
                    )}{' '}
                    of {pagination.totalCount} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pagination.page === pageNum
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
