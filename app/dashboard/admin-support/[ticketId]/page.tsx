'use client';

import { use, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSingleTicket } from '@/redux/slices/adminSupportSlice';
import { useSelector } from 'react-redux';

interface Message {
  id: string;
  content: string;
  sender: 'admin' | 'user';
  timestamp: Date;
  isRead: boolean;
}

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  subject: string;
  status: 'in-process' | 'resolved' | 'pending';
  priority: 'high' | 'medium' | 'low';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.johnson@email.com',
    userAvatar: '/placeholder.svg?height=40&width=40',
    subject: 'Payment Issue',
    status: 'in-process',
    priority: 'high',
    lastMessage: 'I still cannot process my payment',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    messages: [
      {
        id: '1',
        content: "Hi, I'm having trouble with my payment processing",
        sender: 'user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: true
      },
      {
        id: '2',
        content:
          "Hello Sarah! I'm here to help you with your payment issue. Can you please provide more details about the error you're experiencing?",
        sender: 'admin',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        content: 'I still cannot process my payment',
        sender: 'user',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false
      }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Mike Chen',
    userEmail: 'mike.chen@email.com',
    userAvatar: '/placeholder.svg?height=40&width=40',
    subject: 'Account Access',
    status: 'pending',
    priority: 'medium',
    lastMessage: 'Thank you for your help!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: '1',
        content: "I can't access my account",
        sender: 'user',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '2',
        content: "I've reset your password. Please check your email.",
        sender: 'admin',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        content: 'Thank you for your help!',
        sender: 'user',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      }
    ]
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emma Davis',
    userEmail: 'emma.davis@email.com',
    userAvatar: '/placeholder.svg?height=40&width=40',
    subject: 'Feature Request',
    status: 'resolved',
    priority: 'low',
    lastMessage: 'Perfect, that works great!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: '1',
        content: 'Can you add a dark mode feature?',
        sender: 'user',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '2',
        content:
          "Great suggestion! I've forwarded this to our development team.",
        sender: 'admin',
        timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        content: 'Perfect, that works great!',
        sender: 'user',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true
      }
    ]
  }
];

export default function AdminSupportChat() {
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [ticketIdInput, setTicketIdInput] = useState('');
  const params = useParams();
  const dispatch = useAppDispatch();

  const ticketId = params?.ticketId as string;
  const {
    singleAdminSupportState: { data: currentTicket, loading }
  } = useSelector((state: any) => state.ticketsData);
  console.log('Current currentTicket..............:', currentTicket);
  //   const currentTicket = mockTickets[currentTicketIndex]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-process':
        return <Clock className="h-3 w-3" />;
      case 'resolved':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-process':
        return 'bg-[#D4A574] text-white';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  useEffect(() => {
    dispatch(fetchSingleTicket({ ticketId }));
  }, [ticketId, dispatch]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      isRead: true
    };

    // Update the current ticket with the new message
    mockTickets[currentTicketIndex].messages.push(message);
    mockTickets[currentTicketIndex].lastMessage = newMessage;
    mockTickets[currentTicketIndex].lastMessageTime = new Date();

    setNewMessage('');
  };

  const handlePrevTicket = () => {
    setCurrentTicketIndex((prev) =>
      prev > 0 ? prev - 1 : mockTickets.length - 1
    );
  };

  const handleNextTicket = () => {
    setCurrentTicketIndex((prev) =>
      prev < mockTickets.length - 1 ? prev + 1 : 0
    );
  };

  const handleTicketSearch = () => {
    const ticketIndex = mockTickets.findIndex(
      (ticket) => ticket.id === ticketIdInput
    );
    if (ticketIndex !== -1) {
      setCurrentTicketIndex(ticketIndex);
      setTicketIdInput('');
    }
  };

  return (
    <PageContainer scrollable>
      <div className="flex h-screen flex-col bg-white">
        {/* Header with Ticket Navigation */}
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Support Ticket #{currentTicket?.ticketId}
            </h1>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={currentTicket?.userAvatar || '/placeholder.svg'}
                />
                <AvatarFallback>{currentTicket?.userId?.name}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentTicket?.userId?.name}
                </h2>
                <p className="text-sm text-gray-500">{currentTicket?.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(currentTicket?.status)}`}>
                {getStatusIcon(currentTicket?.status)}
                <span className="ml-1 capitalize">
                  {currentTicket?.status?.replace('-', ' ')}
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* User Info Panel */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {/* <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>ID: {currentTicket?.userId?.name}</span>
          </div> */}
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{currentTicket?.userId?.email}</span>
            </div>
            {/* <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Priority: {currentTicket.priority}</span>
          </div> */}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentTicket?.messages?.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'admin' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                    message.sender === 'admin'
                      ? 'bg-[#D4A574] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.sender === 'admin'
                        ? 'text-white/70'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-[#D4A574] text-white hover:bg-[#C19660]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
