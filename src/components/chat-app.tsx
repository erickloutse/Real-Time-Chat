import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
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
  ChevronLeft,
  Settings,
  Star,
  Mail,
  User,
  Clock,
  PhoneCall,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUpload } from "@/components/file-upload";
import { VoiceRecorder } from "@/components/voice-recorder";

type Page = "calls" | "chats" | "settings";
type ChatTab = "all" | "unread" | "favorites";

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  timestamp: Date;
  type: "text" | "file" | "voice";
  fileUrl?: string;
  fileName?: string;
  read?: boolean;
  isFavorite?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
  isFavorite?: boolean;
}

interface Call {
  id: number;
  user: User;
  type: "incoming" | "outgoing" | "missed";
  timestamp: Date;
  duration?: string;
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
    isFavorite: true,
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
    isFavorite: true,
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

const DEMO_CALLS: Call[] = [
  {
    id: 1,
    user: DEMO_USERS[0],
    type: "incoming",
    timestamp: new Date(2024, 1, 20, 14, 30),
    duration: "5:23",
  },
  {
    id: 2,
    user: DEMO_USERS[1],
    type: "missed",
    timestamp: new Date(2024, 1, 20, 12, 15),
  },
  {
    id: 3,
    user: DEMO_USERS[2],
    type: "outgoing",
    timestamp: new Date(2024, 1, 20, 10, 45),
    duration: "2:15",
  },
  {
    id: 4,
    user: DEMO_USERS[0],
    type: "incoming",
    timestamp: new Date(2024, 1, 19, 16, 20),
    duration: "8:45",
  },
];

const DEMO_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 1,
    from: DEMO_USERS[0],
    to: "new.friend@example.com",
    status: "pending",
    timestamp: new Date(2024, 1, 20, 15, 30),
  },
  {
    id: 2,
    from: DEMO_USERS[1],
    to: "another.friend@example.com",
    status: "accepted",
    timestamp: new Date(2024, 1, 20, 14, 15),
  },
];

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState(DEMO_USERS);
  const [friendRequests, setFriendRequests] = useState(DEMO_FRIEND_REQUESTS);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activePage, setActivePage] = useState<Page>("chats");
  const [activeTab, setActiveTab] = useState<ChatTab>("all");

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const handleChatSelect = (user: User) => {
    setSelectedUser(user);
    if (isMobileView) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
    setSelectedUser(null);
  };

  const handleAddFriend = () => {
    if (newFriendEmail.trim()) {
      const newRequest: FriendRequest = {
        id: Date.now(),
        from: users[0],
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

  const toggleFavorite = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFavorite: !user.isFavorite } : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "unread") {
      return matchesSearch && user.unreadCount > 0;
    } else if (activeTab === "favorites") {
      return matchesSearch && user.isFavorite;
    }

    return matchesSearch;
  });

  const CallsPage = () => (
    <div className="flex-1">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Appels récents</h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {DEMO_CALLS.map((call) => (
            <div
              key={call.id}
              className="p-4 flex items-center gap-3 hover:bg-muted transition-colors"
            >
              <Avatar className="h-12 w-12">
                <img
                  src={call.user.avatar}
                  alt={call.user.name}
                  className="object-cover"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{call.user.name}</p>
                  {call.type === "incoming" && (
                    <PhoneIncoming className="h-4 w-4 text-green-500" />
                  )}
                  {call.type === "outgoing" && (
                    <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                  )}
                  {call.type === "missed" && (
                    <PhoneMissed className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{call.timestamp.toLocaleString()}</span>
                  {call.duration && <span>• {call.duration}</span>}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const SettingsPage = () => (
    <div className="flex-1">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Profil</h2>
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Avatar className="h-16 w-16">
              <img
                src={DEMO_USERS[0].avatar}
                alt="Profile"
                className="object-cover"
              />
            </Avatar>
            <div>
              <p className="font-medium">{DEMO_USERS[0].name}</p>
              <p className="text-sm text-muted-foreground">
                {DEMO_USERS[0].email}
              </p>
            </div>
            <Button variant="outline" className="ml-auto">
              Modifier
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <span>Notifications push</span>
              </div>
              <Button variant="outline" size="sm">
                Configurer
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Compte</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>Changer d'email</span>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span>Informations personnelles</span>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );

  const ChatArea = () => (
    <div
      className={cn(
        "flex-1 flex flex-col",
        showSidebar && isMobileView && "hidden"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackToSidebar}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <img
              src={selectedUser?.avatar}
              alt={selectedUser?.name}
              className="object-cover"
            />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{selectedUser?.name}</p>
              {selectedUser?.isFavorite && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Video className="h-5 w-5" />
          </Button>
          <Separator
            orientation="vertical"
            className="h-6 hidden md:inline-flex"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => selectedUser && toggleFavorite(selectedUser.id)}
          >
            <Star
              className={cn(
                "h-5 w-5",
                selectedUser?.isFavorite && "fill-yellow-400 text-yellow-400"
              )}
            />
          </Button>
        </div>
      </div>

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
                    "max-w-[85%] md:max-w-[70%] rounded-lg p-3",
                    message.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.type === "text" && (
                    <p className="break-words">{message.content}</p>
                  )}
                  {message.type === "file" && (
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 shrink-0" />
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 break-all"
                      >
                        {message.fileName}
                      </a>
                    </div>
                  )}
                  {message.type === "voice" && (
                    <audio controls className="w-full max-w-[200px]">
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
  );

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

  const MainContent = () => {
    switch (activePage) {
      case "calls":
        return <CallsPage />;
      case "settings":
        return <SettingsPage />;
      case "chats":
        return selectedUser ? (
          <ChatArea />
        ) : (
          <>
            {/* Main Header */}
            <div className="p-4 flex items-center justify-between border-b">
              <h1 className="text-2xl font-bold">Discussions</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddFriend(true)}
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-2">
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={(value) => setActiveTab(value as ChatTab)}
              >
                <TabsList className="w-full justify-start gap-2 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="all"
                    className={cn(
                      "rounded-full px-4 py-2 text-sm transition-colors",
                      activeTab === "all"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted"
                    )}
                  >
                    Toutes
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className={cn(
                      "rounded-full px-4 py-2 text-sm transition-colors",
                      activeTab === "unread"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted"
                    )}
                  >
                    Non lues
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className={cn(
                      "rounded-full px-4 py-2 text-sm transition-colors",
                      activeTab === "favorites"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted"
                    )}
                  >
                    Favoris
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className={cn(
                      "w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors",
                      selectedUser?.id === user.id && "bg-muted"
                    )}
                    onClick={() => handleChatSelect(user)}
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.name}</p>
                          {user.isFavorite && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <MainContent />
      </div>

      {/* Bottom Navigation */}
      <div className="border-t p-2">
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            className={cn(
              "flex-1 flex flex-col items-center gap-1",
              activePage === "calls" && "text-primary"
            )}
            onClick={() => {
              setActivePage("calls");
              setSelectedUser(null);
            }}
          >
            <Phone className="h-5 w-5" />
            <span className="text-xs">Appels</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 flex flex-col items-center gap-1",
              activePage === "chats" && "text-primary"
            )}
            onClick={() => {
              setActivePage("chats");
              setSelectedUser(null);
            }}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Discussions</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 flex flex-col items-center gap-1",
              activePage === "settings" && "text-primary"
            )}
            onClick={() => {
              setActivePage("settings");
              setSelectedUser(null);
            }}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Paramètres</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
