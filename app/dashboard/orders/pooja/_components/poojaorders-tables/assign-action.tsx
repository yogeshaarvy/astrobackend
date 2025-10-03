'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePoojaOrderStatus } from '@/redux/slices/astropooja/poojaorders';
import type { AppDispatch } from '@/redux/store';
import { toast } from 'sonner';

export const AssignAction = ({ data }: any) => {
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);

  const [assignStatus, setAssignStatus] = useState<'yes' | 'no' | ''>(
    data?.assignStatus || 'no'
  );
  const [assignDates, setAssignDates] = useState({
    assignedFrom: '',
    assignedTo: ''
  });

  const handleAssignStatusChange = (value: 'yes' | 'no') => {
    if (value === 'yes') {
      setAssignModalOpen(true);
    } else {
      handleAssignStatusUpdate('no', '', '');
    }
  };

  const handleAssignStatusUpdate = async (
    status: 'yes' | 'no' | '',
    assignedFrom: string,
    assignedTo: string
  ) => {
    try {
      setLoading(true);
      const result = await dispatch(
        updatePoojaOrderStatus({
          poojaId: data._id,
          poojaStatus: data.poojaStatus || '',
          assignStatus: status,
          assignedFrom: assignedFrom,
          assignedTo: assignedTo
        }) as any
      );

      if (updatePoojaOrderStatus.fulfilled.match(result)) {
        setAssignStatus(status);
        setAssignModalOpen(false);
        setAssignDates({ assignedFrom: '', assignedTo: '' });
        // Toast is already shown in the thunk
      }
    } catch (error) {
      toast.error('Failed to update assign status');
    } finally {
      setLoading(false);
    }
  };

  // Handle assign modal submit
  const handleAssignModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignDates.assignedFrom || !assignDates.assignedTo) {
      toast.error('Please select both dates');
      return;
    }

    // Validate that assignedTo is after assignedFrom
    if (new Date(assignDates.assignedTo) < new Date(assignDates.assignedFrom)) {
      toast.error('End date must be after start date');
      return;
    }

    handleAssignStatusUpdate(
      'yes',
      assignDates.assignedFrom,
      assignDates.assignedTo
    );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
        }}
        loading={loading}
      />

      {/* Assign Status Dropdown */}
      <div className="mr-4 inline-block">
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          value={assignStatus}
          onChange={(e) =>
            handleAssignStatusChange(e.target.value as 'no' | 'yes')
          }
          disabled={loading}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      {/* Assign Status Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Date Range</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignModalSubmit} className="space-y-4">
            <div>
              <Label htmlFor="assignedFrom">Assigned From</Label>
              <Input
                id="assignedFrom"
                type="date"
                value={assignDates.assignedFrom}
                onChange={(e) =>
                  setAssignDates({
                    ...assignDates,
                    assignedFrom: e.target.value
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                type="date"
                value={assignDates.assignedTo}
                onChange={(e) =>
                  setAssignDates({ ...assignDates, assignedTo: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAssignModalOpen(false);
                  setAssignDates({ assignedFrom: '', assignedTo: '' });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
