'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Calendar, Save, X } from 'lucide-react';
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
  const [editingSlot, setEditingSlot] = useState<{
    dayIndex: number;
    slotIndex: number;
  } | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    hasMore: true,
    totalCount: 0
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const [formData, setFormData] = useState({
    astroId,
    availability: [
      {
        day: 'Monday',
        slots: [
          {
            slottype: '',
            startTime: '',
            time: ''
          }
        ]
      }
    ]
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

  const resetForm = () => {
    setFormData({
      availability: [
        {
          day: 'Monday',
          slots: [
            {
              slottype: slotsData.length > 0 ? (slotsData[0] as any)._id : '',
              startTime: '',
              time: ''
            }
          ]
        }
      ],
      astroId
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
      availability: item.availability,
      astroId
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
      await dispatch(addEditAvailability(editingItem?._id || null));
      setShowAddForm(false);
      setEditingItem(null);
      resetForm();

      // Reset pagination and reload first page
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
        hasMore: true
      }));

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
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const addAvailabilityDay = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          day: 'Monday',
          slots: [
            {
              slottype: slotsData.length > 0 ? (slotsData[0] as any)._id : '',
              startTime: '',
              time: ''
            }
          ]
        }
      ]
    }));
  };

  const removeAvailabilityDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const updateAvailabilityDay = (dayIndex: number, day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a, i) =>
        i === dayIndex ? { ...a, day } : a
      )
    }));
  };

  const addTimeSlot = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a, i) =>
        i === dayIndex
          ? {
              ...a,
              slots: [
                ...a.slots,
                {
                  slottype:
                    slotsData.length > 0 ? (slotsData[0] as any)._id : '',
                  startTime: '',
                  time: ''
                }
              ]
            }
          : a
      )
    }));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a, i) =>
        i === dayIndex
          ? {
              ...a,
              slots: a.slots.filter((_, si) => si !== slotIndex)
            }
          : a
      )
    }));
  };

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a, i) => {
        if (i === dayIndex) {
          return {
            ...a,
            slots: a.slots.map((slot, si) => {
              if (si === slotIndex) {
                return { ...slot, [field]: value };
              }
              return slot;
            })
          };
        }
        return a;
      })
    }));
  };

  return (
    <PageContainer scrollable>
      <div className="mx-auto max-w-6xl">
        <Card className="w-full shadow-xl">
          <CardHeader className="px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-xl font-bold text-gray-800 sm:text-2xl">
                  Astrologer Availabilities
                </CardTitle>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Manage availability schedules
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  onClick={handleAddNew}
                  className="bg-blue-600 px-3 py-2 text-sm hover:bg-blue-700"
                >
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
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <Calendar
                            className="flex-shrink-0 text-blue-600"
                            size={20}
                          />
                          <h3 className="truncate text-base font-semibold sm:text-lg">
                            Availability Schedule #{itemIndex + 1}
                          </h3>
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="flex-1 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 sm:flex-none"
                          >
                            <Edit size={14} className="mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                            className="flex-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 sm:flex-none"
                          >
                            <Trash2 size={14} className="mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 sm:px-6">
                      <div className="w-full overflow-x-auto">
                        <div className="min-w-[480px]">
                          <Table className="w-full table-fixed">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">Day</TableHead>
                                <TableHead className="w-[120px]">
                                  Type
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Time
                                </TableHead>
                                <TableHead className="w-[80px]">Min</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {item.availability.map(
                                (avail: any, dayIndex: number) =>
                                  avail.slots.map(
                                    (slot: any, slotIndex: number) => (
                                      <TableRow
                                        key={`${dayIndex}-${slotIndex}`}
                                        className="hover:bg-gray-50"
                                      >
                                        <TableCell className="p-2 font-medium">
                                          <Badge
                                            variant="outline"
                                            className="whitespace-nowrap bg-blue-100 px-1 py-0.5 text-[10px] text-blue-800"
                                          >
                                            {avail.day.slice(0, 3)}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Badge
                                            variant="secondary"
                                            className="inline-block max-w-[100px] truncate px-1 py-0.5 text-[10px]"
                                            title={getSlotTitleById(
                                              slot.slottype
                                            )}
                                          >
                                            {getSlotTitleById(slot.slottype)}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <div className="flex items-center gap-1">
                                            <Clock
                                              size={10}
                                              className="flex-shrink-0 text-gray-500"
                                            />
                                            <span className="text-xs">
                                              {slot.startTime}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                          <Badge
                                            variant="outline"
                                            className="whitespace-nowrap px-1 py-0.5 text-[10px]"
                                          >
                                            {slot.time}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )
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
            <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {editingItem ? 'Edit Availability' : 'Add New Availability'}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <Calendar className="text-blue-600" size={20} />
                        Availability Schedule
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addAvailabilityDay}
                        className="border-blue-200 bg-blue-50 text-blue-600"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Day
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.availability.map((avail, dayIndex) => (
                        <Card key={dayIndex} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="mb-4 flex items-center justify-between">
                              <Select
                                value={avail.day}
                                onValueChange={(value) =>
                                  updateAvailabilityDay(dayIndex, value)
                                }
                              >
                                <SelectTrigger className="w-48">
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

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTimeSlot(dayIndex)}
                                  className="border-green-200 bg-green-50 text-green-600"
                                >
                                  <Plus size={14} className="mr-1" />
                                  Add Slot
                                </Button>
                                {formData.availability.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      removeAvailabilityDay(dayIndex)
                                    }
                                    className="border-red-200 bg-red-50 text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3">
                              {avail.slots.map((slot, slotIndex) => (
                                <div
                                  key={slotIndex}
                                  className="flex items-end gap-4 rounded-lg bg-gray-50 p-3"
                                >
                                  <div className="flex-1">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                      Slot Type
                                    </label>
                                    <Select
                                      value={slot.slottype}
                                      onValueChange={(value) =>
                                        updateSlot(
                                          dayIndex,
                                          slotIndex,
                                          'slottype',
                                          value
                                        )
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

                                  <div className="flex-1">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                      Start Time
                                    </label>
                                    <Input
                                      type="time"
                                      value={slot.startTime}
                                      onChange={(e) =>
                                        updateSlot(
                                          dayIndex,
                                          slotIndex,
                                          'startTime',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="flex-1">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                      Duration (min)
                                    </label>
                                    <Input
                                      type="number"
                                      value={slot.time}
                                      onChange={(e) =>
                                        updateSlot(
                                          dayIndex,
                                          slotIndex,
                                          'time',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., 30, 60"
                                      min="1"
                                    />
                                  </div>

                                  {avail.slots.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeTimeSlot(dayIndex, slotIndex)
                                      }
                                      className="border-red-200 bg-red-50 text-red-600"
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 border-t pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
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
