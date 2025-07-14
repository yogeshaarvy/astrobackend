'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllKundli,
  resetKundliState,
  type IKundli
} from '@/redux/slices/kundli/kundliList';
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
  Download,
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import type { RootState, AppDispatch } from '@/redux/store';
import PageContainer from '@/components/layout/page-container';

// Location cache to avoid repeated API calls
const locationCache = new Map<string, string>();

// Rate limiting queue
const requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
      // Add delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  isProcessingQueue = false;
};

// Utility function to get location from coordinates with caching and retry
const getLocationFromCoords = async (
  lat: string,
  lon: string
): Promise<string> => {
  const cacheKey = `${lat},${lon}`;
  // Check cache first
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey)!;
  }

  try {
    // Validate coordinates
    const latitude = Number.parseFloat(lat);
    const longitude = Number.parseFloat(lon);
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      const result = 'Invalid coordinates';
      locationCache.set(cacheKey, result);
      return result;
    }

    // Try multiple geocoding services as fallbacks
    const services = [
      {
        name: 'nominatim',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        parser: (data: any) => {
          if (data && data.address) {
            const address = data.address;
            const city =
              address.city || address.town || address.village || address.hamlet;
            const state = address.state || address.province;
            const country = address.country;
            let location = '';
            if (city) location += city;
            if (state) location += (location ? ', ' : '') + state;
            if (country) location += (location ? ', ' : '') + country;
            return (
              location ||
              data.display_name?.split(',').slice(0, 3).join(', ') ||
              'Unknown Location'
            );
          }
          return null;
        }
      },
      {
        name: 'bigdatacloud',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        parser: (data: any) => {
          if (
            data &&
            (data.city || data.locality || data.principalSubdivision)
          ) {
            let location = '';
            if (data.city) location += data.city;
            else if (data.locality) location += data.locality;
            if (data.principalSubdivision)
              location += (location ? ', ' : '') + data.principalSubdivision;
            if (data.countryName)
              location += (location ? ', ' : '') + data.countryName;
            return location || 'Unknown Location';
          }
          return null;
        }
      }
    ];

    // Try each service with timeout
    for (const service of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        const response = await fetch(service.url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'KundliApp/1.0' // Custom User-Agent
          }
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          const location = service.parser(data);
          if (location) {
            locationCache.set(cacheKey, location);
            return location;
          }
        }
      } catch (error) {
        console.warn(`${service.name} geocoding failed:`, error);
        continue;
      }
    }

    // If all services fail, return coordinates as fallback
    const fallback = `${Number.parseFloat(lat).toFixed(2)}, ${Number.parseFloat(
      lon
    ).toFixed(2)}`;
    locationCache.set(cacheKey, fallback);
    return fallback;
  } catch (error) {
    console.error('Error fetching location:', error);
    const fallback = 'Location unavailable';
    locationCache.set(cacheKey, fallback);
    return fallback;
  }
};

// Optimized hook for location lookup with better state management
const useLocationLookup = (lat?: string, lon?: string) => {
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!lat || !lon) {
      setLocation('N/A');
      setLoading(false);
      setError(false);
      return;
    }

    const cacheKey = `${lat},${lon}`;
    // Check cache immediately
    if (locationCache.has(cacheKey)) {
      setLocation(locationCache.get(cacheKey)!);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setLocation('Loading...');

    // Add to queue for rate limiting
    const fetchLocation = async () => {
      try {
        const result = await getLocationFromCoords(lat, lon);
        setLocation(result);
        setError(
          result === 'Location unavailable' || result === 'Invalid coordinates'
        );
      } catch (err) {
        setLocation('Location unavailable');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    requestQueue.push(fetchLocation);
    processQueue();
  }, [lat, lon]);

  return { location, loading, error };
};

// Improved Location component with better loading states
const LocationDisplay = ({ lat, lon }: { lat?: string; lon?: string }) => {
  const { location, loading, error } = useLocationLookup(lat, lon);

  if (!lat || !lon) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>N/A</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-xs">
        <MapPin className="h-3 w-3 animate-pulse" />
        <div className="flex items-center gap-1">
          <span>
            <div className="flex space-x-1">
              <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-current"></div>
            </div>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-xs ${
        error ? 'text-orange-600' : ''
      }`}
    >
      <MapPin className="h-3 w-3" />
      <span title={error ? `Coordinates: ${lat}, ${lon}` : undefined}>
        {location}
      </span>
    </div>
  );
};

export default function KundliPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { KundliState } = useSelector((state: RootState) => state.kundliList);

  // Local state for filters and pagination
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState('name'); // Default to 'name'
  const [selectedLang, setSelectedLang] = useState('all'); // Default to 'all'
  const [selectedGender, setSelectedGender] = useState('all'); // Default to 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data on component mount and when filters/pagination change
  useEffect(() => {
    handleFetchData();
  }, [
    currentPage,
    pageSize,
    searchField,
    searchKeyword,
    selectedLang,
    selectedGender
  ]);

  const handleFetchData = () => {
    dispatch(
      fetchAllKundli({
        page: currentPage,
        limit: pageSize,
        field: searchField !== 'allFields' ? searchField : undefined,
        text: searchKeyword || undefined,
        lang: selectedLang !== 'all' ? selectedLang : undefined,
        gender: selectedGender !== 'all' ? selectedGender : undefined
      })
    );
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    handleFetchData();
  };

  const handleExport = () => {
    dispatch(
      fetchAllKundli({
        exportData: true,
        limit: KundliState.pagination.totalCount,
        field: searchField !== 'allFields' ? searchField : undefined,
        text: searchKeyword || undefined,
        lang: selectedLang !== 'all' ? selectedLang : undefined,
        gender: selectedGender !== 'all' ? selectedGender : undefined
      })
    );
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSearchField('name'); // Reset to default
    setSelectedLang('all'); // Reset to default
    setSelectedGender('all'); // Reset to default
    setCurrentPage(1); // Reset to first page
    setPageSize(10); // Reset to default
    dispatch(resetKundliState()); // Resets Redux state pagination as well
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    // Assuming timeString is already in a displayable format like "HH:MM"
    return timeString;
  };

  const getSequenceNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const totalPages = Math.ceil(KundliState.pagination.totalCount / pageSize);

  return (
    <PageContainer scrollable>
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Kundli Records
            </h1>
            <p className="text-muted-foreground">
              Manage and view all Kundli data records
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={KundliState.loading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filters</CardTitle>
            <CardDescription>
              Filter Kundli records by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label htmlFor="search-input" className="text-sm font-medium">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-input"
                    placeholder="Search records..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="search-field-select"
                  className="text-sm font-medium"
                >
                  Search Field
                </label>
                <Select value={searchField} onValueChange={setSearchField}>
                  <SelectTrigger id="search-field-select">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="gender">Gender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="gender-filter-select"
                  className="text-sm font-medium"
                >
                  Gender
                </label>
                <Select
                  value={selectedGender}
                  onValueChange={setSelectedGender}
                >
                  <SelectTrigger id="gender-filter-select">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSearch} disabled={KundliState.loading}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Total Records: {KundliState.pagination.totalCount}</span>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Error State */}
        {KundliState.error && (
          <Alert variant="destructive">
            <AlertDescription>{KundliState.error}</AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Time of Birth</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Lang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {KundliState.loading ? (
                    // Loading skeleton
                    Array.from({ length: pageSize }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : KundliState.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No Kundli records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    KundliState.data.map((record: IKundli, index: number) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-mono text-sm font-medium">
                          {getSequenceNumber(index)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {record.name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {record.dob}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(record.tob)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.lat && record.lon ? (
                            <LocationDisplay
                              lat={record.lat}
                              lon={record.lon}
                            />
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>N/A</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{record.gender || 'N/A'}</TableCell>
                        <TableCell>{record.lang || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(
                currentPage * pageSize,
                KundliState.pagination.totalCount
              )}{' '}
              of {KundliState.pagination.totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || KundliState.loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={KundliState.loading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || KundliState.loading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
