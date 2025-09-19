import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Trophy, DollarSign, Globe, 
  Linkedin, Twitter, MessageSquare, Mail, Phone, Building, 
  Award, FileText, CheckCircle, AlertCircle, Play, User, 
  ArrowLeft, Timer, ExternalLink, Shield, Users2 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/config/API_URL';
import { useAppDispatch, useAppSelector, useUser } from '@/hooks/authHook';
import { showError, showSuccess } from '@/components/ui/ToasterMsg';
import { joinHackathon, leaveHackathon } from '@/store/slices/userCurrrentHacthon';

// Countdown Timer Component
const CountdownTimer = ({ targetDate, label, onComplete, onStartTimeReached }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      onComplete && onComplete();
      // Check if this is the start time countdown
      if (label.includes('starts')) {
        onStartTimeReached && onStartTimeReached();
      }
      return null;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 font-semibold">{label} has ended</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-blue-500 text-white rounded-lg p-2">
          <div className="text-lg font-bold">{timeLeft.days}</div>
          <div className="text-xs">Days</div>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-2">
          <div className="text-lg font-bold">{timeLeft.hours}</div>
          <div className="text-xs">Hours</div>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-2">
          <div className="text-lg font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">Minutes</div>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-2">
          <div className="text-lg font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">Seconds</div>
        </div>
      </div>
    </div>
  );
};

const HackathonDetailsPage = () => {
  const [hackathonData, setHackathonData] = useState(null);
  const userhack = useAppSelector((state) => state.userHack);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(userhack.joined || false);
  const [joining, setJoining] = useState(false);
  const [hackathonState, setHackathonState] = useState({
    canJoin: false,
    canLeave: false,
    currentPhase: '',
    nextDeadline: null,
    nextDeadlineLabel: ''
  });
  const [startTimeReached, setStartTimeReached] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useUser();

  // Calculate hackathon state based on dates
  const calculateHackathonState = (data) => {
    if (!data) return;
    
    const now = new Date();
    const regDeadline = new Date(data.registrationDeadline);
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    let state = {
      canJoin: false,
      canLeave: false,
      currentPhase: '',
      nextDeadline: null,
      nextDeadlineLabel: ''
    };

    if (now < regDeadline) {
      // Registration phase
      state.canJoin = true;
      state.canLeave = isJoined;
      state.currentPhase = 'Registration Open';
      state.nextDeadline = regDeadline;
      state.nextDeadlineLabel = 'Registration closes in';
    } else if (now >= regDeadline && now < startDate) {
      // Between registration close and start
      state.canJoin = false;
      state.canLeave = false;
      state.currentPhase = 'Registration Closed';
      state.nextDeadline = startDate;
      state.nextDeadlineLabel = 'Hackathon starts in';
    } else if (now >= startDate && now < endDate) {
      // Hackathon ongoing
      state.canJoin = false;
      state.canLeave = false;
      state.currentPhase = 'Hackathon Ongoing';
      state.nextDeadline = endDate;
      state.nextDeadlineLabel = 'Hackathon ends in';
    } else {
      // Hackathon ended
      state.canJoin = false;
      state.canLeave = false;
      state.currentPhase = 'Hackathon Ended';
      state.nextDeadline = null;
      state.nextDeadlineLabel = '';
    }

    return state;
  };

  useEffect(() => {
    fetchHackathonData();
  }, [id]);

  useEffect(() => {
    if (hackathonData) {
      const state = calculateHackathonState(hackathonData);
      setHackathonState(state);
    }
  }, [hackathonData, isJoined]);

  // Handle navigation to team page when start time is reached
  useEffect(() => {
    if (startTimeReached && isJoined) {
      // Add a small delay to show the transition
      const timer = setTimeout(() => {
        // Add animation class to body for page transition
        document.body.classList.add('page-transition');
        
        // Navigate to team page after a short delay for animation
        setTimeout(() => {
          navigate(`/team}`, {
            state: { 
              hackathonData,
              animation: true 
            }
          });
        }, 500); // Match this with your CSS transition duration
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [startTimeReached, isJoined, id, navigate, hackathonData]);

  const fetchHackathonData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id || id.length !== 24) {
        setError('Invalid hackathon ID');
        return;
      }

      const response = await axios.get(`${API_URL}/api/hackathons/${id}`);
      
      if (response.data.success) {
        setHackathonData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch hackathon');
      }
    } catch (err) {
      console.error('Fetch hackathon error:', err);
      
      if (err.response?.status === 404) {
        setError('Hackathon not found');
      } else if (err.response?.status === 400) {
        setError('Invalid request');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load hackathon details');
      }
      
      showError(err.response?.data?.message || 'Failed to load hackathon details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHackathon = async () => {
    if (!isAuthenticated) {
      showError('Please login to join hackathons');
      navigate('/login', { state: { from: `/hackathons/${id}` } });
      return;
    }

    try {
      setJoining(true);

      if (isJoined) {
        if (!hackathonState.canLeave) {
          showError('Cannot leave hackathon at this time');
          return;
        }
        await dispatch(leaveHackathon(id)).unwrap();
        setIsJoined(false);
        showSuccess("Successfully left hackathon");
      } else {
        if (!hackathonState.canJoin) {
          showError('Cannot join hackathon at this time');
          return;
        }
        await dispatch(joinHackathon(id)).unwrap();
        setIsJoined(true);
        showSuccess("Successfully joined hackathon");
      }

    } catch (err) {
      console.error("Hackathon join/leave error:", err);
      showError(err.response?.data?.message || "Failed to join/leave hackathon");
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registration_open': return 'text-green-500';
      case 'upcoming': return 'text-blue-500';
      case 'ongoing': return 'text-yellow-500';
      case 'completed': return 'text-gray-500';
      case 'registration_closed': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'registration_open': return <CheckCircle className="w-5 h-5" />;
      case 'upcoming': return <Clock className="w-5 h-5" />;
      case 'ongoing': return <Play className="w-5 h-5" />;
      case 'registration_closed': return <AlertCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Registration Open': return 'text-green-500 bg-green-100 dark:bg-green-900 dark:bg-opacity-20';
      case 'Registration Closed': return 'text-orange-500 bg-orange-100 dark:bg-orange-900 dark:bg-opacity-20';
      case 'Hackathon Ongoing': return 'text-blue-500 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20';
      case 'Hackathon Ended': return 'text-gray-500 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading hackathon details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center py-12 px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {error}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Go Back
            </button>
            <button
              onClick={fetchHackathonData}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!hackathonData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Unable to load hackathon information
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={hackathonData.bannerImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'}
          alt="Hackathon Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{hackathonData.title}</h1>
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-20">
                {getStatusIcon(hackathonData.status)}
                {hackathonData.status?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN'}
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${getPhaseColor(hackathonState.currentPhase)}`}>
                <Timer className="w-4 h-4 inline mr-2" />
                {hackathonState.currentPhase}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Countdown Timer */}
            {hackathonState.nextDeadline && (
              <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <CountdownTimer
                  targetDate={hackathonState.nextDeadline}
                  label={hackathonState.nextDeadlineLabel}
                  onComplete={() => {
                    // Refresh hackathon state when countdown completes
                    const newState = calculateHackathonState(hackathonData);
                    setHackathonState(newState);
                  }}
                  onStartTimeReached={() => {
                    if (hackathonState.nextDeadlineLabel.includes('starts')) {
                      setStartTimeReached(true);
                    }
                  }}
                />
              </section>
            )}

            {/* Description */}
            <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4">About This Hackathon</h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {hackathonData.description || 'No description available.'}
              </p>
            </section>

            {/* Problem Statements */}
            {hackathonData.problemStatements && hackathonData.problemStatements.length > 0 && (
              <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  Problem Statements
                </h2>
                <div className="grid gap-3">
                  {hackathonData.problemStatements.map((problem, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <p className="flex-1">{problem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prizes */}
            {hackathonData.prizes && hackathonData.prizes.length > 0 && (
              <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Prizes & Rewards
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {hackathonData.prizes.map((prize, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-lg">{prize.position}</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-500 mb-2">
                        ${prize.amount?.toLocaleString() || '0'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {prize.description || 'No description specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rules & Requirements */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Requirements */}
              {hackathonData.requirements && hackathonData.requirements.length > 0 && (
                <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                  <h3 className="text-xl font-bold mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {hackathonData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Rules */}
              {hackathonData.rules && hackathonData.rules.length > 0 && (
                <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                  <h3 className="text-xl font-bold mb-4">Rules</h3>
                  <ul className="space-y-2">
                    {hackathonData.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* FAQ */}
            {hackathonData.faqs && hackathonData.faqs.length > 0 && (
              <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {hackathonData.faqs.map((faq, index) => (
                    <details key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <summary className="font-semibold cursor-pointer hover:text-blue-500 transition-colors">
                        {faq.question}
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Members Joined
                  </span>
                  <span className="text-2xl font-bold text-blue-500">
                    {hackathonData.totalMembersJoined?.toLocaleString() || '0'}
                  </span>
                </div>
                {hackathonData.maxRegistrations && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((hackathonData.totalMembersJoined || 0) / hackathonData.maxRegistrations) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      {Math.max(hackathonData.maxRegistrations - (hackathonData.totalMembersJoined || 0), 0)} spots remaining
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={handleJoinHackathon}
                disabled={joining || (!hackathonState.canJoin && !hackathonState.canLeave)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isJoined 
                    ? hackathonState.canLeave 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 cursor-not-allowed'
                    : hackathonState.canJoin 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                {joining ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isJoined ? 'Leaving...' : 'Joining...'}
                  </div>
                ) : (
                  <>
                    {isJoined 
                      ? hackathonState.canLeave ? 'Leave Hackathon' : '✓ Joined'
                      : hackathonState.canJoin ? 'Join Hackathon' : 'Registration Closed'
                    }
                  </>
                )}
              </button>

              {(!hackathonState.canJoin && !hackathonState.canLeave) && (
                <p className="text-xs mt-2 text-center text-gray-500 dark:text-gray-400">
                  {hackathonState.currentPhase === 'Registration Closed' && 'Registration period has ended'}
                  {hackathonState.currentPhase === 'Hackathon Ongoing' && 'Hackathon is currently in progress'}
                  {hackathonState.currentPhase === 'Hackathon Ended' && 'This hackathon has ended'}
                </p>
              )}
            </div>

            {/* Event Details */}
            <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4">Event Timeline</h3>
              <div className="space-y-4">
                {hackathonData.registrationDeadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-semibold text-sm">Registration Deadline</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathonData.registrationDeadline)}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.startDate && (
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-sm">Hackathon Start</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathonData.startDate)}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.endDate && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-sm">Hackathon End</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathonData.endDate)}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.winnerAnnouncementDate && (
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-sm">Winner Announcement</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathonData.winnerAnnouncementDate)}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.venue && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-sm">Venue</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {hackathonData.venue}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.mode && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-semibold text-sm">Mode</p>
                      <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                        {hackathonData.mode}
                      </p>
                    </div>
                  </div>
                )}

                {hackathonData.maxTeamSize && (
                  <div className="flex items-center gap-3">
                    <Users2 className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-sm">Team Size</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        1-{hackathonData.maxTeamSize} members
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-sm">Registration Fee</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(hackathonData.registrationFee === 0 || !hackathonData.registrationFee) ? 'Free' : `$${hackathonData.registrationFee}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {hackathonData.tags && hackathonData.tags.length > 0 && (
              <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h3 className="text-xl font-bold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {hackathonData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            {hackathonData.organizer && (
              <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h3 className="text-xl font-bold mb-4">Organizer</h3>
                <div className="space-y-3">
                  {hackathonData.organizer.organization && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{hackathonData.organizer.organization}</span>
                    </div>
                  )}
                  {hackathonData.organizer.name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{hackathonData.organizer.name}</span>
                    </div>
                  )}
                  {hackathonData.organizer.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${hackathonData.organizer.contactEmail}`} className="text-blue-500 hover:underline">
                        {hackathonData.organizer.contactEmail}
                      </a>
                    </div>
                  )}
                  {hackathonData.organizer.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{hackathonData.organizer.contactNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {hackathonData.socialLinks && Object.values(hackathonData.socialLinks).some(link => link) && (
              <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  {hackathonData.socialLinks.website && (
                    <a
                      href={hackathonData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg text-center transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Globe className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">Website</span>
                    </a>
                  )}
                  {hackathonData.socialLinks.linkedin && (
                    <a
                      href={hackathonData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg text-center transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Linkedin className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <span className="text-xs">LinkedIn</span>
                    </a>
                  )}
                  {hackathonData.socialLinks.twitter && (
                    <a
                      href={hackathonData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg text-center transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Twitter className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                      <span className="text-xs">Twitter</span>
                    </a>
                  )}
                  {hackathonData.socialLinks.discord && (
                    <a
                      href={hackathonData.socialLinks.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg text-center transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <MessageSquare className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                      <span className="text-xs">Discord</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {hackathonData.submissionDeadline && (
              <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
                <h3 className="text-xl font-bold mb-4">Submission Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-sm">Submission Deadline</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(hackathonData.submissionDeadline)}
                      </p>
                    </div>
                  </div>
                  {hackathonData.submissionFormat && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-semibold text-sm">Submission Format</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hackathonData.submissionFormat}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetailsPage;