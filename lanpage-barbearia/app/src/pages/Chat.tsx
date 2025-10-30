import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';

// Interfaces are now imported from useChat hook

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    contacts,
    messages,
    currentRoom,
    isConnected,
    isTyping: isUserTyping,
    typingUsers,
    sendMessage,
    sendFile,
    setCurrentRoom,
    startTyping,
    stopTyping,
    formatLastSeen,
    getUnreadCount
  } = useChat(user?.id || 'me');
  
  const [newMessage, setNewMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedContact = contacts.find(c => c.id === currentRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedContact) return;

    try {
      await sendFile(file);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (value.trim()) {
      startTyping();
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        stopTyping();
      }, 1000);
      
      setTypingTimeout(timeout);
    } else {
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // formatLastSeen is now provided by useChat hook

  const getMessageStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Mensagens</h1>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {selectedContact ? `Conversando com ${selectedContact.name}` : 'Selecione um contato'}
            {getUnreadCount() > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {getUnreadCount()}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Lista de Contatos */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Conversas</h2>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <Card 
                  key={contact.id}
                  className={`cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setCurrentRoom(contact.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {contact.name.charAt(0)}
                        </div>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{contact.name}</p>
                          {contact.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {contact.isOnline ? 'Online' : `Visto ${formatLastSeen(contact.lastSeen)}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Área de Chat */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Header do Chat */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedContact.name.charAt(0)}
                  </div>
                  {selectedContact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedContact.isOnline ? 'Online' : `Visto ${formatLastSeen(selectedContact.lastSeen)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'me'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${
                      message.senderId === 'me' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-xs ${
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                      {message.senderId === 'me' && getMessageStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs text-gray-600">digitando...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="pr-10"
                    disabled={!isConnected}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || !isConnected}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isUserTyping && (
                <div className="text-xs text-gray-500 mt-1">
                  Digitando...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-500">
                Escolha um contato para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}