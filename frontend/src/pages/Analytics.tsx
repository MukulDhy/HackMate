import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Trophy, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Star
} from 'lucide-react';

const analyticsData = {
  overview: {
    totalHackathons: 28,
    winRate: 65,
    totalPrizes: 125000,
    globalRank: 127,
    skillGrowth: 15,
    teamCollaborations: 42
  },
  monthlyStats: [
    { month: 'Jan', hackathons: 3, wins: 2, prizes: 15000 },
    { month: 'Feb', hackathons: 4, wins: 3, prizes: 25000 },
    { month: 'Mar', hackathons: 2, wins: 1, prizes: 8000 },
    { month: 'Apr', hackathons: 5, wins: 3, prizes: 32000 },
    { month: 'May', hackathons: 3, wins: 2, prizes: 18000 },
    { month: 'Jun', hackathons: 4, wins: 3, prizes: 27000 }
  ],
  skillProgress: [
    { skill: 'React', current: 95, previous: 88, trend: 'up' },
    { skill: 'Python', current: 92, previous: 85, trend: 'up' },
    { skill: 'Node.js', current: 88, previous: 82, trend: 'up' },
    { skill: 'Machine Learning', current: 70, previous: 55, trend: 'up' },
    { skill: 'TypeScript', current: 85, previous: 80, trend: 'up' }
  ],
  teamPerformance: {
    averageTeamSize: 4.2,
    leadershipRate: 35,
    mentorshipHours: 48,
    projectsCompleted: 23
  }
};

export default function Analytics() {
  const maxPrize = Math.max(...analyticsData.monthlyStats.map(stat => stat.prizes));

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground mb-4">
            Performance Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Deep insights into your hackathon performance and skill development
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <GlassCard className="p-6 text-center">
              <Users className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
              <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                {analyticsData.overview.totalHackathons}
              </div>
              <div className="text-sm text-muted-foreground">Total Hackathons</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <Trophy className="w-8 h-8 text-warning mx-auto mb-3" />
              <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                {analyticsData.overview.winRate}%
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <Target className="w-8 h-8 text-neon-lime mx-auto mb-3" />
              <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                ${analyticsData.overview.totalPrizes.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Prizes</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <Star className="w-8 h-8 text-neon-magenta mx-auto mb-3" />
              <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                #{analyticsData.overview.globalRank}
              </div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
              <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                +{analyticsData.overview.skillGrowth}%
              </div>
              <div className="text-sm text-muted-foreground">Skill Growth</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center">
              <Activity className="w-8 h-8 text-neon-purple mx-auto mb-3" />
              <div className="text-2xl font-orbitron font-bold text-foreground mb-1">
                {analyticsData.overview.teamCollaborations}
              </div>
              <div className="text-sm text-muted-foreground">Collaborations</div>
            </GlassCard>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground">
                  Monthly Performance
                </h3>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                {analyticsData.monthlyStats.map((stat, index) => (
                  <motion.div
                    key={stat.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg glass"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-foreground font-medium">{stat.month}</div>
                      <Badge variant="outline" className="text-xs">
                        {stat.hackathons} events
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {stat.wins} wins
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-orbitron font-bold text-neon-cyan">
                        ${stat.prizes.toLocaleString()}
                      </div>
                      <div className="w-20 bg-muted rounded-full h-1 mt-1">
                        <div 
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${(stat.prizes / maxPrize) * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Skill Development */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-orbitron font-bold text-xl text-foreground">
                  Skill Development
                </h3>
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                {analyticsData.skillProgress.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-orbitron font-bold text-foreground">
                          {skill.current}%
                        </span>
                        <div className="flex items-center gap-1">
                          {skill.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          )}
                          <span className="text-xs text-success">
                            +{skill.current - skill.previous}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div 
                        initial={{ width: `${skill.previous}%` }}
                        animate={{ width: `${skill.current}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="bg-primary h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Team Performance Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-orbitron font-bold text-2xl text-foreground">
                Team Performance Dashboard
              </h3>
              <Button variant="glass" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 6 Months
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <ProgressRing progress={analyticsData.teamPerformance.leadershipRate} size={100}>
                  <div className="text-center">
                    <div className="font-orbitron font-bold text-lg text-foreground">
                      {analyticsData.teamPerformance.leadershipRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Leadership</div>
                  </div>
                </ProgressRing>
              </div>
              
              <div className="text-center">
                <ProgressRing progress={85} size={100}>
                  <div className="text-center">
                    <div className="font-orbitron font-bold text-lg text-foreground">
                      {analyticsData.teamPerformance.averageTeamSize}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Team Size</div>
                  </div>
                </ProgressRing>
              </div>
              
              <div className="text-center">
                <ProgressRing progress={75} size={100}>
                  <div className="text-center">
                    <div className="font-orbitron font-bold text-lg text-foreground">
                      {analyticsData.teamPerformance.mentorshipHours}h
                    </div>
                    <div className="text-xs text-muted-foreground">Mentorship</div>
                  </div>
                </ProgressRing>
              </div>
              
              <div className="text-center">
                <ProgressRing progress={92} size={100}>
                  <div className="text-center">
                    <div className="font-orbitron font-bold text-lg text-foreground">
                      {analyticsData.teamPerformance.projectsCompleted}
                    </div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                </ProgressRing>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-8">
            <div className="text-center">
              <h3 className="font-orbitron font-bold text-xl text-foreground mb-4">
                Recommendations for Growth
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 rounded-lg glass text-center">
                  <Zap className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Focus on AI/ML</h4>
                  <p className="text-sm text-muted-foreground">
                    Your fastest growing skill area with high demand
                  </p>
                </div>
                <div className="p-4 rounded-lg glass text-center">
                  <Award className="w-8 h-8 text-warning mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Leadership Role</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider leading more teams to boost win rate
                  </p>
                </div>
                <div className="p-4 rounded-lg glass text-center">
                  <Target className="w-8 h-8 text-neon-lime mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Skill Diversification</h4>
                  <p className="text-sm text-muted-foreground">
                    Expand into blockchain for new opportunities
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}