import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Menu,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Check,
  LogOut,
  UserPlus,
  Bell,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUpload } from "@/components/file-upload";
import { VoiceRecorder } from "@/components/voice-recorder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  timestamp: Date;
  type: "text" | "file" | "voice";
  fileUrl?: string;
  fileName?: string;
  read?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

interface FriendRequest {
  id: number;
  from: User;
  to: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

const DEMO_USERS: User[] = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    lastMessage: "Hey, how are you?",
    unreadCount: 3,
    lastMessageTime: "12:30 PM",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    lastMessage: "Did you see the meeting notes?",
    unreadCount: 1,
    lastMessageTime: "11:45 AM",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    lastMessage: "Thanks for your help!",
    unreadCount: 0,
    lastMessageTime: "10:20 AM",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
    lastMessage: "Let's catch up soon",
    unreadCount: 2,
    lastMessageTime: "Yesterday",
  },
];

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState(DEMO_USERS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);

  const handleLogout = () => {
    // Reset the authentication state in the parent component
    window.location.reload();
  };

  const handleAddFriend = () => {
    if (newFriendEmail.trim()) {
      const newRequest: FriendRequest = {
        id: Date.now(),
        from: users[0], // Current user
        to: newFriendEmail,
        status: "pending",
        timestamp: new Date(),
      };
      setFriendRequests([...friendRequests, newRequest]);
      setNewFriendEmail("");
      setShowAddFriend(false);
    }
  };

  const handleFriendRequest = (
    requestId: number,
    status: "accepted" | "rejected"
  ) => {
    setFriendRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    if (status === "accepted") {
      // Add the user to the friends list
      const request = friendRequests.find((r) => r.id === requestId);
      if (request) {
        const newUser: User = {
          id: Date.now(),
          name: request.from.name,
          email: request.from.email,
          avatar: request.from.avatar,
          lastMessage: "",
          unreadCount: 0,
          lastMessageTime: "Just added",
        };
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, unreadCount: 0 } : user
        )
      );

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.sender === "other" ? { ...message, read: true } : message
        )
      );
    }
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "me",
        timestamp: new Date(),
        type: "text",
        read: false,
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      simulateResponse();
    }
  };

  const simulateResponse = () => {
    if (!selectedUser) return;

    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see what you mean.",
        "Could you tell me more?",
        "Thanks for sharing!",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const message: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "other",
        timestamp: new Date(),
        type: "text",
        read: false,
      };

      setMessages((prev) => [...prev, message]);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                lastMessage: randomResponse,
                lastMessageTime: "Just now",
                unreadCount:
                  user.id === selectedUser.id ? 0 : user.unreadCount + 1,
              }
            : user
        )
      );
    }, 2000);
  };

  const handleFileSelect = (file: File) => {
    if (!selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      content: "Sent a file",
      sender: "me",
      timestamp: new Date(),
      type: "file",
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      read: false,
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleVoiceMessage = (blob: Blob) => {
    if (!selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      content: "Sent a voice message",
      sender: "me",
      timestamp: new Date(),
      type: "voice",
      fileUrl: URL.createObjectURL(blob),
      read: false,
    };
    setMessages((prev) => [...prev, message]);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = friendRequests.filter(
    (request) => request.status === "pending"
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

            {/* Friend Requests Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {pendingRequests.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {pendingRequests.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Friend Requests</h3>
                  {pendingRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No pending requests
                    </p>
                  ) : (
                    pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <img
                              src={request.from.avatar}
                              alt={request.from.name}
                            />
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {request.from.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.from.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleFriendRequest(request.id, "accepted")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleFriendRequest(request.id, "rejected")
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Add Friend Dialog */}
            <Dialog open={showAddFriend} onOpenChange={setShowAddFriend}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Friend</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter friend's email"
                      value={newFriendEmail}
                      onChange={(e) => setNewFriendEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddFriend} className="w-full">
                    Send Friend Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats or friends"
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
                  selectedUser?.id === user.id && "bg-muted"
                )}
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="h-12 w-12">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{user.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {user.lastMessageTime}
                    </span>
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
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="object-cover"
                />
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
                      "flex",
                      message.sender === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.type === "text" && <p>{message.content}</p>}
                      {message.type === "file" && (
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
                      {message.type === "voice" && (
                        <audio controls className="w-[200px]">
                          <source src={message.fileUrl} type="audio/webm" />
                        </audio>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {message.sender === "me" && (
                          <div className="flex">
                            <Check
                              className={cn(
                                "h-3 w-3",
                                message.read ? "text-blue-500" : "opacity-70"
                              )}
                            />
                            <Check
                              className={cn(
                                "h-3 w-3 -ml-1",
                                message.read ? "text-blue-500" : "opacity-70"
                              )}
                            />
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
                if (e.key === "Enter" && !e.shiftKey) {
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
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">
              No conversation selected
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a friend from the list to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
