import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Edit3, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin, 
  Twitter,
  Trophy,
  Star,
  TrendingUp,
  Award,
  Users,
  Target,
  Clock,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/hooks/authHook';
import { useAppSelector } from '@/hooks/authHook';
import { Hackathon } from '@/types/hackathon';

// Helper function to calculate user stats based on hackathon data
const calculateUserStats = (user: any, hackathons: Hackathon[]) => {
  const userHackathons = hackathons.filter(h => 
    h.participants?.includes(user?._id) || 
    h.teams?.some(team => team.members.includes(user?._id))
  );
  
  const wonHackathons = userHackathons.filter(h => 
    h.winners?.some(winner => winner.userId === user?._id)
  );
  
  const teamsFormed = hackathons.reduce((count, h) => {
    const userTeams = h.teams?.filter(team => team.members.includes(user?._id)) || [];
    return count + userTeams.length;
  }, 0);

  const projectsCompleted = hackathons.filter(h => 
    h.submissions?.some(sub => sub.userId === user?._id || sub.teamId && h.teams?.find(t => t._id === sub.teamId)?.members.includes(user?._id))
  ).length;

  const winRate = userHackathons.length > 0 ? Math.round((wonHackathons.length / userHackathons.length) * 100) : 0;
  
  const totalPrizes = wonHackathons.reduce((total, h) => {
    const userPrize = h.winners?.find(w => w.userId === user?._id)?.prizeAmount || 0;
    return total + userPrize;
  }, 0);

  // Mock rank calculation based on activity
  const rank = Math.floor(Math.random() * 500) + 1;

  return {
    hackathonsJoined: userHackathons.length,
    teamsFormed,
    projectsCompleted,
    winRate,
    totalPrizes,
    rank
  };
};

// Mock achievements based on user activity
const getUserAchievements = (user: any, stats: any) => {
  const achievements = [];

  if (stats.winRate >= 50) {
    achievements.push({
      id: 1,
      title: 'Consistent Winner',
      description: `Maintained ${stats.winRate}% win rate`,
      icon: Trophy,
      rarity: stats.winRate >= 70 ? 'Legendary' : 'Epic',
      date: new Date().toISOString().split('T')[0],
      color: 'text-warning'
    });
  }

  if (stats.teamsFormed >= 5) {
    achievements.push({
      id: 2,
      title: 'Team Builder',
      description: `Formed ${stats.teamsFormed} teams`,
      icon: Users,
      rarity: stats.teamsFormed >= 10 ? 'Epic' : 'Rare',
      date: new Date().toISOString().split('T')[0],
      color: 'text-neon-purple'
    });
  }

  if (stats.hackathonsJoined >= 10) {
    achievements.push({
      id: 3,
      title: 'Hackathon Veteran',
      description: `Joined ${stats.hackathonsJoined} hackathons`,
      icon: Award,
      rarity: stats.hackathonsJoined >= 20 ? 'Legendary' : 'Epic',
      date: new Date().toISOString().split('T')[0],
      color: 'text-neon-cyan'
    });
  }

  if (stats.projectsCompleted >= 5) {
    achievements.push({
      id: 4,
      title: 'Project Master',
      description: `Completed ${stats.projectsCompleted} projects`,
      icon: Target,
      rarity: stats.projectsCompleted >= 15 ? 'Epic' : 'Rare',
      date: new Date().toISOString().split('T')[0],
      color: 'text-neon-lime'
    });
  }

  if (user?.profileCompletion >= 90) {
    achievements.push({
      id: 5,
      title: 'Profile Perfectionist',
      description: 'Achieved 90%+ profile completion',
      icon: Star,
      rarity: 'Rare',
      date: new Date().toISOString().split('T')[0],
      color: 'text-muted-foreground'
    });
  }

  // Add a default achievement for new users
  if (achievements.length === 0) {
    achievements.push({
      id: 6,
      title: 'Rising Star',
      description: 'Just starting the hackathon journey',
      icon: Star,
      rarity: 'Common',
      date: new Date().toISOString().split('T')[0],
      color: 'text-neon-magenta'
    });
  }

  return achievements;
};

// Mock recent activity based on user data
const getRecentActivity = (user: any, stats: any) => {
  const activities = [];

  if (stats.hackathonsJoined > 0) {
    activities.push({
      type: 'hackathon_join',
      title: `Joined ${stats.hackathonsJoined} hackathon${stats.hackathonsJoined > 1 ? 's' : ''}`,
      date: 'Recently',
      prize: stats.totalPrizes > 0 ? `$${stats.totalPrizes.toLocaleString()}` : undefined
    });
  }

  if (stats.teamsFormed > 0) {
    activities.push({
      type: 'team_formed',
      title: `Formed ${stats.teamsFormed} team${stats.teamsFormed > 1 ? 's' : ''}`,
      date: 'Recently'
    });
  }

  if (user?.skills?.length > 0) {
    activities.push({
      type: 'skill_milestone',
      title: `Mastered ${user.skills.length} skill${user.skills.length > 1 ? 's' : ''}`,
      date: 'Recently'
    });
  }

  if (user?.lastLogin) {
    activities.push({
      type: 'login',
      title: 'Active on platform',
      date: `Last login: ${new Date(user.lastLogin).toLocaleDateString()}`
    });
  }

  return activities.slice(0, 4); // Return only 4 most recent activities
};

// Convert user skills to the format needed for the skills section
const getUserSkills = (user: any) => {
  if (!user?.skills || user.skills.length === 0) {
    return [
      { name: 'JavaScript', level: 75, category: 'Language', yearsExp: 2 },
      { name: 'React', level: 70, category: 'Frontend', yearsExp: 2 },
      { name: 'Node.js', level: 65, category: 'Backend', yearsExp: 1 }
    ];
  }

  return user.skills.map((skill: string, index: number) => ({
    name: skill,
    level: Math.min(100, 60 + Math.floor(Math.random() * 40)), // Random level between 60-100
    category: ['Frontend', 'Backend', 'Language', 'Tool'][index % 4],
    yearsExp: 1 + Math.floor(Math.random() * 4)
  }));
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return 'border-warning bg-warning/10 text-warning';
    case 'Epic': return 'border-neon-purple bg-neon-purple/10 text-neon-purple';
    case 'Rare': return 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan';
    case 'Common': return 'border-muted bg-muted/10 text-muted-foreground';
    default: return 'border-muted bg-muted/10 text-muted-foreground';
  }
};

export default function Profile() {
  const { user } = useUser();
  const hackathons = useAppSelector((state) => state.userHack.hackathons || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || `Experienced developer passionate about creating innovative solutions.`,
    title: user?.title || `${user?.role || 'Developer'} & Tech Enthusiast`
  });

  if (!user) {
    return (
      <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
        <BackgroundScene className="absolute inset-0 w-full h-full" />
        <div className="relative max-w-7xl mx-auto p-6 flex items-center justify-center">
          <GlassCard className="p-8 text-center">
            <h1 className="text-2xl font-orbitron mb-4">User Not Found</h1>
            <p>Please log in to view your profile.</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Calculate user stats based on hackathon participation
  const userStats = calculateUserStats(user, hackathons);
  
  // Get user achievements
  const achievements = getUserAchievements(user, userStats);
  
  // Get recent activity
  const recentActivity = getRecentActivity(user, userStats);
  
  // Get user skills
  const skills = getUserSkills(user);

  // Calculate level and XP based on activity
  const baseXp = userStats.hackathonsJoined * 1000 + userStats.projectsCompleted * 500 + userStats.teamsFormed * 300;
  const userLevel = Math.floor(baseXp / 5000) + 1;
  const currentLevelXp = baseXp % 5000;
  const nextLevelXp = 5000;
  const xpPercentage = (currentLevelXp / nextLevelXp) * 100;

  const userProfile = {
    name: user.name,
    username: `@${user.email.split('@')[0]}`,
    title: editedProfile.title,
    location: 'San Francisco, CA', // You might want to add this to your user model
    joinDate: `Joined ${new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    bio: editedProfile.bio,
    avatar: user.profilePicture || '/placeholder-avatar.jpg',
    verified: user.isEmailVerified,
    level: userLevel,
    xp: currentLevelXp,
    nextLevelXp: nextLevelXp,
    social: {
      github: user.socialLinks?.github || 'github-user',
      linkedin: user.socialLinks?.linkedin || 'linkedin-user',
      twitter: user.socialLinks?.twitter || 'twitter-user'
    },
    stats: userStats
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard variant="glow" className="p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-foreground font-orbitron font-bold text-3xl">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {userProfile.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-background">
                      <Trophy className="w-4 h-4 text-background" />
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-neon-cyan rounded-full flex items-center justify-center text-background font-orbitron font-bold border-2 border-background">
                    {userProfile.level}
                  </div>
                </div>
                
                {/* XP Progress */}
                <div className="w-48 text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Level {userProfile.level} • {userProfile.xp.toLocaleString()} / {userProfile.nextLevelXp.toLocaleString()} XP
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500 neon-glow"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((userProfile.nextLevelXp - userProfile.xp) / 1000).toFixed(1)}k XP to next level
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-orbitron font-bold text-3xl text-foreground">
                        {isEditing ? (
                          <Input
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                            className="bg-background/50 border-glass-border w-auto"
                          />
                        ) : (
                          userProfile.name
                        )}
                      </h1>
                      {userProfile.verified && (
                        <Badge variant="default" className="bg-success/20 text-success border-success/30">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-neon-cyan font-medium mb-2">{userProfile.username}</p>
                    
                    {isEditing ? (
                      <Input
                        value={editedProfile.title}
                        onChange={(e) => setEditedProfile({...editedProfile, title: e.target.value})}
                        className="bg-background/50 border-glass-border mb-3"
                      />
                    ) : (
                      <p className="text-lg text-muted-foreground mb-3">{userProfile.title}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {userProfile.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {userProfile.joinDate}
                      </span>
                    </div>

                    {isEditing ? (
                      <Textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                        className="bg-background/50 border-glass-border"
                        rows={4}
                      />
                    ) : (
                      <p className="text-foreground max-w-2xl leading-relaxed">
                        {userProfile.bio}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant={isEditing ? "neon" : "glass"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Settings className="w-4 h-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  <Button variant="glass" size="sm" className="gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                  <Button variant="glass" size="sm" className="gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                  <Button variant="glass" size="sm" className="gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="space-y-8">
            {/* Profile Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
                  Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hackathons Joined</span>
                    <span className="font-orbitron font-bold text-foreground">
                      {userProfile.stats.hackathonsJoined}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Teams Formed</span>
                    <span className="font-orbitron font-bold text-foreground">
                      {userProfile.stats.teamsFormed}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Projects Completed</span>
                    <span className="font-orbitron font-bold text-foreground">
                      {userProfile.stats.projectsCompleted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-orbitron font-bold text-success">
                      {userProfile.stats.winRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Prizes</span>
                    <span className="font-orbitron font-bold text-neon-cyan">
                      ${userProfile.stats.totalPrizes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Global Rank</span>
                    <span className="font-orbitron font-bold text-warning">
                      #{userProfile.stats.rank}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg glass">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-foreground text-sm font-medium">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                      {activity.prize && (
                        <Badge variant="outline" className="text-xs border-neon-cyan/30 text-neon-cyan">
                          {activity.prize}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Middle Column - Skills */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-orbitron font-bold text-xl text-foreground">
                    Skills & Expertise
                  </h3>
                  <Button variant="ghost" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-foreground font-medium">{skill.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-orbitron font-bold text-foreground">
                            {skill.level}%
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {skill.yearsExp} years
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: 0.5 + index * 0.05, duration: 0.8 }}
                          className="bg-primary h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground mb-6">
                  Achievements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} text-center cursor-pointer hover:scale-105 transition-transform`}
                    >
                      <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                      <h4 className="font-orbitron font-bold text-sm mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {achievement.rarity}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Achievements
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}