'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Clock, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSingleTicket } from '@/redux/slices/adminSupportSlice';
import { useAdminChat } from '@/hooks/useChat';

interface Message {
  id: string;
  content: string;
  sender: 'admin' | 'user';
  timestamp: string | Date;
  isRead: boolean;
}

export default function AdminSupportChat() {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const params = useParams();
  const ticketId = params?.ticketId as string;
  const dispatch = useAppDispatch();
  const adminId = '67c6d005ca2af808a28c560c';

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const {
    singleAdminSupportState: { data: currentTicket, loading }
  } = useAppSelector((state: any) => state.ticketsData);

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchSingleTicket({ ticketId }));
    }
  }, [ticketId, dispatch]);

  const handleIncomingMessage = useCallback((msg: any) => {
    if (!msg.message && !msg.mediaUrl) return;

    const formattedMsg: Message = {
      id: msg.id,
      content: msg.message ?? '',
      sender: msg.sender,
      timestamp: msg.timestamp,
      isRead: true
    };

    setChatMessages((prev) => {
      const hasTemp = prev.some(
        (m) => m.id.startsWith('temp-') && m.content === formattedMsg.content
      );

      if (hasTemp) {
        return prev.map((m) =>
          m.id.startsWith('temp-') && m.content === formattedMsg.content
            ? formattedMsg
            : m
        );
      } else {
        return [...prev, formattedMsg];
      }
    });
  }, []);

  const handleHistoryMessages = useCallback((history: any[]) => {
    const formattedHistory = history.map((msg) => ({
      id: msg._id || msg.id,
      content: msg.message || '',
      sender: msg.sender,
      timestamp: msg.timestamp,
      isRead: true
    }));
    setChatMessages(formattedHistory);
  }, []);

  const { sendMessage } = useAdminChat(
    ticketId,
    adminId,
    handleIncomingMessage,
    handleHistoryMessages
  );

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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      sender: 'admin',
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setChatMessages((prev) => [...prev, tempMsg]);

    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <PageContainer scrollable>
      <div className="flex h-screen flex-col bg-white">
        {/* Header */}
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
                <AvatarFallback>
                  {currentTicket?.userId?.name?.[0] || 'U'}
                </AvatarFallback>
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

        {/* User Info */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{currentTicket?.userId?.email}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {chatMessages.map((message) => (
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
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
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
