'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Plus, X, Loader2 } from 'lucide-react';
import {
  fetchReviewList,
  addEditReview,
  updateReviewData
} from '@/redux/slices/reviewsSlice';
import { RootState } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const AdminRatingPanel = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Redux state selectors
  const { reviewListState, singlereviewState } = useSelector(
    (state: RootState) => state.reviews
  );
  console.log('review list state is', reviewListState);
  const { data: reviews, loading: listLoading, pagination } = reviewListState;
  const { loading: submitLoading, error: submitError } = singlereviewState;
  const params = useSearchParams();

  const astroId = params.get('id');

  // Local state for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    rating: 0,
    review: ''
  });

  // Fetch reviews on component mount
  useEffect(() => {
    dispatch(fetchReviewList({ astroId, page: 1, pageSize: 10 }));
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating star click
  const handleRatingClick = (rating: any) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  // Open modal for adding new review
  const handleAddReview = () => {
    setFormData({ username: '', email: '', rating: 0, review: '' });
    setEditingReviewId(null);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.username ||
      !formData.email ||
      formData.rating === 0 ||
      !formData.review
    ) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Update Redux state with form data
      dispatch(
        updateReviewData({
          username: formData.username,
          rating: formData.rating,
          review: formData.review
        })
      );

      // Submit the review
      await dispatch(addEditReview(editingReviewId)).unwrap();

      // Close modal on success
      setShowModal(false);
      setFormData({ username: '', email: '', rating: 0, review: '' });

      // Show success message
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ username: '', email: '', rating: 0, review: '' });
    setShowModal(false);
    setEditingReviewId(null);
  };

  // Handle pagination
  const handlePageChange = (newPage: any) => {
    dispatch(
      fetchReviewList({
        astroId,
        page: newPage,
        pageSize: pagination.pageSize
      })
    );
  };

  // Star rating component
  const StarRating = ({ rating, onRatingClick, interactive = false }: any) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onRatingClick(star)}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reviews Management
            </h1>
            <p className="text-gray-600">
              Total Reviews: {pagination.totalCount} | Page {pagination.page} of{' '}
              {Math.ceil(pagination.totalCount / pagination.pageSize)}
            </p>
          </div>
          {/* <Button
            onClick={handleAddReview}
            disabled={!!submitLoading}
          
          >
            <Plus className="h-4 w-4" />
            Add Review
          </Button> */}
        </div>

        {/* Loading State */}
        {listLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading reviews...</span>
          </div>
        )}

        {/* Table */}
        {!listLoading && (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Review
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review?.userId?.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {review?.userId?.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StarRating rating={review.rating || 0} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-900">
                          {review.review}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          review.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {review.status ? 'Active' : 'Inactive'}
                        </span>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalCount > pagination.pageSize && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                <div className="flex flex-1 justify-between">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.totalCount
                    )}{' '}
                    of {pagination.totalCount} results
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={
                      pagination.page >=
                      Math.ceil(pagination.totalCount / pagination.pageSize)
                    }
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add New Review</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    User Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <StarRating
                    rating={formData.rating}
                    onRatingClick={handleRatingClick}
                    interactive={true}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Review
                  </label>
                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter review text"
                  />
                </div>

                {submitError && (
                  <div className="text-sm text-red-600">
                    Error: {submitError}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Cancel
                </button>
                <Button onClick={handleSubmit} disabled={!!submitLoading}>
                  {submitLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {submitLoading ? 'Adding...' : 'Add Review'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRatingPanel;
