'use client';
import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  IndianRupee,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchSlotsList,
  setSlotsData,
  addEditSlot,
  deleteSlot
} from '@/redux/slices/astrologersSlice';
import { useRouter, useSearchParams } from 'next/navigation';

const SlotAdminPanel = () => {
  const {
    slotsState: { data: slotsData, loading: slotsLoading }
  } = useAppSelector((state) => state.astrologersData);

  const dispatch = useAppDispatch();

  const params = useSearchParams();
  const astroId = params.get('id') ?? undefined;
  const [showAddForm, setShowAddForm] = useState(false);
  // Define a Slot type or interface for better type safety
  interface Slot {
    _id?: string;
    pricing: { duration: number; price: string }[];
    title: string;
    // Add other slot fields as needed
  }
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [formData, setFormData] = useState({
    duration: 5,
    price: '',
    title: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allSlots, setAllSlots] = useState<any[]>([]); // Store all loaded slots
  const [totalCount, setTotalCount] = useState(0); // Total count from API
  const [hasMoreData, setHasMoreData] = useState(true);
  const itemsPerPage = 10;

  const resetForm = () => {
    setFormData({
      duration: 5,
      price: '',
      title: ''
    });
  };

  // Initial load
  useEffect(() => {
    loadInitialSlots();
  }, [dispatch]);

  // Load initial slots (first page)
  const loadInitialSlots = async () => {
    try {
      const response = await dispatch(
        fetchSlotsList({
          page: 1,
          pageSize: itemsPerPage,
          astroId
        })
      ).unwrap();

      if (response) {
        const slots = response.astroSlots || [];
        const total = response.totalCount || 0;

        setAllSlots(slots);
        setTotalCount(total);
        setCurrentPage(1);

        // Set hasMoreData based on whether there are more items than what we loaded
        setHasMoreData(total > slots.length);
      }
    } catch (error) {
      setAllSlots([]);
      setTotalCount(0);
      setHasMoreData(false);
    }
  };

  // Load more slots
  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await dispatch(
        fetchSlotsList({
          page: nextPage,
          pageSize: itemsPerPage,
          astroId
        })
      ).unwrap();

      if (response) {
        const newSlots = response.astroSlots || [];
        const newTotal = response.totalCount || totalCount;

        // Append new slots to existing ones
        setAllSlots((prevSlots) => [...prevSlots, ...newSlots]);
        setTotalCount(newTotal);
        setCurrentPage(nextPage);

        // Check if there's more data
        const totalLoaded = allSlots.length + newSlots.length;
        setHasMoreData(totalLoaded < newTotal);
      }
    } catch (error) {
      console.error('Error loading more slots:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Add or Update Slot
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validation: Check if title is provided
    if (!formData.title.trim()) {
      alert('Please enter a slot title');
      return;
    }

    // Validation: Check if duration and price are provided
    if (!formData.duration || formData.duration <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Prepare slot payload
    const slotPayload = {
      ...editingSlot,
      duration: Number(formData.duration),
      price: formData.price,
      title: formData.title.trim(),
      astroId
    };

    // Set slot data in slice for thunk
    dispatch(setSlotsData(slotPayload));
    // Call add or update thunk
    await dispatch(addEditSlot(editingSlot?._id || null));
    setShowAddForm(false);
    setEditingSlot(null);
    resetForm();

    // Reload first page to get updated data
    await loadInitialSlots();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value
    }));
  };

  const handleDurationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      duration: Number(value)
    }));
  };

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: value
    }));
  };

  const handleAddSlot = () => {
    setShowAddForm(true);
    setEditingSlot(null);
    resetForm();
  };

  const handleEditSlot = (slot: any) => {
    setEditingSlot(slot);
    setFormData({
      duration: slot.duration || 5,
      price: slot.price || '',
      title: slot.title || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteSlot = async (id: any) => {
    await dispatch(deleteSlot(id));
    // Remove the deleted slot from local state
    setAllSlots((prevSlots) => prevSlots.filter((slot) => slot._id !== id));
    setTotalCount((prev) => prev - 1);

    // If we're on the last item of a page and it's not the first page, reload
    if (allSlots.length === 1 && currentPage > 1) {
      await loadInitialSlots();
    }
  };

  // Calculate display values
  const displayedSlots = allSlots;
  const showingCount = allSlots.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="p-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-xl font-bold text-gray-800">
                Slot Management
              </h1>
              <p className="text-gray-600">Manage slots and pricing</p>
            </div>
            <Button onClick={handleAddSlot}>
              <Plus size={20} />
              Add Slot
            </Button>
          </div>

          {/* Slots List */}
          <div className="mb-8">
            {slotsLoading && allSlots.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <div className="text-gray-500">Loading slots...</div>
                </div>
              </div>
            ) : displayedSlots.length > 0 ? (
              <>
                {/* Stats Bar */}
                <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                  <div className="text-sm text-gray-600">
                    Showing{' '}
                    <span className="font-semibold">{showingCount}</span> of{' '}
                    <span className="font-semibold">{totalCount}</span> slots
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentPage > 1
                      ? `Pages 1-${currentPage}`
                      : `Page ${currentPage}`}
                  </div>
                </div>

                {/* Scrollable Slots Container */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  {/* Table Header - Fixed */}
                  <div className="border-b border-gray-200 bg-gray-50 p-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Slots List
                    </h3>
                  </div>

                  {/* Scrollable Content */}
                  <div
                    className="overflow-y-auto"
                    style={{ height: 'calc(100vh - 300px)' }}
                  >
                    <div className="divide-y divide-gray-200">
                      {displayedSlots.map((slot, index) => (
                        <div
                          key={slot?._id}
                          className="p-6 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                              {/* Slot Number */}
                              <div className="mb-4">
                                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800">
                                  {slot?.title}
                                </span>
                              </div>

                              {/* Pricing Display */}
                              <div className="mb-4">
                                <div className="mb-3 flex items-center gap-2">
                                  <IndianRupee
                                    size={18}
                                    className="text-green-600"
                                  />
                                  <p className="text-sm font-medium text-gray-700">
                                    Pricing
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {slot.duration && slot.price ? (
                                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800">
                                      {slot.duration} min - ₹{slot.price}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      No pricing set
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-shrink-0 gap-2">
                              <button
                                onClick={() => handleEditSlot(slot)}
                                className="rounded-lg bg-blue-100 p-2.5 text-blue-600 transition-colors hover:bg-blue-200"
                                title="Edit slot"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot._id)}
                                className="rounded-lg bg-red-100 p-2.5 text-red-600 transition-colors hover:bg-red-200"
                                title="Delete slot"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Load More Button - Inside scrollable area */}
                      {hasMoreData && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                          <div className="flex justify-center">
                            <Button
                              onClick={handleLoadMore}
                              disabled={loadingMore}
                            >
                              {loadingMore ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                  Loading more...
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={16} />
                                  Load More ({totalCount - showingCount}{' '}
                                  remaining)
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* End of List Message */}
                      {!hasMoreData && showingCount > 0 && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              {showingCount === totalCount
                                ? 'All slots loaded'
                                : "You've reached the end of the list"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Spacer to ensure content is visible */}
                      <div className="h-4"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white py-16 text-gray-500">
                <Clock size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No slots found</p>
                <p className="text-sm">
                  Click "Add Slot" to create your first slot
                </p>
              </div>
            )}
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                  {editingSlot ? 'Edit Slot' : 'Add New Slot'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Section */}
                  <div>
                    <label className="mb-2 block text-lg font-semibold text-gray-800">
                      Slot Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter slot title (e.g., Quick Consultation, Premium Reading)"
                      required
                    />
                  </div>

                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-lg font-semibold text-gray-800">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-transparent focus:ring-2 focus:ring-green-500"
                        placeholder="Enter duration in minutes"
                        min="1"
                        step="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-lg font-semibold text-gray-800">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-transparent focus:ring-2 focus:ring-green-500"
                        placeholder="Enter price in rupees"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-2">
                    <Button type="submit">
                      {editingSlot ? 'Update Slot' : 'Add Slot'}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingSlot(null);
                        resetForm();
                      }}
                      className="rounded-lg bg-gray-100 px-3 py-1 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotAdminPanel;
