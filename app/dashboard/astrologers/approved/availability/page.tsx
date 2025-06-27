'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Save,
  X,
  IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  addEditAvailability,
  fetchAvailabilityList,
  fetchSlotsList,
  setAvailabilityData
} from '@/redux/slices/astrologersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { toast } from 'sonner';

const AstrologerAvailabilities = () => {
  const {
    availabilityState: { data: aData, loading },
    slotsState: { data: slotsData, loading: slotsLoading }
  } = useAppSelector((state) => state.astrologersData);

  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const astroId = params.get('id');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    hasMore: true,
    totalCount: 0
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const [formData, setFormData] = useState({
    astroId,
    day: 'Monday',
    slottype: '',
    startTime: '',
    slotno: 0
  });

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  // Helper function to get slot title by ID
  const getSlotTitleById = (slotId: string) => {
    const slot = slotsData.find((item: any) => item._id === slotId);
    return slot ? (slot as any).title : 'Unknown Slot';
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Handle both HH:MM and HH:MM:SS formats
    const timeParts = timeString.split(':');
    if (timeParts.length >= 2) {
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return timeString;
  };

  const resetForm = () => {
    setFormData({
      astroId,
      day: 'Monday',
      slottype: slotsData.length > 0 ? (slotsData[0] as any)._id : '',
      startTime: '',
      slotno: 0
    });
  };

  useEffect(() => {
    if (astroId) {
      dispatch(
        fetchSlotsList({
          page: 1,
          astroId: astroId ?? undefined
        })
      );
      // Initial load with pagination
      dispatch(
        fetchAvailabilityList({
          page: 1,
          pageSize: pagination.limit,
          astroId: astroId ?? undefined
        })
      ).then((result: any) => {
        if (result.payload) {
          setPagination((prev) => ({
            ...prev,
            totalCount: result.payload.totalCount || 0,
            hasMore: result.payload.data?.length === pagination.limit
          }));
        }
      });
    }
  }, [astroId, dispatch]);

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
    resetForm();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      astroId,
      day: item?.day,
      slottype: item?.slottype,
      startTime: item?.startTime,
      slotno: item?.slotno
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      // Implement delete functionality
      console.log('Deleting:', id);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !pagination.hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = pagination.currentPage + 1;
      const result = await dispatch(
        fetchAvailabilityList({
          page: nextPage,
          pageSize: pagination.limit,
          astroId: astroId ?? ''
        })
      ).unwrap();

      if (result.data && result.data.length > 0) {
        setPagination((prev) => ({
          ...prev,
          currentPage: nextPage,
          hasMore: result.data.length === pagination.limit,
          totalCount: result.totalCount || prev.totalCount
        }));
      } else {
        setPagination((prev) => ({
          ...prev,
          hasMore: false
        }));
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setAvailabilityData(formData));
      await dispatch(addEditAvailability(editingItem?._id || null)).then(
        async (res) => {
          console.log('respone data is ', res);
          if (res?.payload?.success) {
            setShowAddForm(false);
            setEditingItem(null);
            resetForm();
            setPagination((prev) => ({
              ...prev,
              currentPage: 1,
              hasMore: true
            }));
            toast.success('availability added successfully');
            const result = await dispatch(
              fetchAvailabilityList({
                page: 1,
                pageSize: pagination.limit,
                astroId: astroId ?? ''
              })
            ).unwrap();

            if (result) {
              setPagination((prev) => ({
                ...prev,
                totalCount: result.totalCount || 0,
                hasMore: result.data?.length === pagination.limit
              }));
            }
          } else {
            const errorMessage =
              (res as any)?.error?.message ||
              (res as any)?.payload?.message ||
              'An error occurred while saving availability.';
            toast.error(errorMessage);
          }
        }
      );
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="mx-auto max-w-7xl">
        <Card className="w-full shadow-xl">
          <CardHeader className="px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-xl font-bold text-gray-800 sm:text-2xl">
                  Astrologer Availabilities
                </CardTitle>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Manage availability schedules with time slots
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleAddNew}>
                  <Plus size={16} className="mr-1" />
                  <span className="hidden sm:inline">Add</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : aData.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">
                  No availabilities found. Add your first availability schedule.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {aData.map((item: any, itemIndex: number) => (
                  <Card
                    key={item._id}
                    className="w-full overflow-hidden border border-gray-200"
                  >
                    <CardHeader className="px-4 pb-4 sm:px-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Calendar
                            className="flex-shrink-0 text-blue-600"
                            size={20}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {item?.day}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {/* {getSlotTitleById(item?.slottype)} • */}
                              {item?.slots?.length || 0} time slots
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
                      <div className="w-full overflow-x-auto">
                        <div className="min-w-[600px]">
                          <Table className="w-full">
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                {/* <TableHead className="w-[100px] font-semibold">Day</TableHead> */}
                                <TableHead className="w-[120px] font-semibold">
                                  Start Time
                                </TableHead>
                                <TableHead className="w-[120px] font-semibold">
                                  End Time
                                </TableHead>
                                <TableHead className="w-[100px] font-semibold">
                                  Duration
                                </TableHead>
                                <TableHead className="w-[100px] font-semibold">
                                  Changes
                                </TableHead>
                                {/* <TableHead className="font-semibold">Status</TableHead> */}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {item?.slots && item.slots.length > 0 ? (
                                item.slots.map(
                                  (slot: any, slotIndex: number) => (
                                    <TableRow
                                      key={slot._id || slotIndex}
                                      className="hover:bg-gray-50"
                                    >
                                      {/* {slotIndex === 0 && (
                                      <TableCell className="p-3 font-medium border-r" rowSpan={item.slots.length}>
                                        <Badge
                                          variant="outline"
                                          className="whitespace-nowrap bg-blue-100 px-2 py-1 text-xs text-blue-800 font-medium"
                                        >
                                          {item?.day}
                                        </Badge>
                                      </TableCell>
                                    )}
                                     */}
                                      <TableCell className="p-3">
                                        <div className="flex items-center gap-1">
                                          <Clock
                                            size={14}
                                            className="text-green-600"
                                          />
                                          <span className="text-sm font-medium text-green-700">
                                            {formatTime(slot?.startTime)}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="p-3">
                                        <div className="flex items-center gap-1">
                                          <Clock
                                            size={14}
                                            className="text-red-600"
                                          />
                                          <span className="text-sm font-medium text-red-700">
                                            {formatTime(slot?.endTime)}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="p-3">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {(() => {
                                            if (
                                              slot.startTime &&
                                              slot.endTime
                                            ) {
                                              const start = new Date(
                                                `2000-01-01T${slot.startTime}`
                                              );
                                              const end = new Date(
                                                `2000-01-01T${slot.endTime}`
                                              );
                                              const diffMs =
                                                end.getTime() - start.getTime();
                                              const diffMins = Math.floor(
                                                diffMs / (1000 * 60)
                                              );
                                              return `${diffMins}min`;
                                            }
                                            return 'N/A';
                                          })()}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="p-3">
                                        <div className="flex items-center gap-1">
                                          <IndianRupee
                                            size={14}
                                            className="text-green-600"
                                          />{' '}
                                          <span className="text-black-700 text-sm font-medium">
                                            {slot?.price}
                                          </span>
                                        </div>
                                      </TableCell>
                                      {/* <TableCell className="p-3">
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200 text-xs"
                                      >
                                        Available
                                      </Badge>
                                    </TableCell> */}
                                    </TableRow>
                                  )
                                )
                              ) : (
                                <TableRow>
                                  <TableCell className="p-3 font-medium">
                                    <Badge
                                      variant="outline"
                                      className="whitespace-nowrap bg-blue-100 px-2 py-1 text-xs text-blue-800"
                                    >
                                      {item?.day}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="p-3">
                                    <Badge
                                      variant="secondary"
                                      className="inline-block max-w-[130px] truncate px-2 py-1 text-xs"
                                      title={getSlotTitleById(item?.slottype)}
                                    >
                                      {getSlotTitleById(item?.slottype)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell
                                    className="p-3 text-center text-gray-500"
                                    colSpan={4}
                                  >
                                    No time slots configured
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Section */}
            {aData.length > 0 && (
              <div className="mt-8 space-y-4 text-center">
                <div className="text-sm text-gray-600">
                  Showing {aData.length} of {pagination.totalCount} availability
                  schedules
                </div>

                {pagination.hasMore && (
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    {loadingMore ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        Loading More...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Load More
                      </>
                    )}
                  </Button>
                )}

                {!pagination.hasMore && aData.length > 0 && (
                  <p className="text-sm text-gray-500">
                    No more availability schedules to load
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {editingItem ? 'Edit Availability' : 'Add New Availability'}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Calendar className="text-blue-600" size={20} />
                      Availability Schedule
                    </h3>

                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Day Selection */}
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Day
                            </label>
                            <Select
                              value={formData.day}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  day: value
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {daysOfWeek.map((day) => (
                                  <SelectItem key={day} value={day}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Single Slot Configuration */}
                          <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <h4 className="text-sm font-medium text-gray-700">
                              Time Slot Configuration
                            </h4>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Slot Type
                                </label>
                                <Select
                                  value={formData.slottype}
                                  onValueChange={(value) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      slottype: value
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Slot Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {slotsData.map((item: any) => (
                                      <SelectItem
                                        key={item._id}
                                        value={item._id}
                                      >
                                        {item.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Start Time
                                </label>
                                <Input
                                  type="time"
                                  value={formData.startTime}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      startTime: e.target.value
                                    }))
                                  }
                                  required
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                  Number of Slots
                                </label>
                                <Input
                                  type="number"
                                  value={formData.slotno}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      slotno:
                                        Number.parseInt(e.target.value) || 0
                                    }))
                                  }
                                  placeholder="e.g., 5"
                                  min="1"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-4 border-t pt-4">
                    <Button type="submit">
                      <Save size={16} className="mr-2" />
                      {editingItem ? 'Update Availability' : 'Add Availability'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                        resetForm();
                      }}
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default AstrologerAvailabilities;
