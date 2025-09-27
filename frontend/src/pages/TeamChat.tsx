import { PageLayout } from '@/components/layout/page-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { TeamChatHeader } from '../components/team-chat/index';
import { HackathonDetails } from '../components/team-chat';
import { ProblemStatements } from '../components/team-chat';
import { TeamMembers } from '../components/team-chat';
import { TeamChatMessages } from '../components/team-chat';
import { ProjectSubmission } from '../components/team-chat';
import { 
  MessageSkeleton, 
  TeamMemberSkeleton, 
  HackathonDetailSkeleton 
} from '../components/team-chat/skeletons';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux-hooks';
// import { useTeamMessages, useOnlineUsers } from '@/hooks/websocketHooks';
import { useUser } from '@/hooks/authHook';
import { showWarning } from '@/components/ui/ToasterMsg';
import { webSocketService } from '@/store';
import { changeConnect } from '@/store/slices/websocketSlice';
import { fetchUserTeam } from '@/store/slices/teamSlice';
import { Hackathon } from '@/types/hackathon';
import { Check, CheckCheck } from 'lucide-react';

export default function TeamChat() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.team);
  const { hackathon } = useAppSelector((state) => state.userHack);
  const teamData = useAppSelector((state) => state.team);
  const { user } = useUser();
  const teamId = teamData.team?._id || '';
  const teamMembers = teamData.members || [];
  
  const messages= useAppSelector((state) => state.team.messages);
  const messagesLoading = false;;
  const onlineUsers = [];
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
    if (user?._id && user?.currentHackathonId) {
      dispatch(fetchUserTeam({ userId: user._id, hackathonId: user.currentHackathonId }));
    }

    return () => {
      // Cleanup if needed
    };
  }, [teamId, currentUser, user, dispatch]);

  const handleRefresh = () => {
    // Refresh logic here
  };

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
    
    if (!newMessage.trim() || !webSocketService.isConnected) return;
    
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
    
    // Send message via WebSocket
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
              <GlassCard className="p-6">
                <HackathonDetailSkeleton />
              </GlassCard>

              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  ))}
                </div>
              </GlassCard>

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
        <TeamChatHeader 
          hackathonTitle={hackathonData.title}
          timeLeft={timeLeft}
          onRefresh={handleRefresh}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6">
            <HackathonDetails 
              hackathonData={hackathonData}
              formatDate={formatDate}
            />

            <ProblemStatements problemStatements={hackathonData.problemStatements} />

            <TeamChatMessages
              messages={messages}
              messagesLoading={messagesLoading}
              teamMembers={teamMembers}
              currentUser={currentUser}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              formatDate={formatDate}
              getStatusIcon={getStatusIcon}
              inputRef={inputRef}
              chatEndRef={chatEndRef}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            <TeamMembers
              teamMembers={teamMembers}
              currentUser={currentUser}
              onlineUsers={onlineUsers}
              maxTeamSize={hackathonData.maxTeamSize}
            />

            <ProjectSubmission
              submissionDeadline={hackathonData.submissionDeadline}
              submissionFormat={hackathonData.submissionFormat}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}