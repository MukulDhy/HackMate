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
  // Get sender info with fallback
  const getSenderInfo = (senderId: string) => {
    const member = teamMembers.find(m => m._id === senderId);
    return {
      name: member?.name || 'Unknown User',
      initial: (member?.name?.charAt(0) || 'U').toUpperCase()
    };
  };

  // Check if we should show sender name (not current user and different from previous message)
  const shouldShowSender = (currentMsg: Message, previousMsg: Message | undefined) => {
    if (currentMsg.senderId === currentUser) return false;
    if (!previousMsg) return true;
    return currentMsg.senderId !== previousMsg.senderId;
  };


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
          <div className="h-80 xs:h-96 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
            <AnimatePresence>
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const previousMsg = idx > 0 ? messages[idx - 1] : undefined;
                  const showSender = shouldShowSender(msg, previousMsg);
                  const senderInfo = getSenderInfo(msg.senderId);
                  const isOwnMessage = msg.senderId === currentUser;

                  return (
                    <motion.div
                      key={msg._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      ref={idx === messages.length - 1 ? chatEndRef : null}
                    >
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs sm:max-w-sm md:max-w-md`}>
                        {/* Sender Name */}
                        {showSender && !isOwnMessage && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-1 ml-3"
                          >
                            {/* Avatar circle with initial */}
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                              {senderInfo.initial}
                            </div>
                            <span className="font-semibold text-sm text-foreground/80">
                              {senderInfo.name}
                            </span>
                          </motion.div>
                        )}

                        {/* Message Bubble with flexible layout */}
                        <div className="flex items-end gap-2">
                          {/* Connection line for others' messages */}
                          {!isOwnMessage && (
                            <div className="w-6 flex justify-center">
                              <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400/50 to-transparent"></div>
                            </div>
                          )}
                          
                          {/* Flexible message container */}
                          <div className={`relative max-w-full ${
                            isOwnMessage 
                              ? 'bg-primary text-primary-foreground rounded-lg rounded-br-none' 
                              : 'bg-muted text-foreground rounded-lg rounded-bl-none'
                          }`}>
                            <div className="px-3 py-2 break-words min-w-0">
                              {msg.text}
                            </div>
                            
                            {/* Status icon for own messages - positioned inline with text */}
                            {isOwnMessage && (
                              <div className="absolute bottom-1 right-1 flex items-center">
                                {getStatusIcon(msg.status, true)}
                              </div>
                            )}
                          </div>

                          {/* Connection line for own messages */}
                          {isOwnMessage && (
                            <div className="w-6 flex justify-center">
                              <div className="w-0.5 h-6 bg-gradient-to-b from-primary/50 to-transparent"></div>
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className={`flex items-center gap-2 mt-1 ${
                          isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(msg.createdAt || msg.time)}
                          </span>
                          
                          {/* Small indicator for consecutive messages from same sender */}
                          {!showSender && !isOwnMessage && (
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
            {/* <div ref={chatEndRef} /> */}
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