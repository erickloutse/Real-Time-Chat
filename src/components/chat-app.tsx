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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import * as messageService from "@/services/messages";
import * as conversationService from "@/services/conversations";
import * as friendService from "@/services/friends";
import * as callService from "@/services/calls";
import { toast } from "sonner";

export function ChatApp() {
  const { user, logout } = useAuth();
  const { socket, connected } = useSocket();
  const [activeTab, setActiveTab] = useState("messages");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", handleNewMessage);
      socket.on("new_conversation", handleNewConversation);
      socket.on("new_friend_request", handleNewFriendRequest);
      socket.on("new_call", handleNewCall);

      return () => {
        socket.off("new_message");
        socket.off("new_conversation");
        socket.off("new_friend_request");
        socket.off("new_call");
      };
    }
  }, [socket]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [conversationsData, friendRequestsData, callsData] =
        await Promise.all([
          conversationService.getConversations(),
          friendService.getFriendRequests(),
          callService.getCallHistory(),
        ]);

      setConversations(conversationsData);
      setFriendRequests(friendRequestsData);
      setCalls(callsData);
    } catch (err) {
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (message.conversationId === selectedConversation?.id) {
      setMessages((prev) => [...prev, message]);
    }
    setConversations((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((c) => c.id === message.conversationId);
      if (index !== -1) {
        updated[index].lastMessage = message;
      }
      return updated;
    });
  };

  const handleNewConversation = (conversation) => {
    setConversations((prev) => [conversation, ...prev]);
  };

  const handleNewFriendRequest = (request) => {
    setFriendRequests((prev) => [request, ...prev]);
    toast("New friend request", {
      description: `${request.sender.username} sent you a friend request`,
    });
  };

  const handleNewCall = (call) => {
    setCalls((prev) => [call, ...prev]);
    if (call.receiver.id === user?.id) {
      // Handle incoming call UI
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const messages = await messageService.getMessages(conversation.id);
      setMessages(messages);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const message = await messageService.sendMessage(
        selectedConversation.id,
        messageInput.trim()
      );
      setMessages((prev) => [...prev, message]);
      setMessageInput("");
      socket?.emit("send_message", message);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (file) => {
    try {
      // Implement file upload logic
      const fileUrl = "uploaded_file_url";
      const message = await messageService.sendMessage(
        selectedConversation.id,
        file.name,
        "file",
        fileUrl
      );
      setMessages((prev) => [...prev, message]);
      socket?.emit("send_message", message);
    } catch (err) {
      toast.error("Failed to upload file");
    }
  };

  const handleVoiceMessage = async (blob) => {
    try {
      // Implement voice message upload logic
      const fileUrl = "voice_message_url";
      const message = await messageService.sendMessage(
        selectedConversation.id,
        "Voice message",
        "voice",
        fileUrl
      );
      setMessages((prev) => [...prev, message]);
      socket?.emit("send_message", message);
    } catch (err) {
      toast.error("Failed to send voice message");
    }
  };

  const startCall = async (userId, type) => {
    try {
      const call = await callService.createCall(userId, type);
      socket?.emit("start_call", call);
      // Handle call UI
    } catch (err) {
      toast.error("Failed to start call");
    }
  };

  const sendFriendRequest = async (email) => {
    try {
      const request = await friendService.sendFriendRequest(email);
      setFriendRequests((prev) => [...prev, request]);
      toast.success("Friend request sent");
    } catch (err) {
      toast.error("Failed to send friend request");
    }
  };

  const respondToFriendRequest = async (requestId, status) => {
    try {
      await friendService.respondToFriendRequest(requestId, status);
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      toast.success(`Friend request ${status}`);
    } catch (err) {
      toast.error("Failed to respond to friend request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadInitialData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <ThemeToggle />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start p-0 h-12 border-b">
            <TabsTrigger value="messages" className="flex-1">
              Messages
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex-1">
              Calls
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {activeTab === "messages" && (
              <div className="p-4 space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted",
                      selectedConversation?.id === conversation.id && "bg-muted"
                    )}
                    onClick={() => selectConversation(conversation)}
                  >
                    <Avatar>
                      <img
                        src={conversation.participants[0].avatarUrl}
                        alt={conversation.participants[0].username}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {conversation.participants[0].username}
                        </p>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              conversation.lastMessage.createdAt
                            ).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "calls" && (
              <div className="p-4 space-y-4">
                {calls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center gap-3 p-3 rounded-lg"
                  >
                    <Avatar>
                      <img
                        src={
                          call.caller.id === user?.id
                            ? call.receiver.avatarUrl
                            : call.caller.avatarUrl
                        }
                        alt={
                          call.caller.id === user?.id
                            ? call.receiver.username
                            : call.caller.username
                        }
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {call.caller.id === user?.id
                            ? call.receiver.username
                            : call.caller.username}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(call.startedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {call.type === "audio" ? (
                          <Phone className="h-4 w-4" />
                        ) : (
                          <Video className="h-4 w-4" />
                        )}
                        <span>{call.status}</span>
                        {call.duration && <span>({call.duration}s)</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-4 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <img
                      src={user?.avatarUrl}
                      alt={user?.username}
                      className="object-cover"
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Friend Requests</h3>
                  {friendRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img
                            src={request.sender.avatarUrl}
                            alt={request.sender.username}
                          />
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.sender.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            respondToFriendRequest(request.id, "accepted")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            respondToFriendRequest(request.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar>
                  <img
                    src={selectedConversation.participants[0].avatarUrl}
                    alt={selectedConversation.participants[0].username}
                    className="object-cover"
                  />
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedConversation.participants[0].username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.participants[0].lastSeen
                      ? `Last seen ${new Date(
                          selectedConversation.participants[0].lastSeen
                        ).toLocaleString()}`
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    startCall(selectedConversation.participants[0].id, "audio")
                  }
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    startCall(selectedConversation.participants[0].id, "video")
                  }
                >
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3 max-w-[80%]",
                      message.sender.id === user?.id ? "ml-auto" : "mr-auto"
                    )}
                  >
                    {message.sender.id !== user?.id && (
                      <Avatar>
                        <img
                          src={message.sender.avatarUrl}
                          alt={message.sender.username}
                        />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.sender.id === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.type === "text" && <p>{message.content}</p>}
                      {message.type === "file" && (
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Paperclip className="h-4 w-4" />
                          {message.content}
                        </a>
                      )}
                      {message.type === "voice" && (
                        <audio
                          src={message.fileUrl}
                          controls
                          className="max-w-[240px]"
                        />
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                        {message.readBy.length > 0 && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <FileUpload onFileSelect={handleFileUpload} />
                <VoiceRecorder onRecordingComplete={handleVoiceMessage} />
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">
                No conversation selected
              </h2>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
