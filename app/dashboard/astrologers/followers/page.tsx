'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Search, AlertCircle, RefreshCw } from 'lucide-react';
import {
  fetchFollowersList,
  clearFollowersState,
  type IFollower,
  type FollowersRootState
} from '@/redux/slices/followerSlice';
import { RootState } from '@/redux/store';
import { useSearchParams } from 'next/navigation';

interface FollowersPageProps {
  astrologerId: string;
}

export default function FollowersPage() {
  const searchParams = useSearchParams();
  const astrologerId = searchParams.get('id') || '';
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Get state from Redux store
  const {
    data: followers,
    loading,
    error,
    pagination
  } = useSelector((state: RootState & FollowersRootState) => state.followers);

  // Fetch followers on component mount and when page changes
  useEffect(() => {
    if (astrologerId) {
      dispatch(
        fetchFollowersList({
          astrologerId,
          page: currentPage,
          limit: pageSize
        }) as any
      );
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearFollowersState());
    };
  }, [dispatch, astrologerId, currentPage]);

  // Handle refresh
  const handleRefresh = () => {
    if (astrologerId) {
      dispatch(
        fetchFollowersList({
          astrologerId,
          page: currentPage,
          limit: pageSize
        }) as any
      );
    }
  };

  // Filter followers based on search term
  const filteredFollowers =
    followers?.filter(
      (follower: IFollower) =>
        follower.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading skeleton component
  const FollowerSkeleton = () => (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Followers</CardTitle>
              <Badge variant="secondary">
                {pagination.totalFollowers || 0} Total
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search followers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <FollowerSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFollowers.length === 0 && !error && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No followers found</h3>
            <p className="text-center text-muted-foreground">
              {searchTerm
                ? `No followers match "${searchTerm}"`
                : "This astrologer doesn't have any followers yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Followers List */}
      {!loading && filteredFollowers.length > 0 && (
        <div className="space-y-4">
          {filteredFollowers.map((follower: IFollower) => (
            <Card
              key={follower._id}
              className="w-full transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        follower.profilePic ||
                        `/placeholder.svg?height=48&width=48&query=${follower.name}`
                      }
                      alt={follower.name || 'Follower'}
                    />
                    <AvatarFallback>
                      {follower.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold">
                      {follower.name || 'Anonymous User'}
                    </h3>
                    {follower.email && (
                      <p className="text-sm text-muted-foreground">
                        {follower.email}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>ID: {follower._id}</span>
                      {follower.createdAt && (
                        <span>
                          • Joined{' '}
                          {new Date(follower.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Simple Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              }
            )}
            {pagination.totalPages > 5 && (
              <span className="text-muted-foreground">...</span>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              handlePageChange(Math.min(pagination.totalPages, currentPage + 1))
            }
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Stats Footer */}
      {!loading && filteredFollowers.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, pagination.totalFollowers || 0)} of{' '}
          {pagination.totalFollowers || 0} followers
        </div>
      )}
    </div>
  );
}
