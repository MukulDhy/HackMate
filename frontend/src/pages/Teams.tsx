import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  Circle,
  MoreVertical,
  Github,
  ExternalLink,
  Trophy
} from 'lucide-react';

const currentTeam = {
  id: 1,
  name: 'AI Health Innovators',
  hackathon: 'AI-Powered Healthcare Solutions',
  status: 'Active',
  timeRemaining: '18h 32m',
  progress: 65,
  members: [
    {
      id: 1,
      name: 'Alex Rodriguez',
      role: 'Team Lead',
      avatar: '/placeholder-avatar.jpg',
      skills: ['React', 'Node.js', 'Leadership'],
      status: 'online',
      isCurrentUser: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'AI Engineer',
      avatar: '/placeholder-avatar.jpg',
      skills: ['Python', 'TensorFlow', 'Machine Learning'],
      status: 'online'
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      role: 'Backend Developer',
      avatar: '/placeholder-avatar.jpg',
      skills: ['Python', 'Django', 'PostgreSQL'],
      status: 'away'
    },
    {
      id: 4,
      name: 'Emily Zhang',
      role: 'UX Designer',
      avatar: '/placeholder-avatar.jpg',
      skills: ['Figma', 'User Research', 'Prototyping'],
      status: 'offline'
    }
  ],
  tasks: [
    { id: 1, title: 'Design user interface mockups', assignee: 'Emily Zhang', status: 'completed', priority: 'high' },
    { id: 2, title: 'Set up machine learning pipeline', assignee: 'Sarah Chen', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Implement user authentication', assignee: 'Alex Rodriguez', status: 'in-progress', priority: 'medium' },
    { id: 4, title: 'Create database schema', assignee: 'Marcus Johnson', status: 'completed', priority: 'high' },
    { id: 5, title: 'Integrate AI model with backend', assignee: 'Sarah Chen', status: 'todo', priority: 'high' },
    { id: 6, title: 'Implement responsive design', assignee: 'Alex Rodriguez', status: 'todo', priority: 'medium' },
  ]
};

const pastTeams = [
  {
    id: 2,
    name: 'Web3 Warriors',
    hackathon: 'DeFi Protocol Innovation',
    result: 'Winner',
    prize: '$25,000',
    date: '2024-01-15',
    members: 4,
    technologies: ['Solidity', 'React', 'Web3.js']
  },
  {
    id: 3,
    name: 'Game Changers',
    hackathon: 'Mobile Game Development Jam',
    result: '2nd Place',
    prize: '$7,500',
    date: '2024-01-08',
    members: 3,
    technologies: ['Unity', 'C#', 'Mobile']
  },
  {
    id: 4,
    name: 'Green Tech Squad',
    hackathon: 'Sustainable Tech Challenge',
    result: '3rd Place',
    prize: '$3,000',
    date: '2023-12-20',
    members: 5,
    technologies: ['IoT', 'Python', 'Data Analytics']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-success';
    case 'away': return 'bg-warning';
    case 'offline': return 'bg-muted';
    default: return 'bg-muted';
  }
};

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
    case 'in-progress': return <Circle className="w-4 h-4 text-neon-cyan fill-current" />;
    case 'todo': return <Circle className="w-4 h-4 text-muted-foreground" />;
    default: return <Circle className="w-4 h-4 text-muted-foreground" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'border-l-destructive';
    case 'medium': return 'border-l-warning';
    case 'low': return 'border-l-success';
    default: return 'border-l-muted';
  }
};

export default function Teams() {
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
            Your Teams
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Collaborate with talented developers and build amazing projects together
          </p>
        </motion.div>

        {/* Current Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron font-bold text-2xl text-foreground">Current Team</h2>
            <Badge variant="default" className="bg-success/20 text-success border-success/30">
              Active
            </Badge>
          </div>

          <GlassCard variant="glow" className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Team Overview */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-orbitron font-bold text-2xl text-foreground mb-2">
                      {currentTeam.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentTeam.hackathon}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-neon-cyan" />
                        <span className="text-foreground font-medium">
                          {currentTeam.timeRemaining}
                        </span>
                        <span className="text-muted-foreground">remaining</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground font-medium">{currentTeam.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${currentTeam.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="neon" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Team Chat
                    </Button>
                    <Button variant="glass" size="sm">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button variant="glass" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="lg:col-span-1">
                <h4 className="font-orbitron font-semibold text-lg text-foreground mb-4">
                  Team Members
                </h4>
                <div className="space-y-3">
                  {currentTeam.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg glass-card">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-foreground font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground text-sm">
                            {member.name}
                          </span>
                          {member.isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{member.role}</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs px-1">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1">
                              +{member.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Board */}
              <div className="lg:col-span-1">
                <h4 className="font-orbitron font-semibold text-lg text-foreground mb-4">
                  Task Board
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {currentTeam.tasks.map((task) => (
                    <div key={task.id} className={`p-3 rounded-lg glass border-l-2 ${getPriorityColor(task.priority)}`}>
                      <div className="flex items-start gap-2">
                        {getTaskStatusIcon(task.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assigned to {task.assignee}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="glass" size="sm" className="w-full mt-4">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Board
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Past Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron font-bold text-2xl text-foreground">Past Teams</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard variant="interactive" className="p-6 h-full">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-orbitron font-semibold text-lg text-foreground mb-1">
                          {team.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {team.hackathon}
                        </p>
                      </div>
                      {team.result === 'Winner' && (
                        <Trophy className="w-5 h-5 text-warning" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={team.result === 'Winner' ? 'default' : 'secondary'}
                          className={team.result === 'Winner' ? 'bg-warning/20 text-warning border-warning/30' : ''}
                        >
                          {team.result}
                        </Badge>
                        <span className="font-orbitron font-bold text-neon-cyan text-sm">
                          {team.prize}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {team.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {team.date}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {team.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="glass" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Formation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-8">
            <div className="text-center">
              <h3 className="font-orbitron font-bold text-xl text-foreground mb-4">
                Looking for a New Team?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join a lobby and let our AI-powered matching system connect you with developers 
                who complement your skills and share your passion for innovation.
              </p>
              <Button variant="hero" size="lg">
                <Users className="w-5 h-5 mr-2" />
                Find Your Next Team
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}