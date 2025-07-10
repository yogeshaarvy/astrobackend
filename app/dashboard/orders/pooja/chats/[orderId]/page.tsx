'use client';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  Calendar,
  MapPin,
  Clock,
  User,
  MoreVertical,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  isRead: boolean;
}

interface PoojaBooking {
  id: string;
  poojaType: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingDate: Date;
  bookingTime: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  specialRequests?: string;
  panditName?: string;
  totalAmount: number;
  advancePaid: number;
  isOnline: boolean;
  avatar?: string;
}

const PoojaSpecificChat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Mock booking data - this would come from props or API
  const poojaBooking: PoojaBooking = {
    id: 'booking_123',
    poojaType: 'Ganesh Pooja',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@email.com',
    userPhone: '+91 98765 43210',
    bookingDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    bookingTime: '10:00 AM',
    location: 'A-123, Sector 15, Gurugram, Haryana',
    status: 'confirmed',
    specialRequests: 'Please bring fresh flowers and sweets for prasad',
    panditName: 'Pandit Rajesh Kumar',
    totalAmount: 5000,
    advancePaid: 2000,
    isOnline: true
  };

  // Mock messages for this specific pooja booking
  const mockMessages: Message[] = [
    {
      id: '1',
      text: `Hello! I have booked ${
        poojaBooking.poojaType
      } for ${poojaBooking.bookingDate.toLocaleDateString()}. Can you please confirm the details?`,
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true
    },
    {
      id: '2',
      text: `Namaste ${poojaBooking.userName}! Thank you for booking ${
        poojaBooking.poojaType
      } with us. Your booking is confirmed for ${poojaBooking.bookingDate.toLocaleDateString()} at ${
        poojaBooking.bookingTime
      }. ${poojaBooking.panditName} will be conducting the pooja.`,
      sender: 'admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isRead: true
    },
    {
      id: '3',
      text: 'What items should I arrange for the pooja? Do I need to buy anything specific?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: true
    },
    {
      id: '4',
      text: 'For Ganesh Pooja, please arrange: Fresh flowers (marigold and roses), fruits (especially bananas and coconut), sweets (modak or laddoo), incense sticks, and a clean cloth for the altar. Our pandit will bring all other necessary items including the Ganesh idol, kalash, and puja materials.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      isRead: true
    },
    {
      id: '5',
      text: "Perfect! Also, I have a special request - can we include some additional prayers for my family's health and prosperity?",
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true
    },
    {
      id: '6',
      text: "We can include special prayers for your family's health and prosperity. I've noted this in your booking. The pandit will perform additional mantras for this purpose.",
      sender: 'admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isRead: true
    },
    {
      id: '7',
      text: 'Thank you so much! What time should I expect the pandit to arrive?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: false
    },
    {
      id: '8',
      text: 'Will the pandit bring the Ganesh idol or should I arrange it?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    // Mock Socket.io connection
    setIsConnected(true);

    // In real implementation, initialize socket here:
    // socketRef.current = io('http://localhost:3001');
    // socketRef.current.emit('join-booking', poojaBooking.id);
    // socketRef.current.on('connect', () => setIsConnected(true));
    // socketRef.current.on('message', handleReceiveMessage);
    // socketRef.current.on('typing', (data) => setIsTyping(data.isTyping));

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'admin',
      timestamp: new Date(),
      isRead: false
    };

    setMessages((prev) => [...prev, newMessage]);
    // In real implementation, emit socket message here:
    // socketRef.current.emit('message', {
    //   message: newMessage,
    //   bookingId: poojaBooking.id,
    //   userId: poojaBooking.userEmail
    // });

    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${
                    poojaBooking.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  {poojaBooking.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {poojaBooking.poojaType}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{poojaBooking.userName}</span>
                    <span>•</span>
                    <span>{poojaBooking.userEmail}</span>
                    <span>•</span>
                    <span>{poojaBooking.userPhone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <Video className="h-5 w-5 text-gray-600" />
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Booking Details Sidebar */}
        <div className="w-80 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Booking Details
            </h2>

            {/* Status */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <div
                className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm ${getStatusColor(
                  poojaBooking.status
                )}`}
              >
                {getStatusIcon(poojaBooking.status)}
                <span className="capitalize">{poojaBooking.status}</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(poojaBooking.bookingDate)}</span>
                <Clock className="ml-2 h-4 w-4" />
                <span>{poojaBooking.bookingTime}</span>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>{poojaBooking.location}</span>
              </div>
            </div>

            {/* Pandit */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pandit
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{poojaBooking.panditName}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Payment
              </label>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-semibold">
                    ₹{poojaBooking.totalAmount}
                  </span>
                </div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Advance Paid:</span>
                  <span className="text-green-600">
                    ₹{poojaBooking.advancePaid}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 text-sm font-semibold">
                  <span>Remaining:</span>
                  <span className="text-red-600">
                    ₹{poojaBooking.totalAmount - poojaBooking.advancePaid}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {poojaBooking.specialRequests && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Special Requests
                </label>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm text-amber-800">
                    {poojaBooking.specialRequests}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white transition-all duration-200 hover:from-green-600 hover:to-green-700">
                Mark as Completed
              </button>
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700">
                Send Reminder
              </button>
              <button className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-white transition-all duration-200 hover:from-amber-700 hover:to-amber-800">
                Reschedule
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chat - {poojaBooking.poojaType}
                </h3>
                <p className="text-sm text-gray-600">
                  Booking ID: {poojaBooking.id} •{' '}
                  {formatDate(poojaBooking.bookingDate)} at{' '}
                  {poojaBooking.bookingTime}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {poojaBooking.isOnline && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Online</span>
                  </div>
                )}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-amber-600">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-amber-600"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-amber-600"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-amber-600"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-sm">typing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 lg:max-w-md ${
                    msg.sender === 'admin'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                      : 'border border-gray-200 bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs opacity-75">
                      {msg.sender === 'admin' ? 'Admin' : poojaBooking.userName}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Type your message to ${poojaBooking.userName}...`}
                className="flex-1 rounded-full border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 text-white transition-all duration-200 hover:from-amber-700 hover:to-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoojaSpecificChat;
