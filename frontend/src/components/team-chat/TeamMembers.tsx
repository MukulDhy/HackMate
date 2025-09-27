import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { TeamMember } from '@/types/hackathon';

interface TeamMembersProps {
  teamMembers: TeamMember[];
  currentUser: string;
  onlineUsers: Record<string, boolean>;
  maxTeamSize: number;
  teamName: string;
}

export const TeamMembers = ({ teamMembers, currentUser, onlineUsers, maxTeamSize, teamName }: TeamMembersProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
    <GlassCard className="p-4 xs:p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-orbitron font-bold text-lg text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Members - {teamName}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {teamMembers.length}/{maxTeamSize}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <motion.div 
            key={member._id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
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
                {member._id === currentUser && (
                  <span className="text-muted-foreground ml-1">(You)</span>
                )}
              </p>
              <p className="text-muted-foreground text-xs">{member.role}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              onlineUsers[member._id] ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
          </motion.div>
        ))}
        
        {teamMembers.length < maxTeamSize && (
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
);