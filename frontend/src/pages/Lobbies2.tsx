// pages/Lobbies.tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect } from '@/components/ui/filter-select';
import { 
  Users, 
  Clock, 
  Trophy, 
  Zap,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'; // Added useRef
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/index';
import { fetchHackathons, setFilters } from '@/store/slices/hackathonSlice';
import { Hackathon, HackathonStatus } from '@/types/hackathon';
import { useNavigate } from 'react-router-dom';

// Categories based on tags
const lobbyCategories = [
  { name: 'All', count: 0, active: true },
  { name: 'AI/ML', count: 0, active: false },
  { name: 'Web3', count: 0, active: false },
  { name: 'Mobile', count: 0, active: false },
  { name: 'Game Dev', count: 0, active: false },
  { name: 'IoT', count: 0, active: false },
];

const difficultyOptions = [
  { value: 'Beginner', label: 'Beginner', count: 0 },
  { value: 'Intermediate', label: 'Intermediate', count: 0 },
  { value: 'Advanced', label: 'Advanced', count: 0 },
  { value: 'Expert', label: 'Expert', count: 0 }
];

const typeOptions = [
  { value: 'online', label: 'Virtual', count: 0 },
  { value: 'offline', label: 'In-Person', count: 0 },
  { value: 'hybrid', label: 'Hybrid', count: 0 }
];

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming', count: 0 },
  { value: 'registration_open', label: 'Registration Open', count: 0 },
  { value: 'ongoing', label: 'Ongoing', count: 0 },
  { value: 'completed', label: 'Completed', count: 0 }
];

export default function Lobbies() {
  const dispatch = useDispatch<AppDispatch>();
  const { hackathons, loading, error, filters, pagination } = useSelector(
    (state: RootState) => state.hackathons
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<'newest' | 'oldest' | 'soonest' | 'ending_soon'>('newest');

  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null); // Fixed: using useRef instead of useCallback

  // Memoized filtered hackathons for better performance
  const filteredHackathons = useMemo(() => {
    if (!hackathons.length) return [];
    
    return hackathons
      .map(hackathon => {
        const now = new Date();
        const endDate = new Date(hackathon.endDate);
        const isEnded = endDate < now;
        // Return a new object if status needs to be changed
        if (isEnded && hackathon.status !== 'completed' && hackathon.status !== 'cancelled') {
          return { ...hackathon, status: 'completed' };
        }
        return hackathon;
      })
      .sort((a, b) => {
        // Sort based on date filter
        switch (dateFilter) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'soonest':
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          case 'ending_soon':
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          default:
            return 0;
        }
      });
  }, [hackathons, dateFilter]);

  // Fetch hackathons on component mount and when filters change
  useEffect(() => {
    const filterParams: any = {
      ...filters,
      search: searchTerm || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      mode: selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
      status: selectedStatus.length > 0 ? selectedStatus.join(',') : undefined,
    };
    
    dispatch(fetchHackathons(filterParams));
  }, [dispatch, filters, searchTerm, selectedTags, selectedTypes, selectedStatus]);

  const handleHackathonClick = useCallback((id: string) => {
    navigate(`/hackathon/${id}`);
  }, [navigate]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags([category]);
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus([]);
    setSelectedTypes([]);
    setSelectedTags([]);
    setDateFilter('newest');
    dispatch(setFilters({ search: '', tags: undefined, mode: undefined, status: undefined }));
  }, [dispatch]);

  const getDifficultyColor = useCallback((status: HackathonStatus) => {
    switch (status) {
      case 'upcoming': return 'text-success border-success/30';
      case 'registration_open': return 'text-warning border-warning/30';
      case 'ongoing': return 'text-neon-cyan border-neon-cyan/30';
      case 'completed': return 'text-destructive border-destructive/30';
      case 'cancelled': return 'text-destructive border-destructive/30';
      default: return 'text-muted-foreground border-muted/30';
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'online': return '🌐';
      case 'offline': return '📍';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const formatTimeLeft = useCallback((dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }, []);

  const calculateProgress = useCallback((hackathon: Hackathon) => {
    return (hackathon.totalMembersJoined / hackathon.maxRegistrations) * 100;
  }, []);

  const getStatusText = useCallback((status: HackathonStatus) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'registration_open': return 'Registration Open';
      case 'registration_closed': return 'Registration Closed';
      case 'ongoing': return 'Ongoing';
      case 'winner_to_announced': return 'Winner to be Announced';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }, []);

  const loadMore = useCallback(() => {
     // Scroll to the grid after a short delay to ensure new content is loaded
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
    dispatch(setFilters({ page: pagination.currentPage + 1 }));
  }, [dispatch, pagination.currentPage]);

  const isRegistrationClosed = useCallback((hackathon: Hackathon) => {
    const now = new Date();
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    return registrationDeadline < now || hackathon.status !== 'registration_open';
  }, []);

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-5">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground mb-4">
              Active Hackathons
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join hackathon lobbie and connect with talented developers worldwide
            </p>
          </div>
        </motion.div> */}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading hackathons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <GlassCard className="p-6 text-center my-8">
            <p className="text-destructive">Error: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => dispatch(fetchHackathons(filters))}
            >
              Try Again
            </Button>
          </GlassCard>
        )}

        {/* Hackathons Grid */}
        {!loading && !error && (
          <>
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {filteredHackathons.slice(0, 1).map((hackathon, index) => (
    <motion.div
      key={hackathon._id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => handleHackathonClick(hackathon._id)}
      className="cursor-pointer"
    >
      <GlassCard 
        variant="interactive" 
        className="p-6 sm:p-8 relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
      >
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-60"></div>
        
        {/* Header Section */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-primary">Featured Hackathon</span>
          </div>
          
          <h1 className="font-orbitron font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {hackathon.title}
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {hackathon.description}
          </p>
        </div>

        {/* Status and Info Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 text-center">
            <Badge variant="outline" className={`${getDifficultyColor(hackathon.status)} text-sm mb-2 px-3 py-1`}>
              {getStatusText(hackathon.status)}
            </Badge>
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
          
          {hackathon.venue && (
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-neon-cyan" />
                <span className="font-medium text-foreground">{hackathon.venue}</span>
              </div>
              <p className="text-xs text-muted-foreground">Venue</p>
            </div>
          )}
          
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {getTypeIcon(hackathon.mode)}
              <span className="font-medium text-foreground">{hackathon.mode}</span>
            </div>
            <p className="text-xs text-muted-foreground">Mode</p>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-neon-lime" />
              <span className="font-medium text-foreground">{formatDate(hackathon.startDate)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Start Date</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
            <Users className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
            <div className="text-2xl font-bold font-orbitron text-foreground">
              {hackathon.totalMembersJoined}/{hackathon.maxRegistrations}
            </div>
            <p className="text-sm text-muted-foreground">Participants</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <Clock className="w-8 h-8 text-neon-magenta mx-auto mb-2" />
            <div className="text-2xl font-bold font-orbitron text-foreground">
              {formatTimeLeft(hackathon.startDate)}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(hackathon.startDate) > new Date() ? 'to start' : 'since start'}
            </p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-warning/5 border border-warning/10">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold font-orbitron text-foreground">
              ${hackathon.prizes[0]?.amount || 0}
            </div>
            <p className="text-sm text-muted-foreground">Prize Pool</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-success/5 border border-success/10">
            <Zap className="w-8 h-8 text-neon-lime mx-auto mb-2" />
            <div className="text-2xl font-bold font-orbitron text-foreground">
              {hackathon.tags.length}
            </div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-foreground">Registration Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(calculateProgress(hackathon))}% filled
            </span>
          </div>
          <div className="w-full bg-muted/50 rounded-full h-3 mb-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress(hackathon)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Registration Open</span>
            <span>Until {formatDate(hackathon.registrationDeadline)}</span>
          </div>
        </div>

        {/* Tags Section */}
        <div className="relative mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Categories & Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {hackathon.tags.map((tag, tagIndex) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (tagIndex * 0.1) }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-sm px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border-primary/20"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-border/50">
          <Button 
            variant="glass" 
            size="lg"
            className="w-full sm:w-auto px-8 py-3 text-base"
          >
            View Full Details
          </Button>
          <Button 
            variant="neon" 
            size="lg"
            className="w-full sm:w-auto px-8 py-3 text-base gap-3"
            disabled={isRegistrationClosed(hackathon)}
          >
            <Zap className="w-5 h-5" />
            {isRegistrationClosed(hackathon) ? 'Registration Closed' : 'Join Hackathon Now'}
          </Button>
        </div>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full blur-xl"></div>
      </GlassCard>
    </motion.div>
  ))}
</div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHackathons.length === 0 && (
          <GlassCard className="p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-orbitron text-xl text-foreground mb-2">No hackathons found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new hackathons.
            </p>
            <Button 
              variant="outline"
              onClick={clearAllFilters}
            >
              Clear Filters
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
}