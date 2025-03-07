import { useState, useEffect } from 'react';
import { MessageSquare, Search, Menu, Phone, Video, MoreVertical, Send, Paperclip, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileUpload } from '@/components/file-upload';
import { VoiceRecorder } from '@/components/voice-recorder';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: Date;
  type: 'text' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
  read?: boolean;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

const DEMO_USERS: User[] = [
  { 
    id: 1, 
    name: 'Alice Smith', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 
    lastMessage: 'Hey, how are you?',
    unreadCount: 3,
    lastMessageTime: '12:30 PM'
  },
  { 
    id: 2, 
    name: 'Bob Johnson', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', 
    lastMessage: 'Did you see the meeting notes?',
    unreadCount: 1,
    lastMessageTime: '11:45 AM'
  },
  { 
    id: 3, 
    name: 'Carol Williams', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 
    lastMessage: 'Thanks for your help!',
    unreadCount: 0,
    lastMessageTime: '10:20 AM'
  },
  { 
    id: 4, 
    name: 'David Brown', 
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 
    lastMessage: 'Let\'s catch up soon',
    unreadCount: 2,
    lastMessageTime: 'Yesterday'
  },
];

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey! How are you?',
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      read: true,
    },
    {
      id: '2',
      content: 'I\'m good, thanks! How about you?',
      sender: 'me',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      read: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(DEMO_USERS[0]);
  const [users, setUsers] = useState(DEMO_USERS);

  useEffect(() => {
    if (selectedUser) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id ? { ...user, unreadCount: 0 } : user
        )
      );
      
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.sender === 'other' ? { ...message, read: true } : message
        )
      );
    }
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'me',
        timestamp: new Date(),
        type: 'text',
        read: false,
      };
      setMessages([...messages, message]);
      setNewMessage('');
      simulateResponse();
    }
  };

  const simulateResponse = () => {
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see what you mean.",
        "Could you tell me more?",
        "Thanks for sharing!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const message: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'other',
        timestamp: new Date(),
        type: 'text',
        read: false,
      };
      
      setMessages(prev => [...prev, message]);
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                lastMessage: randomResponse,
                lastMessageTime: 'Just now',
                unreadCount: user.id === selectedUser.id ? 0 : user.unreadCount + 1,
              }
            : user
        )
      );
    }, 2000);
  };

  const handleFileSelect = (file: File) => {
    const message: Message = {
      id: Date.now().toString(),
      content: 'Sent a file',
      sender: 'me',
      timestamp: new Date(),
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      read: false,
    };
    setMessages([...messages, message]);
  };

  const handleVoiceMessage = (blob: Blob) => {
    const message: Message = {
      id: Date.now().toString(),
      content: 'Sent a voice message',
      sender: 'me',
      timestamp: new Date(),
      type: 'voice',
      fileUrl: URL.createObjectURL(blob),
      read: false,
    };
    setMessages([...messages, message]);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-[350px] border-r flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <Avatar className="h-10 w-10" />
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search or start new chat"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chats List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                className={cn(
                  "w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors",
                  selectedUser.id === user.id && "bg-muted"
                )}
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="h-12 w-12">
                  <img src={user.avatar} alt={user.name} className="object-cover" />
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{user.name}</p>
                    <span className="text-xs text-muted-foreground">{user.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                      {user.lastMessage}
                    </p>
                    {user.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {user.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="object-cover" />
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    'flex',
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-lg p-3',
                      message.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.type === 'text' && (
                      <p>{message.content}</p>
                    )}
                    {message.type === 'file' && (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {message.fileName}
                        </a>
                      </div>
                    )}
                    {message.type === 'voice' && (
                      <audio controls className="w-[200px]">
                        <source src={message.fileUrl} type="audio/webm" />
                      </audio>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {message.sender === 'me' && (
                        <div className="flex">
                          <Check className={cn(
                            "h-3 w-3",
                            message.read ? "text-blue-500" : "opacity-70"
                          )} />
                          <Check className={cn(
                            "h-3 w-3 -ml-1",
                            message.read ? "text-blue-500" : "opacity-70"
                          )} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t flex items-center gap-2">
          <FileUpload onFileSelect={handleFileSelect} />
          <VoiceRecorder onRecordingComplete={handleVoiceMessage} />
          <Input
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          {newMessage && (
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}