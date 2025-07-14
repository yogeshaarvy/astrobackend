// "use client"

// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { fetchAllMatchmaking, type IMatchmaking } from "@/redux/slices/matchmaking/matchmakinglist"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Search, Download, Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react"
// import type { RootState } from "@/redux/store"
// import PageContainer from "@/components/layout/page-container"

// // Utility function to get location from coordinates
// const getLocationFromCoords = async (lat: string, lon: string): Promise<string> => {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
//     )
//     const data = await response.json()

//     if (data && data.display_name) {
//       // Extract city, state, country from the response
//       const address = data.address
//       const city = address?.city || address?.town || address?.village || address?.hamlet
//       const state = address?.state
//       const country = address?.country

//       let location = ""
//       if (city) location += city
//       if (state) location += (location ? ", " : "") + state
//       if (country) location += (location ? ", " : "") + country

//       return location || data.display_name.split(",").slice(0, 3).join(", ")
//     }
//     return "Unknown Location"
//   } catch (error) {
//     console.error("Error fetching location:", error)
//     return "Location unavailable"
//   }
// }

// // Custom hook for location lookup
// const useLocationLookup = (lat?: string, lon?: string) => {
//   const [location, setLocation] = useState<string>("Loading...")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (lat && lon) {
//       setLoading(true)
//       getLocationFromCoords(lat, lon)
//         .then(setLocation)
//         .finally(() => setLoading(false))
//     } else {
//       setLocation("N/A")
//     }
//   }, [lat, lon])

//   return { location, loading }
// }

// // Location component
// const LocationDisplay = ({ lat, lon, prefix }: { lat?: string; lon?: string; prefix: string }) => {
//   const { location, loading } = useLocationLookup(lat, lon)

//   if (loading) {
//     return (
//       <div className="flex items-center gap-1 text-xs">
//         <MapPin className="h-3 w-3" />
//         <Skeleton className="h-3 w-20" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex items-center gap-1 text-xs">
//       <MapPin className="h-3 w-3" />
//       <span>
//         {prefix}: {location}
//       </span>
//     </div>
//   )
// }

// export default function MatchmakingPage() {
//   const dispatch = useDispatch()
//   const { MatchmakingState } = useSelector((state: RootState) => state.matchmakinglist)

//   // Local state for filters and pagination
//   const [searchKeyword, setSearchKeyword] = useState("")
//   const [searchField, setSearchField] = useState("allFields")
//   const [statusFilter, setStatusFilter] = useState("allStatus")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [pageSize, setPageSize] = useState(10)

//   // Fetch data on component mount and when filters change
//   useEffect(() => {
//     handleFetchData()
//   }, [currentPage, pageSize, statusFilter])

//   const handleFetchData = () => {
//     dispatch(
//       fetchAllMatchmaking({
//         page: currentPage,
//         limit: pageSize,
//         field: searchField !== "allFields" ? searchField : undefined,
//         text: searchKeyword || undefined,
//         lang: statusFilter !== "allStatus" ? statusFilter : undefined,
//       }) as any,
//     )
//   }

//   const handleSearch = () => {
//     setCurrentPage(1) // Reset to first page when searching
//     handleFetchData()
//   }

//   const handleExport = () => {
//     dispatch(
//       fetchAllMatchmaking({
//         exportData: true,
//         limit: MatchmakingState.pagination.totalCount,
//       }) as any,
//     )
//   }

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage)
//   }

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "N/A"
//     return new Date(dateString).toLocaleDateString()
//   }

//   const formatTime = (timeString?: string) => {
//     if (!timeString) return "N/A"
//     return timeString
//   }

//   const getSequenceNumber = (index: number) => {
//     return (currentPage - 1) * pageSize + index + 1
//   }

//   const totalPages = Math.ceil(MatchmakingState.pagination.totalCount / pageSize)

//   return (
//     <PageContainer scrollable>
//       <div className="container mx-auto p-6 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Matchmaking Records</h1>
//             <p className="text-muted-foreground">Manage and view all matchmaking compatibility reports</p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" onClick={handleExport} disabled={MatchmakingState.loading}>
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* Filters */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Search & Filters</CardTitle>
//             <CardDescription>Filter matchmaking records by various criteria</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Search</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search records..."
//                     value={searchKeyword}
//                     onChange={(e) => setSearchKeyword(e.target.value)}
//                     className="pl-10"
//                     onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Search Field</label>
//                 <Select value={searchField} onValueChange={setSearchField}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select field" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="allFields">All Fields</SelectItem>
//                     <SelectItem value="boyName">Boy Name</SelectItem>
//                     <SelectItem value="girlName">Girl Name</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Language</label>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select language" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="allStatus">All Languages</SelectItem>
//                     <SelectItem value="en">English</SelectItem>
//                     <SelectItem value="hi">Hindi</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Page Size</label>
//                 <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="5">5 per page</SelectItem>
//                     <SelectItem value="10">10 per page</SelectItem>
//                     <SelectItem value="20">20 per page</SelectItem>
//                     <SelectItem value="50">50 per page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <Button onClick={handleSearch} disabled={MatchmakingState.loading}>
//                 <Search className="h-4 w-4 mr-2" />
//                 Search
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setSearchKeyword("")
//                   setSearchField("allFields")
//                   setStatusFilter("allStatus")
//                   setCurrentPage(1)
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Results Summary */}
//         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//           <div className="flex items-center gap-1">
//             <Users className="h-4 w-4" />
//             <span>Total Records: {MatchmakingState.pagination.totalCount}</span>
//           </div>
//           <div>
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>

//         {/* Error State */}
//         {MatchmakingState.error && (
//           <Alert variant="destructive">
//             <AlertDescription>{MatchmakingState.error}</AlertDescription>
//           </Alert>
//         )}

//         {/* Data Table */}
//         <Card>
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-16">#</TableHead>
//                     <TableHead>Boy Details</TableHead>
//                     <TableHead>Girl Details</TableHead>
//                     <TableHead>Birth Details</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Created</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {MatchmakingState.loading ? (
//                     // Loading skeleton
//                     Array.from({ length: pageSize }).map((_, index) => (
//                       <TableRow key={index}>
//                         <TableCell>
//                           <Skeleton className="h-4 w-8" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-24" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-24" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-32" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-20" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-20" />
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : MatchmakingState.data.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                         No matchmaking records found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     MatchmakingState.data.map((record: IMatchmaking, index: number) => (
//                       <TableRow key={record.id}>
//                         <TableCell className="font-mono text-sm font-medium">{getSequenceNumber(index)}</TableCell>
//                         <TableCell>
//                           <div className="space-y-1">
//                             <div className="font-medium">{record.boyName || "N/A"}</div>
//                             <div className="text-xs text-muted-foreground flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               {formatDate(record.boy_dob)}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="space-y-1">
//                             <div className="font-medium">{record.girlName || "N/A"}</div>
//                             <div className="text-xs text-muted-foreground flex items-center gap-1">
//                               <Calendar className="h-3 w-3" />
//                               {formatDate(record.girl_dob)}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="space-y-1 text-xs">
//                             <div className="flex items-center gap-1">
//                               <Clock className="h-3 w-3" />
//                               <span>Boy: {formatTime(record.boy_tob)}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Clock className="h-3 w-3" />
//                               <span>Girl: {formatTime(record.girl_tob)}</span>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="space-y-1">
//                             {record.boy_lat && record.boy_lon && (
//                               <LocationDisplay lat={record.boy_lat} lon={record.boy_lon} prefix="Boy" />
//                             )}
//                             {record.girl_lat && record.girl_lon && (
//                               <LocationDisplay lat={record.girl_lat} lon={record.girl_lon} prefix="Girl" />
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-xs text-muted-foreground">
//                           {record.createdAt ? formatDate(record.createdAt) : "N/A"}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-muted-foreground">
//               Showing {(currentPage - 1) * pageSize + 1} to{" "}
//               {Math.min(currentPage * pageSize, MatchmakingState.pagination.totalCount)} of{" "}
//               {MatchmakingState.pagination.totalCount} results
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1 || MatchmakingState.loading}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Previous
//               </Button>
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
//                   return (
//                     <Button
//                       key={pageNum}
//                       variant={currentPage === pageNum ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => handlePageChange(pageNum)}
//                       disabled={MatchmakingState.loading}
//                     >
//                       {pageNum}
//                     </Button>
//                   )
//                 })}
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages || MatchmakingState.loading}
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </PageContainer>
//   )
// }

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllMatchmaking,
  type IMatchmaking
} from '@/redux/slices/matchmaking/matchmakinglist';
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
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { RootState } from '@/redux/store';
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
            'User-Agent': 'MatchmakingApp/1.0'
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
        setError(result === 'Location unavailable');
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
const LocationDisplay = ({
  lat,
  lon,
  prefix
}: {
  lat?: string;
  lon?: string;
  prefix: string;
}) => {
  const { location, loading, error } = useLocationLookup(lat, lon);

  if (!lat || !lon) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{prefix}: N/A</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-xs">
        <MapPin className="h-3 w-3 animate-pulse" />
        <div className="flex items-center gap-1">
          <span>{prefix}:</span>
          <div className="flex space-x-1">
            <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.3s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.15s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-current"></div>
          </div>
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
        {prefix}: {location}
      </span>
    </div>
  );
};

export default function MatchmakingPage() {
  const dispatch = useDispatch();
  const { MatchmakingState } = useSelector(
    (state: RootState) => state.matchmakinglist
  );

  // Local state for filters and pagination
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchField, setSearchField] = useState('allFields');
  const [statusFilter, setStatusFilter] = useState('allStatus');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    handleFetchData();
  }, [currentPage, pageSize, statusFilter]);

  const handleFetchData = () => {
    dispatch(
      fetchAllMatchmaking({
        page: currentPage,
        limit: pageSize,
        field: searchField !== 'allFields' ? searchField : undefined,
        text: searchKeyword || undefined,
        lang: statusFilter !== 'allStatus' ? statusFilter : undefined
      }) as any
    );
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    handleFetchData();
  };

  const handleExport = () => {
    dispatch(
      fetchAllMatchmaking({
        exportData: true,
        limit: MatchmakingState.pagination.totalCount
      }) as any
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getSequenceNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const totalPages = Math.ceil(
    MatchmakingState.pagination.totalCount / pageSize
  );

  return (
    <PageContainer scrollable>
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Matchmaking Records
            </h1>
            <p className="text-muted-foreground">
              Manage and view all matchmaking compatibility reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={MatchmakingState.loading}
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
              Filter matchmaking records by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
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
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allFields">All Fields</SelectItem>
                    <SelectItem value="boyName">Boy Name</SelectItem>
                    <SelectItem value="girlName">Girl Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allStatus">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
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
              <Button
                onClick={handleSearch}
                disabled={MatchmakingState.loading}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchKeyword('');
                  setSearchField('allFields');
                  setStatusFilter('allStatus');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Total Records: {MatchmakingState.pagination.totalCount}</span>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Error State */}
        {MatchmakingState.error && (
          <Alert variant="destructive">
            <AlertDescription>{MatchmakingState.error}</AlertDescription>
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
                    <TableHead>Boy Details</TableHead>
                    <TableHead>Girl Details</TableHead>
                    <TableHead>Birth Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MatchmakingState.loading ? (
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
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : MatchmakingState.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No matchmaking records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    MatchmakingState.data.map(
                      (record: IMatchmaking, index: number) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm font-medium">
                            {getSequenceNumber(index)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {record.boyName || 'N/A'}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(record.boy_dob)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {record.girlName || 'N/A'}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(record.girl_dob)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Boy: {formatTime(record.boy_tob)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Girl: {formatTime(record.girl_tob)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {record.boy_lat && record.boy_lon && (
                                <LocationDisplay
                                  lat={record.boy_lat}
                                  lon={record.boy_lon}
                                  prefix="Boy"
                                />
                              )}
                              {record.girl_lat && record.girl_lon && (
                                <LocationDisplay
                                  lat={record.girl_lat}
                                  lon={record.girl_lon}
                                  prefix="Girl"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {record.createdAt
                              ? formatDate(record.createdAt)
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      )
                    )
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
                MatchmakingState.pagination.totalCount
              )}{' '}
              of {MatchmakingState.pagination.totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || MatchmakingState.loading}
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
                      onClick={() => handlePageChange(pageNum)}
                      disabled={MatchmakingState.loading}
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
                disabled={
                  currentPage === totalPages || MatchmakingState.loading
                }
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
