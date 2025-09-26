import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Check, CheckCheck } from 'lucide-react';
import { Message, TeamMember } from '@/types/hackathon';
import { RefObject } from 'react';
import { webSocketService } from '@/store';
interface TeamChatMessagesProps {
  messages: Message[];
  messagesLoading: boolean;
  teamMembers: TeamMember[];
  currentUser: string;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  formatDate: (dateString: string) => string;
  getStatusIcon: (status: string, isOwnMessage: boolean) => React.ReactNode;
  inputRef: RefObject<HTMLInputElement>;
  chatEndRef: RefObject<HTMLDivElement>;
}

export const TeamChatMessages = ({
  messages,
  messagesLoading,
  teamMembers,
  currentUser,
  newMessage,
  setNewMessage,
  handleSendMessage,
  formatDate,
  getStatusIcon,
  inputRef,
  chatEndRef
}: TeamChatMessagesProps) => {



  console.log("Rendering TeamChatMessages with messages:", messages);
  console.log("Current user:", currentUser);
  console.log("WebSocket connected:", webSocketService?.isConnected);
  console.log("Messages loading:", messagesLoading);
  console.log("Team members:", teamMembers);
  console.log("New message:", newMessage);
  console.log("Input ref:", inputRef.current);
  console.log("Chat end ref:", chatEndRef.current);
  console.log("WebSocket service:", webSocketService);
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="p-4 xs:p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">Team Chat</span>
          {!webSocketService?.isConnected && (
            <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-600">
              Connecting...
            </Badge>
          )}
        </div>
        
        {/* Loading State */}
        {messagesLoading ? (
          <div className="h-80 xs:h-96 overflow-y-auto space-y-3 mb-4 custom-scrollbar flex items-center justify-center">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <div className="h-80 xs:h-96 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
            <AnimatePresence>
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={msg._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex flex-col ${msg.senderId === currentUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`rounded-lg px-3 py-2 max-w-xs sm:max-w-sm md:max-w-md ${
                      msg.senderId === currentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {/* Show sender name only for others' messages */}
                      {msg.senderId !== currentUser && (
                        <span className="font-semibold mr-2">
                          {teamMembers.find(m => m._id === msg.senderId)?.name || 'Unknown User'}
                        </span>
                      )}
                      {msg.text}
                      {/* Show status icon only for current user's messages */}
                      {msg.senderId === currentUser && getStatusIcon(msg.status, true)}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDate(msg.createdAt || msg.time)}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={!webSocketService?.isConnected ? "Connecting..." : "Type your message... (Enter to send)"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={!webSocketService?.isConnected || messagesLoading}
          />
          <Button 
            type="submit" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            disabled={!webSocketService?.isConnected || !newMessage.trim() || messagesLoading}
          >
            {messagesLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
};