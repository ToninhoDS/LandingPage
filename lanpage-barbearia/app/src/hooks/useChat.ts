import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: Date;
  isOnline: boolean;
  role: 'client' | 'barber' | 'admin';
  unreadCount: number;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  updatedAt: Date;
}

interface UseChatReturn {
  // State
  contacts: ChatContact[];
  messages: ChatMessage[];
  currentRoom: string | null;
  isConnected: boolean;
  isTyping: boolean;
  typingUsers: string[];
  
  // Actions
  sendMessage: (content: string, type?: ChatMessage['type']) => Promise<void>;
  sendFile: (file: File) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  setCurrentRoom: (roomId: string | null) => void;
  startTyping: () => void;
  stopTyping: () => void;
  
  // Connection
  connect: () => void;
  disconnect: () => void;
  
  // Utilities
  getUnreadCount: () => number;
  formatLastSeen: (date: Date) => string;
}

// Mock WebSocket service
class MockChatService {
  private listeners: { [event: string]: Function[] } = {};
  private connected = false;
  private typingTimeout: NodeJS.Timeout | null = null;

  connect() {
    this.connected = true;
    this.emit('connected');
    
    // Simulate periodic status updates
    setInterval(() => {
      if (this.connected) {
        this.emit('userStatusUpdate', {
          userId: '1',
          isOnline: Math.random() > 0.3,
          lastSeen: new Date()
        });
      }
    }, 30000);
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnected');
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  sendMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) {
    if (!this.connected) {
      throw new Error('Not connected');
    }

    const fullMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'sent'
    };

    // Simulate message delivery
    setTimeout(() => {
      this.emit('messageDelivered', { messageId: fullMessage.id });
    }, 1000);

    // Simulate auto-reply for demo
    if (message.senderId === 'me') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: '1',
          senderName: 'João Silva',
          content: this.getAutoReply(message.content),
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };
        this.emit('messageReceived', autoReply);
      }, 2000 + Math.random() * 3000);
    }

    return fullMessage;
  }

  startTyping(roomId: string, userId: string) {
    this.emit('userTyping', { roomId, userId, isTyping: true });
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    this.typingTimeout = setTimeout(() => {
      this.emit('userTyping', { roomId, userId, isTyping: false });
    }, 3000);
  }

  stopTyping(roomId: string, userId: string) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    this.emit('userTyping', { roomId, userId, isTyping: false });
  }

  markAsRead(messageId: string) {
    setTimeout(() => {
      this.emit('messageRead', { messageId });
    }, 500);
  }

  private getAutoReply(message: string): string {
    const replies = [
      'Obrigado pela mensagem! Responderemos em breve.',
      'Recebido! Vamos analisar sua solicitação.',
      'Perfeito! Entraremos em contato.',
      'Mensagem recebida com sucesso!',
      'Agradecemos o contato. Em breve retornaremos.',
    ];
    
    if (message.toLowerCase().includes('agendamento')) {
      return 'Vou verificar a disponibilidade e te retorno!';
    }
    
    if (message.toLowerCase().includes('cancelar')) {
      return 'Entendi. Vou processar o cancelamento.';
    }
    
    if (message.toLowerCase().includes('horário')) {
      return 'Deixe-me verificar os horários disponíveis.';
    }
    
    return replies[Math.floor(Math.random() * replies.length)];
  }
}

const chatService = new MockChatService();

export function useChat(userId: string = 'me'): UseChatReturn {
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'João Silva - Barbeiro',
      lastSeen: new Date(),
      isOnline: true,
      role: 'barber',
      unreadCount: 0
    },
    {
      id: '2',
      name: 'Suporte Barbearia',
      lastSeen: new Date(Date.now() - 300000),
      isOnline: false,
      role: 'admin',
      unreadCount: 2
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'João Silva',
      content: 'Olá! Seu agendamento para amanhã às 14h está confirmado. Alguma dúvida?',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Você',
      content: 'Perfeito! Posso chegar uns 10 minutos antes?',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'João Silva',
      content: 'Claro! Estarei te esperando. Até amanhã!',
      timestamp: new Date(Date.now() - 2700000),
      type: 'text',
      status: 'read'
    }
  ]);

  const [currentRoom, setCurrentRoom] = useState<string | null>('1');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Connection handlers
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      toast.success('Conectado ao chat');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      toast.error('Desconectado do chat');
    };

    const handleMessageReceived = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Update contact's unread count if not in current room
      if (message.senderId !== currentRoom) {
        setContacts(prev => prev.map(contact => 
          contact.id === message.senderId 
            ? { ...contact, unreadCount: contact.unreadCount + 1 }
            : contact
        ));
      }
    };

    const handleMessageDelivered = ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'delivered' } : msg
      ));
    };

    const handleMessageRead = ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      ));
    };

    const handleUserTyping = ({ userId, isTyping: typing }: { userId: string, isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (typing) {
          return prev.includes(userId) ? prev : [...prev, userId];
        } else {
          return prev.filter(id => id !== userId);
        }
      });
    };

    const handleUserStatusUpdate = ({ userId, isOnline, lastSeen }: { userId: string, isOnline: boolean, lastSeen: Date }) => {
      setContacts(prev => prev.map(contact => 
        contact.id === userId 
          ? { ...contact, isOnline, lastSeen }
          : contact
      ));
    };

    chatService.on('connected', handleConnected);
    chatService.on('disconnected', handleDisconnected);
    chatService.on('messageReceived', handleMessageReceived);
    chatService.on('messageDelivered', handleMessageDelivered);
    chatService.on('messageRead', handleMessageRead);
    chatService.on('userTyping', handleUserTyping);
    chatService.on('userStatusUpdate', handleUserStatusUpdate);

    return () => {
      chatService.off('connected', handleConnected);
      chatService.off('disconnected', handleDisconnected);
      chatService.off('messageReceived', handleMessageReceived);
      chatService.off('messageDelivered', handleMessageDelivered);
      chatService.off('messageRead', handleMessageRead);
      chatService.off('userTyping', handleUserTyping);
      chatService.off('userStatusUpdate', handleUserStatusUpdate);
    };
  }, [currentRoom]);

  const connect = useCallback(() => {
    chatService.connect();
  }, []);

  const disconnect = useCallback(() => {
    chatService.disconnect();
  }, []);

  const sendMessage = useCallback(async (content: string, type: ChatMessage['type'] = 'text') => {
    if (!currentRoom || !content.trim()) return;

    try {
      const message = chatService.sendMessage(currentRoom, {
        senderId: userId,
        senderName: 'Você',
        content: content.trim(),
        type
      });

      setMessages(prev => [...prev, message]);
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
      throw error;
    }
  }, [currentRoom, userId]);

  const sendFile = useCallback(async (file: File) => {
    if (!currentRoom) return;

    try {
      // Simulate file upload
      const fileUrl = URL.createObjectURL(file);
      
      const message = chatService.sendMessage(currentRoom, {
        senderId: userId,
        senderName: 'Você',
        content: `Arquivo: ${file.name}`,
        type: 'file',
        fileUrl,
        fileName: file.name
      });

      setMessages(prev => [...prev, message]);
      toast.success('Arquivo enviado');
    } catch (error) {
      toast.error('Erro ao enviar arquivo');
      throw error;
    }
  }, [currentRoom, userId]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      chatService.markAsRead(messageId);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  }, []);

  const startTyping = useCallback(() => {
    if (!currentRoom) return;
    setIsTyping(true);
    chatService.startTyping(currentRoom, userId);
  }, [currentRoom, userId]);

  const stopTyping = useCallback(() => {
    if (!currentRoom) return;
    setIsTyping(false);
    chatService.stopTyping(currentRoom, userId);
  }, [currentRoom, userId]);

  const getUnreadCount = useCallback(() => {
    return contacts.reduce((total, contact) => total + contact.unreadCount, 0);
  }, [contacts]);

  const formatLastSeen = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min atrás`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Clear unread count when entering a room
  useEffect(() => {
    if (currentRoom) {
      setContacts(prev => prev.map(contact => 
        contact.id === currentRoom 
          ? { ...contact, unreadCount: 0 }
          : contact
      ));
    }
  }, [currentRoom]);

  return {
    // State
    contacts,
    messages: currentRoom ? messages.filter(msg => 
      msg.senderId === currentRoom || msg.senderId === userId
    ) : [],
    currentRoom,
    isConnected,
    isTyping,
    typingUsers: typingUsers.filter(id => id !== userId),
    
    // Actions
    sendMessage,
    sendFile,
    markAsRead,
    setCurrentRoom,
    startTyping,
    stopTyping,
    
    // Connection
    connect,
    disconnect,
    
    // Utilities
    getUnreadCount,
    formatLastSeen
  };
}