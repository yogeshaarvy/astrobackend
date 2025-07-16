import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useAdminChat(
  orderId: string,
  adminId: string,
  onMessage: (msg: any) => void,
  onHistory: (history: any) => void
) {
  const socketRef = useRef<Socket | null>(null);

  // Memoize event handlers to avoid setState-in-render warning
  const handleMessage = useCallback(
    (msg: any) => {
      onMessage(msg);
    },
    [onMessage]
  );

  const handleHistory = useCallback(
    (history: any) => {
      onHistory(history);
    },
    [onHistory]
  );

  useEffect(() => {
    if (!orderId || !adminId) return;
    socketRef.current = io(process.env.NEXT_PUBLIC_APP_API_URL, {
      withCredentials: true,
      transports: ['websocket']
    });

    // First: bind listeners
    socketRef.current.on('receiveMessage', handleMessage);
    socketRef.current.on('chatHistory', handleHistory);

    // Then: emit events
    socketRef.current.emit('joinOrderRoom', {
      orderId,
      userType: 'admin',
      userId: adminId
    });

    // Fetch chat history on mount
    socketRef.current.emit('fetchHistory', { orderId });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [orderId, adminId, handleMessage, handleHistory]);

  const sendMessage = useCallback(
    (message: string, mediaUrl?: string, type?: 'image' | 'video' | 'text') => {
      if (!socketRef.current) return;

      const msg = {
        orderId,
        message,
        mediaUrl,
        type,
        sender: 'admin',
        senderId: adminId,
        timestamp: new Date().toISOString()
      };

      socketRef.current.emit('sendMessage', msg);
    },
    [orderId]
  );

  return { sendMessage };
}
