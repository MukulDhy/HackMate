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

const userProfile = {
  name: 'Alex Rodriguez',
  username: '@alexdev',
  title: 'Full Stack Developer & AI Enthusiast',
  location: 'San Francisco, CA',
  joinDate: 'Joined January 2023',
  bio: 'Passionate developer with 5+ years of experience in building scalable web applications. Love working on AI/ML projects and contributing to open source. Always excited to learn new technologies and collaborate with talented teams.',
  avatar: '/placeholder-avatar.jpg',
  verified: true,
  level: 42,
  xp: 12450,
  nextLevelXp: 15000,
  social: {
    github: 'alexrodriguez',
    linkedin: 'alex-rodriguez-dev',
    twitter: 'alexdev_codes'
  },
  stats: {
    hackathonsJoined: 28,
    teamsFormed: 15,
    projectsCompleted: 23,
    winRate: 65,
    totalPrizes: 125000,
    rank: 127
  }
};

const skills = [
  { name: 'React', level: 95, category: 'Frontend', yearsExp: 4 },
  { name: 'Node.js', level: 88, category: 'Backend', yearsExp: 3 },
  { name: 'Python', level: 92, category: 'Backend', yearsExp: 5 },
  { name: 'TypeScript', level: 85, category: 'Language', yearsExp: 3 },
  { name: 'AWS', level: 78, category: 'Cloud', yearsExp: 2 },
  { name: 'PostgreSQL', level: 82, category: 'Database', yearsExp: 4 },
  { name: 'Docker', level: 75, category: 'DevOps', yearsExp: 2 },
  { name: 'Machine Learning', level: 70, category: 'AI/ML', yearsExp: 2 },
];

const achievements = [
  {
    id: 1,
    title: 'Innovation Master',
    description: 'Won 5 hackathons in a single year',
    icon: Trophy,
    rarity: 'Legendary',
    date: '2024-01-15',
    color: 'text-warning'
  },
  {
    id: 2,
    title: 'Team Player',
    description: 'Successfully formed 10 teams',
    icon: Users,
    rarity: 'Epic',
    date: '2023-12-20',
    color: 'text-neon-purple'
  },
  {
    id: 3,
    title: 'Speed Demon',
    description: 'Completed challenge in under 2 hours',
    icon: Clock,
    rarity: 'Rare',
    date: '2023-11-30',
    color: 'text-neon-cyan'
  },
  {
    id: 4,
    title: 'Skill Master',
    description: 'Achieved 90%+ in 3+ technologies',
    icon: Target,
    rarity: 'Epic',
    date: '2023-11-15',
    color: 'text-neon-lime'
  },
  {
    id: 5,
    title: 'Rising Star',
    description: 'First hackathon participation',
    icon: Star,
    rarity: 'Common',
    date: '2023-01-10',
    color: 'text-muted-foreground'
  },
  {
    id: 6,
    title: 'Mentor',
    description: 'Helped 5 new developers',
    icon: Award,
    rarity: 'Rare',
    date: '2023-10-05',
    color: 'text-neon-magenta'
  }
];

const recentActivity = [
  { type: 'hackathon_win', title: 'Won AI Innovation Challenge', date: '2 days ago', prize: '$50,000' },
  { type: 'team_formed', title: 'Formed team "AI Health Innovators"', date: '5 days ago' },
  { type: 'skill_milestone', title: 'Reached 95% in React', date: '1 week ago' },
  { type: 'achievement', title: 'Unlocked "Innovation Master" achievement', date: '2 weeks ago' },
];

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const xpPercentage = (userProfile.xp / userProfile.nextLevelXp) * 100;

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
                        {userProfile.name}
                      </h1>
                      {userProfile.verified && (
                        <Badge variant="default" className="bg-success/20 text-success border-success/30">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-neon-cyan font-medium mb-2">{userProfile.username}</p>
                    <p className="text-lg text-muted-foreground mb-3">{userProfile.title}</p>
                    
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