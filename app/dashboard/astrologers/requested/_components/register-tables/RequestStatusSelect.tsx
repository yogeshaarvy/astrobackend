// components/RequestStatusSelect.tsx

'use client';

import React from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import {
  updateRequestData,
  addEditRequest,
  IRequest
} from '@/redux/slices/astrologersSlice';

export default function RequestStatusSelect({
  request
}: {
  request: IRequest;
}) {
  const dispatch = useAppDispatch();
  const [status, setStatus] = React.useState(request.status);
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    const updatedData = {
      ...request,
      status: newStatus
    };

    try {
      await dispatch(updateRequestData(updatedData));
      await dispatch(addEditRequest(request._id || null)).unwrap();
      toast.success('Status Updated Successfully!');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to Update Status');
    }
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      className={`rounded border px-2 py-1 text-sm ${
        status === 'accepted'
          ? 'bg-green-200'
          : status === 'rejected'
          ? 'bg-red-200'
          : 'bg-yellow-200'
      }`}
    >
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );
}
