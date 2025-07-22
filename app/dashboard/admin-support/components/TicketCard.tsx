'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => handleNavigateToChat(ticket?._id)}
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
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
