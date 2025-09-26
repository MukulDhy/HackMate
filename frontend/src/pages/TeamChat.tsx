import { PageLayout } from '@/components/layout/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MessageSquare,
  Upload,
  Users,
  Calendar,
  MapPin,
  Target,
  FileText,
  Plus,
  DollarSign,
  Send,
  Check,
  CheckCheck
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux-hooks';
import { useTeamMessages, useOnlineUsers } from '@/hooks/websocketHooks';
import { useTeam } from '../hooks/teamHook';
import { useUser } from '../hooks/authHook';
import { showWarning } from '@/components/ui/ToasterMsg';
import { webSocketService } from '@/store';
import { Hackathon, TeamMember } from '@/types/hackathon';
import { changeConnect } from '@/store/slices/websocketSlice';

// Skeleton Loader Components
const MessageSkeleton = () => (
  <div className="flex flex-col space-y-2">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
  </div>
);

const TeamMemberSkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
    </div>
    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
  </div>
);

const HackathonDetailSkeleton = () => (
  <div className="space-y-3">
    <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
  </div>
);

export default function TeamChat() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.team);
  const { hackathon } = useAppSelector((state) => state.userHack);
  const teamData = useAppSelector((state) => state.team);
  const { user } = useUser();
  const teamId = teamData.team?._id || '';
  const teamMembers = teamData.members || [];
  
  const { messages, isLoading: messagesLoading } = useTeamMessages(teamId);
  const onlineUsers = useOnlineUsers(teamId);
  const [newMessage, setNewMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('23:59:51');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection and presence update
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        setIsConnecting(true);
        
        // Connect to WebSocket if not already connected
        const token = localStorage.getItem('token') || user?.token;
        if (token && !webSocketService.isConnected) {
          webSocketService.connect(token);
          dispatch(changeConnect({ changeStatus: true }));
        }

        // Send presence update
        if (teamId && currentUser) {
          webSocketService.sendMessage({
            type: "presence.update",
            userId: currentUser,
            teamId: teamId,
            lastSeen: new Date().toISOString()
          });
        }

        // Simulate data loading delay
        setTimeout(() => {
          setIsDataLoading(false);
          setIsConnecting(false);
        }, 1500);

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setIsConnecting(false);
        setIsDataLoading(false);
      }
    };

    initializeWebSocket();

    // Cleanup on unmount
    return () => {
      // Don't disconnect WebSocket completely as it might be used by other components
      // Just clean up any team-specific subscriptions if needed
    };
  }, [teamId, currentUser, user, dispatch]);

  const handleRefresh = () => {
    // setIsConnecting(true);
    // setIsDataLoading(true);
  // webSocketService.sendMessage({
  //           type: "presence.update",
  //           userId: currentUser,
  //           teamId: teamId,
  //           lastSeen: new Date().toISOString()
  //         });




    //  setIsConnecting(false);
    // setIsDataLoading(false);
  
  }
  // Safely create hackathonData with fallback values
  const hackathonData: Hackathon = {
    title: hackathon?.title || 'AI Innovation Challenge',
    description: hackathon?.description || 'Build an AI-powered collaboration tool that revolutionizes how teams work together in virtual environments.',
    startDate: hackathon?.startDate || '2025-09-10T09:00:00Z',
    endDate: hackathon?.endDate || '2025-09-12T18:00:00Z',
    submissionDeadline: hackathon?.submissionDeadline || '2025-09-12T17:00:00Z',
    maxTeamSize: hackathon?.maxTeamSize || 4,
    venue: hackathon?.venue || 'Tech Hub Convention Center',
    mode: hackathon?.mode || 'hybrid',
    registrationFee: hackathon?.registrationFee || 50,
    status: hackathon?.status || 'ongoing',
    problemStatements: hackathon?.problemStatements || [
      'Design an AI assistant that can predict team conflicts before they occur',
      'Create a smart workspace that adapts to individual working styles',
      'Develop a real-time collaboration tool with advanced analytics'
    ],
    submissionFormat: hackathon?.submissionFormat || 'GitHub repository + Live demo + Presentation slides',
    tags: hackathon?.tags || ['AI', 'Collaboration', 'Innovation', 'SaaS'],
  };

  // Auto-scroll to bottom on new message
  // useEffect(() => {
  //   if (!isDataLoading) {
  //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages, isDataLoading]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getStatusIcon = useCallback((status: string, isOwnMessage: boolean) => {
    if (!isOwnMessage) return null;
    
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 ml-1" title="Sent" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 ml-1" title="Delivered" />;
      case 'seen':
        return <CheckCheck className="w-3 h-3 ml-1 text-blue-500" title="Seen" />;
      default:
        return null;
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    if (newMessage.trim().length > 1000) {
      showWarning('Message is too long. Please keep it under 1000 characters.', 'Message Validate');
      return;
    }
    
    // Prevent duplicate spam
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.text === newMessage.trim() && lastMessage.senderId === currentUser) {
      showWarning('Please avoid sending duplicate messages.', 'Message Validate');
      return;
    }
    
    webSocketService.sendTeamMessage(teamId, newMessage.trim());
    setNewMessage('');
    inputRef.current?.focus();
  };

  // Show loading state
  if (isConnecting || isDataLoading) {
    return (
      <PageLayout showBackground={true} className="bg-background">
        <div className="min-h-screen p-4 xs:p-5 sm:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-lg px-6 py-4 border border-border w-48">
              <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content Skeleton */}
            <div className="xl:col-span-2 space-y-6">
              {/* Hackathon Details Skeleton */}
              <GlassCard className="p-6">
                <HackathonDetailSkeleton />
              </GlassCard>

              {/* Problem Statements Skeleton */}
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  ))}
                </div>
              </GlassCard>

              {/* Team Chat Skeleton */}
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                  <div className="h-64 bg-gray-100 rounded-lg space-y-4 p-4">
                    {[1, 2, 3, 4].map((item) => (
                      <MessageSkeleton key={item} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-12 h-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {/* Team Members Skeleton */}
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <TeamMemberSkeleton key={item} />
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Submission Skeleton */}
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
                  <div className="h-16 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackground={true} className="bg-background">
      <div className="min-h-screen p-4 xs:p-5 sm:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="font-orbitron font-bold text-2xl xs:text-3xl lg:text-4xl text-foreground">
              {hackathonData.title}
            </h1>
            <p className="text-sm xs:text-base lg:text-lg text-muted-foreground">
              Team Collaboration Hub
            </p>
          </div>
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 xs:px-6 py-3 xs:py-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 xs:w-5 h-4 xs:h-5 text-primary" />
              <span className="text-muted-foreground text-xs xs:text-sm">Time Remaining</span>
            </div>
            <div className="flex items-center justify-between gap-4" onClick={handleRefresh}>
            <div className="font-mono text-xl xs:text-2xl font-bold text-foreground">
              {timeLeft}
            </div>
            <div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-150">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>

            </div>
          </div>
        </motion.div>


        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Hackathon Details */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 xs:w-6 h-5 xs:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-orbitron font-bold text-xl xs:text-2xl text-foreground mb-2">
                      {hackathonData.title}
                    </h2>
                    <p className="text-muted-foreground text-sm xs:text-base">
                      {hackathonData.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Starts:</span>
                    <span className="text-foreground">{formatDate(hackathonData.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Ends:</span>
                    <span className="text-foreground">{formatDate(hackathonData.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="text-foreground">{hackathonData.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="text-foreground">${hackathonData.registrationFee}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {hackathonData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Problem Statements */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Problem Statements
                </h3>
                <div className="prose prose-sm max-w-none">
                  <ul className="space-y-2">
                    {hackathonData.problemStatements.map((statement, index) => (
                      <li key={index} className="text-foreground">
                        {statement}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>

            {/* Team Chat */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-bold text-lg">Team Chat</span>
                  {!webSocketService.isConnected && (
                    <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-600">
                      Connecting...
                    </Badge>
                  )}
                </div>
                <div className="h-80 xs:h-96 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex flex-col ${msg.senderId === currentUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`rounded-lg px-3 py-2 max-w-xs sm:max-w-sm md:max-w-md ${msg.senderId === currentUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                          <span className="font-semibold mr-2">{teamMembers.find(m => m.id === msg.senderId)?.name || msg.senderId}</span>
                          {msg.text}
                          {getStatusIcon(msg.status, msg.senderId === currentUser)}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{formatDate(msg.time)}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message... (Enter to send)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={!webSocketService.isConnected}
                  />
                  <Button 
                    type="submit" 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    disabled={!webSocketService.isConnected}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Team Members */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-orbitron font-bold text-lg text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Team Members
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {teamMembers.length}/{hackathonData.maxTeamSize}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {teamMembers.map((member: TeamMember) => (
                    <motion.div 
                      key={member.id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * teamMembers.indexOf(member) }}
                      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border"
                    >
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-foreground">
                          {member.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium text-sm">
                          {member.name}
                          {member.name === currentUser && (
                            <span className="text-muted-foreground ml-1">(You)</span>
                          )}
                        </p>
                        <p className="text-muted-foreground text-xs">{member.role}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        onlineUsers[member.id] ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </motion.div>
                  ))}
                  
                  {teamMembers.length < hackathonData.maxTeamSize && (
                    <Button 
                      variant="outline" 
                      className="w-full p-3 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Invite Team Member
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Submission */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-4 xs:p-5 sm:p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Project Submission
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Submit your final project before the deadline. Make sure to include all required components.
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="text-foreground">{formatDate(hackathonData.submissionDeadline)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <p className="text-foreground text-xs mt-1">{hackathonData.submissionFormat}</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="hero" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Project
                </Button>
              </GlassCard>
            </motion.div> 
          </div>
        </div>
      </div>
    </PageLayout>
  );
}