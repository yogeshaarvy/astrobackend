'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAppDispatch } from '@/redux/hooks';
import { editTicktStatus } from '@/redux/slices/adminSupportSlice';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Ticket {
  _id: string;
  title: string;
  message: string;
  image: string;
  status: 'open' | 'in-process' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  assignee?: string;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'open':
      return <AlertCircle className="h-4 w-4" />;
    case 'in-process':
      return <Clock className="h-4 w-4" />;
    case 'closed':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'open':
      return 'destructive';
    case 'in-process':
      return 'default';
    case 'closed':
      return 'secondary';
    default:
      return 'default';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTicketStatus = async (newStatus: string) => {
    if (newStatus === ticket.status) return; // Don't update if status is the same

    setIsUpdating(true);
    try {
      const result = await dispatch(
        editTicktStatus({
          entityId: ticket._id, // Send ticket ID
          status: newStatus
        })
      );
      if (result?.payload?.success) {
        toast.success('Ticket status updated successfully');
      } else {
        toast.error('Something went wrong while updating ticket status');
      }
    } catch (error) {
      toast.error('Error updating ticket status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNavigateToChat = (ticketId: string) => {
    // Navigate to the chat page with the ticket ID
    router.push(`/dashboard/admin-support/${ticketId}`);
  };

  return (
    <Card className="mb-4 transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 text-lg font-semibold">
              {ticket?.title}
            </CardTitle>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant={getStatusColor(ticket.status)}
                className="flex items-center gap-1"
              >
                {getStatusIcon(ticket.status)}
                {ticket.status.replace('-', ' ')}
              </Badge>
              {/* <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}
              >
                {ticket.priority} priority
              </span> */}
            </div>
            <p className="text-sm text-muted-foreground">
              Created:{' '}
              {new Date(ticket?.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>

            {ticket.assignee && (
              <p className="text-sm text-muted-foreground">
                Assigned to: {ticket.assignee}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleNavigateToChat(ticket?._id)}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>

            {/* Status Update Select */}
            <Select
              value={ticket.status}
              onValueChange={handleUpdateTicketStatus}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    Open
                  </div>
                </SelectItem>
                <SelectItem value="in-process">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    In Process
                  </div>
                </SelectItem>
                <SelectItem value="closed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Closed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="mb-3 text-sm text-gray-700">{ticket.message}</p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={ticket?.image}
              alt="Ticket attachment"
              className="h-16 w-24 rounded-md border object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
