'use client';
import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
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
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchSingleOrderList,
  updatePoojaOrderStatus
} from '@/redux/slices/astropooja/poojaorders';
import { useAdminChat } from '@/hooks/useChat';
import { toast } from 'sonner';

// Types
interface Message {
  id: string;
  text?: string;
  mediaUrl?: string;
  type?: 'image' | 'video';
  sender: 'user' | 'admin';
  timestamp: Date;
  isRead: boolean;
}

interface PoojaBooking {
  id: string;
  poojaType: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  phoneCode?: string;
  bookingDateTime?: Date;
  poojaStatus: 'no started' | 'start' | 'progress' | 'complete' | 'cancel';
  isOnline: boolean;
  avatar?: string;
  paymentStatus?: any;
  paidAmount?: any;
  poojaId?: any;
}

const PoojaSpecificChat: React.FC = () => {
  const params = useParams();
  const orderId = (params?.orderId as string) || 'booking_123';
  // Only one admin backend, so use a constant adminId
  const adminId = '67c6d005ca2af808a28c560c';
  const {
    singleAllOrdersListState: { data: orderData }
  } = useAppSelector((state) => state.allpoojsorders);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  // Add this state to track loading for each button individually
  const [loadingStates, setLoadingStates] = useState({
    start: false,
    progress: false,
    complete: false,
    cancel: false
  });

  useEffect(() => {
    if (!orderId) return; // Prevents unnecessary API calls if orderId is missing
    dispatch(fetchSingleOrderList(orderId)).then((res) => {
      // setOrderDetails(res.payload?.order || null);
    });
  }, [dispatch, orderId]); // Added orderId as a dependency

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;

    setIsTyping(true);

    try {
      const formData = new FormData();

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const fieldName = isImage ? 'imagefile' : isVideo ? 'file' : 'file';

      formData.append(fieldName, file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/V1/files`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      let mediaUrl =
        data.result?.imageFileUrl ||
        data.result?.fileUrl ||
        data.result?.audioFileUrl ||
        data.result?.quillImgURL;

      if (!mediaUrl) throw new Error('Media URL not found in response');
      mediaUrl = `${process.env.NEXT_PUBLIC_APP_API_URL}/public${mediaUrl}`;

      const type = isImage ? 'image' : isVideo ? 'video' : 'text';

      // Send the media message
      sendMessage('', mediaUrl, type);
      markMessagesAsRead();

      (document.getElementById('file-upload') as HTMLInputElement).value = ''; // Reset file input
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('Media upload failed. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/V1/chat/mark-read?orderId=${orderId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  const handleUpdatePoojaStatus = async ({
    poojaId,
    poojaStatus
  }: {
    poojaId: string;
    poojaStatus: string;
  }) => {
    try {
      // Set loading state for specific button
      setLoadingStates((prev) => ({ ...prev, [poojaStatus]: true }));

      const res = await dispatch(
        updatePoojaOrderStatus({ poojaId, poojaStatus })
      );
      if ((res?.payload as any)?.success) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to update pooja status', err);
    } finally {
      // Reset loading state for specific button
      setLoadingStates((prev) => ({ ...prev, [poojaStatus]: false }));
    }
  };
  // Memoized handlers to avoid setState-in-render warning
  const handleMessage = useCallback((msg: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: msg._id || crypto.randomUUID(),
        text: msg.message,
        mediaUrl: msg.mediaUrl,
        type: msg.type,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        isRead: true
      }
    ]);
  }, []);

  const handleHistory = useCallback((history: any[]) => {
    setMessages(
      history.map((msg) => ({
        id: msg._id || crypto.randomUUID(),
        text: msg.message, // ✅ mapping backend 'message' to frontend 'text'
        mediaUrl: msg.mediaUrl,
        type: msg.type,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        isRead: true
      }))
    );
  }, []);

  // --- SOCKET CHAT HOOK ---
  const { sendMessage } = useAdminChat(
    orderId,
    adminId,
    handleMessage,
    handleHistory
  );

  useEffect(() => {
    setIsConnected(true);
    return () => {};
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!orderId) return;

    dispatch(fetchSingleOrderList(orderId)).then(() => {
      markMessagesAsRead();
    });
  }, [dispatch, orderId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message, undefined, 'text');
    setMessage('');
    markMessagesAsRead();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const datePart =
      date.toDateString() === today.toDateString()
        ? 'Today'
        : date.toDateString() === yesterday.toDateString()
        ? 'Yesterday'
        : date.toLocaleDateString();

    const timePart = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${datePart} at ${timePart}`;
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

  // Mock booking data - this would come from props or API
  const poojaBooking: PoojaBooking = {
    id: orderData?.orderId,
    poojaType: orderData?.product?.title?.en,
    userName: orderData?.user?.name,
    userEmail: orderData?.user?.email,
    userPhone: orderData?.user?.phone,
    bookingDateTime: orderData?.createdAt, // Tomorrow
    paidAmount: orderData?.paidAmount,
    isOnline: true,
    paymentStatus: orderData?.paymentStatus,
    poojaStatus: orderData?.poojaStatus,
    poojaId: orderData?._id
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
                  {poojaBooking?.userName}
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
                    <span>
                      {orderData?.phonecode
                        ? `${orderData.phonecode} ${poojaBooking.userPhone}`
                        : `+${poojaBooking.userPhone}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex items-center space-x-2">
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
            </div> */}
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
                Pooja Status
              </label>
              <div
                className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm ${getStatusColor(
                  poojaBooking?.poojaStatus
                )}`}
              >
                {getStatusIcon(poojaBooking?.poojaStatus)}
                <span className="capitalize">{poojaBooking?.poojaStatus}</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDateTime((poojaBooking as any)?.bookingDateTime)}
                </span>
              </div>
            </div>

            {/* Location */}
            {/* <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>{poojaBooking.location}</span>
              </div>
            </div> */}

            {/* Pandit */}
            {/* <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pandit
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{poojaBooking.panditName}</span>
              </div>
            </div> */}

            {/* Payment */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Payment
              </label>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-semibold">
                    ₹{poojaBooking?.paidAmount}
                  </span>
                </div>
                {/* <div className="mb-1 flex justify-between text-sm">
                  <span>Advance Paid:</span>
                  <span className="text-green-600">
                    ₹{poojaBooking.advancePaid}
                  </span>
                </div> */}
                {/* <div className="flex justify-between border-t pt-1 text-sm font-semibold">
                  <span>Remaining:</span>
                  <span className="text-red-600">
                    ₹{poojaBooking.totalAmount - poojaBooking.advancePaid}
                  </span>
                </div> */}
              </div>
            </div>

            {/* Special Requests */}
            {/* {poojaBooking.specialRequests && (
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
            )} */}

            {/* Quick Actions */}
            <div className="space-y-2">
              {poojaBooking?.poojaStatus === 'no started' && (
                <button
                  onClick={() =>
                    handleUpdatePoojaStatus({
                      poojaId: poojaBooking?.poojaId,
                      poojaStatus: 'start'
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-white transition-all duration-200 hover:from-yellow-600 hover:to-yellow-700"
                  disabled={loadingStates.start}
                >
                  {loadingStates.start ? (
                    <span className="loader">Updating .....</span>
                  ) : (
                    'Mark as Start'
                  )}
                </button>
              )}

              {(poojaBooking?.poojaStatus === 'no started' ||
                poojaBooking?.poojaStatus === 'start') && (
                <button
                  onClick={() =>
                    handleUpdatePoojaStatus({
                      poojaId: poojaBooking?.poojaId,
                      poojaStatus: 'progress'
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all duration-200 hover:from-orange-600 hover:to-orange-700"
                  disabled={loadingStates.progress}
                >
                  {loadingStates.progress ? (
                    <span className="loader">Updating .....</span>
                  ) : (
                    'Mark as Progress'
                  )}
                </button>
              )}

              {!['cancel', 'complete'].includes(poojaBooking?.poojaStatus) && (
                <button
                  onClick={() =>
                    handleUpdatePoojaStatus({
                      poojaId: poojaBooking?.poojaId,
                      poojaStatus: 'complete'
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white transition-all duration-200 hover:from-green-600 hover:to-green-700"
                  disabled={loadingStates.complete}
                >
                  {loadingStates.complete ? (
                    <span className="loader">Updating .....</span>
                  ) : (
                    'Mark as Completed'
                  )}
                </button>
              )}

              {!['cancel', 'complete'].includes(poojaBooking?.poojaStatus) && (
                <button
                  onClick={() =>
                    handleUpdatePoojaStatus({
                      poojaId: poojaBooking?.poojaId,
                      poojaStatus: 'cancel'
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white transition-all duration-200 hover:from-red-600 hover:to-red-700"
                  disabled={loadingStates.cancel}
                >
                  {loadingStates.cancel ? (
                    <span className="loader">Updating .....</span>
                  ) : (
                    'Mark as Cancel'
                  )}
                </button>
              )}
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
                  {formatDateTime((poojaBooking as any).bookingDateTime)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* {poojaBooking.isOnline && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Online</span>
                  </div>
                )} */}
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
                  {msg.mediaUrl ? (
                    msg.type === 'image' ? (
                      <img
                        src={msg.mediaUrl}
                        alt="sent media"
                        className="max-w-xs rounded-lg shadow-md"
                      />
                    ) : (
                      <video
                        controls
                        src={msg.mediaUrl}
                        className="max-w-xs rounded-lg shadow-md"
                      />
                    )
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}
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
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center space-x-2 rounded-full border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                📎 Attach
              </label>
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
