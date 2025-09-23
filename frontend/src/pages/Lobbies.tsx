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
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  }).sort((a, b) => {
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
    dispatch(setFilters({ page: pagination.currentPage + 1 }));
  }, [dispatch, pagination.currentPage]);

  const isRegistrationClosed = useCallback((hackathon: Hackathon) => {
    const now = new Date();
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    return registrationDeadline < now || hackathon.status !== 'registration_open';
  }, []);

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground mb-4">
              Active Hackathons
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join skill-based hackathon lobbies and connect with talented developers worldwide
            </p>
          </div>

          {/* Search and Filters */}
          <GlassCard className="p-6 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full md:w-auto">
                  <SearchInput
                    placeholder="Search hackathons, technologies, or hosts..."
                    value={searchTerm}
                    onSearch={setSearchTerm}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterSelect
                    title="Status"
                    options={statusOptions}
                    selectedValues={selectedStatus}
                    onSelectionChange={setSelectedStatus}
                  />
                  <FilterSelect
                    title="Type"
                    options={typeOptions}
                    selectedValues={selectedTypes}
                    onSelectionChange={setSelectedTypes}
                  />
                  <select 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="bg-background/20 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="soonest">Starting Soon</option>
                    <option value="ending_soon">Ending Soon</option>
                  </select>
                </div>
              </div>
              
              {/* Active filters display */}
              {(selectedTypes.length > 0 || selectedTags.length > 0 || selectedStatus.length > 0 || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      Search: {searchTerm}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSearchTerm('')}
                      />
                    </Badge>
                  )}
                  {selectedStatus.map((status) => (
                    <Badge key={status} variant="secondary" className="text-xs flex items-center gap-1">
                      Status: {statusOptions.find(opt => opt.value === status)?.label}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedStatus(prev => prev.filter(s => s !== status))}
                      />
                    </Badge>
                  ))}
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs flex items-center gap-1">
                      Type: {typeOptions.find(opt => opt.value === type)?.label}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))}
                      />
                    </Badge>
                  ))}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                      Tag: {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                      />
                    </Badge>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="text-xs h-6 px-2"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {lobbyCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "hero" : "glass"}
                size="sm"
                onClick={() => handleCategoryChange(category.name)}
                className="gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleHackathonClick(hackathon._id)}
                  className="cursor-pointer"
                >
                  <GlassCard 
                    variant="interactive" 
                    className="p-6 h-full relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="font-orbitron font-bold text-xl text-foreground mb-2">
                          {hackathon.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {hackathon.description}
                        </p>
                      </div>

                      {/* Status and Basic Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline" className={`${getDifficultyColor(hackathon.status)} text-xs`}>
                          {getStatusText(hackathon.status)}
                        </Badge>
                        {hackathon.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {hackathon.venue}
                          </span>
                        )}
                        <span>{getTypeIcon(hackathon.mode)} {hackathon.mode}</span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-neon-cyan" />
                          <span className="text-foreground font-medium">
                            {hackathon.totalMembersJoined}/{hackathon.maxRegistrations}
                          </span>
                          <span className="text-muted-foreground">participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-neon-magenta" />
                          <span className="text-foreground font-medium">
                            {formatTimeLeft(hackathon.startDate)}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(hackathon.startDate) > new Date() ? 'to start' : 'since start'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-neon-lime" />
                          <span className="text-foreground font-medium">
                            {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-warning" />
                          <span className="text-foreground font-medium font-orbitron">
                            ${hackathon.prizes[0]?.amount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(hackathon)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                          {Math.round(calculateProgress(hackathon))}% filled
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {hackathon.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{hackathon.tags.length - 5}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-muted-foreground">
                          Registration until {formatDate(hackathon.registrationDeadline)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="glass" size="sm">
                            View Details
                          </Button>
                          <Button 
                            variant="neon" 
                            size="sm" 
                            className="gap-2"
                            disabled={isRegistrationClosed(hackathon)}
                          >
                            <Zap className="w-4 h-4" />
                            {isRegistrationClosed(hackathon) ? 'Registration Closed' : 'Join Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {pagination.currentPage < pagination.totalPages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-12"
              >
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Hackathons'}
                </Button>
              </motion.div>
            )}
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