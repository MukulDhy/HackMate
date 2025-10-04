import { useState, useEffect } from 'react';
import { Clock, Users, MapPin, Calendar, Trophy, DollarSign, CheckCircle, XCircle, PlayCircle, Globe, Linkedin, Twitter, MessageSquare, Send, ThumbsUp, AlertCircle, Target, FileText, Award, Mail, Phone, Building2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface Hackathon {
  hackathonId: number;
  hackName: string;
  title: string;
  description: string;
  extraDetail?: string;
  specialDetail?: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  winnerAnnouncementDate?: string;
  submissionDeadline?: string;
  submissionFormat?: string;
  status: string;
  problemStatements: string[];
  maxTeamSize: number;
  minParticipantsToFormTeam: number;
  venue: string;
  mode: string;
  registrationFee: number;
  prizes: Array<{
    position: string;
    amount: number;
    rewards?: string;
  }>;
  evaluationCriteria: Array<{
    criterion: string;
    weight: number;
  }>;
  tags: string[];
  totalMembersJoined: number;
  maxRegistrations?: number;
  requirements: string[];
  rules: string[];
  bannerImage?: string;
  organizer: {
    name: string;
    contactEmail: string;
    contactNumber?: string;
    organization: string;
  };
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    discord?: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface Discussion {
  id: number;
  user: string;
  avatar: string;
  question: string;
  answer?: string;
  timestamp: string;
  likes: number;
  replies: number;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CyberHackathonDetail = () => {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });


  const [isPaymentloading, setPaymenetLoading] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'faq' | 'discussion'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      user: "Alex Chen",
      avatar: "AC",
      question: "What quantum frameworks are allowed?",
      answer: "You can use Qiskit, Cirq, or any major quantum framework. We'll provide documentation for all.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 3
    },
    {
      id: 2,
      user: "Sarah Kumar",
      avatar: "SK",
      question: "Is there mentorship available during the event?",
      timestamp: "5 hours ago",
      likes: 8,
      replies: 1
    }
  ]);

  useEffect(() => {
    const mockHackathon: Hackathon = {
      hackathonId: 101,
      hackName: "quantum-hack-2024",
      title: "Quantum Hack 2024",
      description: "Join the ultimate quantum computing hackathon where innovators and developers come together to solve complex problems using quantum algorithms and technologies. This event brings together the brightest minds in quantum computing to push the boundaries of what's possible.",
      extraDetail: "Special workshops on quantum machine learning and cryptography will be conducted by industry experts from IBM and Google Quantum AI.",
      specialDetail: "Special workshops on quantum machine learning and cryptography will be conducted by industry experts from IBM and Google Quantum AI.",
      registrationDeadline: "2025-12-15T23:59:59",
      startDate: "2024-12-20T09:00:00",
      endDate: "2024-12-22T18:00:00",
      winnerAnnouncementDate: "2024-12-23T14:00:00",
      submissionDeadline: "2024-12-22T16:00:00",
      submissionFormat: "GitHub repository with README, documentation, and demo video (max 5 minutes)",
      status: "registration_open",
      problemStatements: [
        "Quantum Machine Learning for Drug Discovery",
        "Optimizing Supply Chain with Quantum Algorithms",
        "Quantum Cryptography for Secure Communications",
        "Financial Modeling with Quantum Computing"
      ],
      maxTeamSize: 4,
      minParticipantsToFormTeam: 2,
      venue: "Tech Innovation Center, Silicon Valley",
      mode: "hybrid",
      registrationFee: 50,
      prizes: [
        { position: "1st", amount: 10000, rewards: "Quantum Development Kit + 6-month Mentorship" },
        { position: "2nd", amount: 5000, rewards: "Quantum Computing Course Access (1 year)" },
        { position: "3rd", amount: 2500, rewards: "Premium Developer Swag Pack + Books" }
      ],
      evaluationCriteria: [
        { criterion: "Innovation & Creativity", weight: 30 },
        { criterion: "Technical Implementation", weight: 25 },
        { criterion: "Impact & Feasibility", weight: 25 },
        { criterion: "Presentation Quality", weight: 20 }
      ],
      tags: ["Quantum", "AI", "Blockchain", "Web3", "Innovation"],
      totalMembersJoined: 247,
      maxRegistrations: 500,
      requirements: [
        "Basic programming knowledge (Python/JavaScript)",
        "Understanding of quantum concepts (beginner workshops provided)",
        "Team of 2-4 members required",
        "GitHub account for submission",
        "Laptop with minimum 8GB RAM"
      ],
      rules: [
        "All code must be original work created during the hackathon",
        "Teams must use provided quantum simulators or frameworks",
        "Submissions must include complete documentation and demo",
        "No plagiarism - violations lead to disqualification",
        "Teams must present their solution to judges",
        "All team members must be registered participants",
        "Late submissions will not be accepted",
        "Organizers' decisions are final"
      ],
      organizer: {
        name: "Dr. Michael Zhang",
        contactEmail: "hackathon@quantumlabs.io",
        contactNumber: "+1-555-0123-4567",
        organization: "Quantum Innovation Foundation"
      },
      socialLinks: {
        website: "https://quantumlabs.io",
        linkedin: "https://linkedin.com/company/quantum-labs",
        twitter: "https://twitter.com/quantumlabs",
        discord: "https://discord.gg/quantumhack"
      },
      faqs: [
        {
          question: "Do I need quantum computing experience?",
          answer: "No prior quantum experience required! We provide beginner-friendly workshops, tutorials, and mentorship throughout the event. Our experts will guide you through quantum basics."
        },
        {
          question: "Can I participate remotely?",
          answer: "Yes! This is a hybrid event with both online and offline participation options. Remote participants will have access to all workshops, mentorship, and judging sessions via our platform."
        },
        {
          question: "What if I don't have a team?",
          answer: "No worries! We have a team formation session before the hackathon starts. You can also join our Discord server to find teammates with complementary skills."
        },
        {
          question: "Are there any age restrictions?",
          answer: "Participants must be 18+ or have parental consent. Students, professionals, and researchers are all welcome to participate."
        },
        {
          question: "What hardware/software do I need?",
          answer: "A laptop with internet connection is sufficient. We provide cloud access to quantum simulators and all necessary software tools. No specialized hardware required."
        }
      ]
    };
    setTimeout(()=>{

        setHackathon(mockHackathon);
    },5000);
  }, []);

  useEffect(() => {
    if (!hackathon) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const deadline = new Date(hackathon.registrationDeadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [hackathon]);

  const getStatusConfig = (status: string) => {
    const config = {
      registration_open: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", icon: PlayCircle, label: "Registration Open" },
      registration_closed: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle, label: "Registration Closed" },
      ongoing: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: PlayCircle, label: "Ongoing" },
      winner_to_announced: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: Clock, label: "Winner to be Announced" },
      completed: { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", icon: CheckCircle, label: "Completed" },
      cancelled: { color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20", icon: XCircle, label: "Cancelled" }
    };
    return config[status as keyof typeof config] || config.registration_open;
  };

  const handleJoinClick = () => {
    if (hackathon?.registrationFee > 0) {
      setShowFeeModal(true);
    } else {
      setIsRegistered(true);
    }
  };

  const handlePayment = () => {
    setShowFeeModal(false);
    
    setPaymenetLoading(true);
    
    setTimeout(() =>  {
        
        setPaymenetLoading(false);
        setIsRegistered(true);
    },3000);

  };

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const newDiscussion: Discussion = {
      id: discussions.length + 1,
      user: "You",
      avatar: "YU",
      question: newQuestion,
      timestamp: "Just now",
      likes: 0,
      replies: 0
    };
    
    setDiscussions([newDiscussion, ...discussions]);
    setNewQuestion('');
  };

  if (!hackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className=" rounded-2xl p-8 text-center shadow-2xl shadow-blue-500/10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full mx-auto animate-spin animation-delay-150"></div>
          </div>
          <p className="text-slate-300 font-mono">Loading hackathon details...</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(hackathon.status);

  return (
    <div className="min-h-screen text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&display=swap');
        
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        
        .glass-effect {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .tab-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
          border-bottom: 2px solid #3b82f6;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent"></div>
        
        <div className="relative border-b border-blue-500/20">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 animate-slide-up">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8 flex-wrap">
                  <span className={`px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} border flex items-center gap-2 text-sm font-orbitron shadow-lg`}>
                    <statusConfig.icon size={16} className="animate-pulse" />
                    {statusConfig.label}
                  </span>
                  <span className="glass-effect px-4 py-2 rounded-full text-sm font-orbitron shadow-lg">
                    ID: #{hackathon.hackathonId}
                  </span>
                  <span className="glass-effect px-4 py-2 rounded-full text-sm font-orbitron shadow-lg capitalize">
                    {hackathon.mode}
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-bounce">
                  {hackathon.title}
                </h1>
                
                <p className="text-xl text-slate-300 mb-4 leading-relaxed">
                  {hackathon.description}
                </p>
                
                {hackathon.extraDetail && (
                  <p className="text-slate-400 mb-6 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
                    {hackathon.extraDetail}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mb-8">
                  {hackathon.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 glass-effect rounded-full text-sm font-orbitron hover-lift cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="glass-effect rounded-2xl p-6 min-w-[320px] shadow-2xl shadow-blue-500/20 animate-glow">
                <h3 className="font-orbitron text-lg mb-4 text-center text-blue-400">Registration Ends In</h3>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { value: countdown.days, label: 'DAYS', color: 'text-blue-400' },
                    { value: countdown.hours, label: 'HRS', color: 'text-purple-400' },
                    { value: countdown.minutes, label: 'MIN', color: 'text-pink-400' },
                    { value: countdown.seconds, label: 'SEC', color: 'text-green-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="glass-effect rounded-xl p-3 hover-lift">
                      <div className={`text-3xl font-orbitron font-bold ${item.color}`}>{item.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="glass-effect rounded-2xl overflow-hidden shadow-xl">
              <div className="flex border-b border-blue-500/20 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: Globe },
                  { id: 'rules', label: 'Rules & Criteria', icon: FileText },
                  { id: 'faq', label: 'FAQ', icon: AlertCircle },
                  { id: 'discussion', label: 'Discussion', icon: MessageSquare }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-6 py-4 font-orbitron flex items-center justify-center gap-2 transition-all ${
                      activeTab === tab.id ? 'tab-active text-blue-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-slide-up">
                    {/* Schedule */}
                    <section>
                      <h2 className="text-2xl font-orbitron mb-4 text-blue-400 flex items-center gap-2">
                        <Calendar className="animate-pulse" />
                        Event Timeline
                      </h2>
                      <div className="space-y-3">
                        {[
                          { icon: Calendar, label: 'Registration Deadline', date: hackathon.registrationDeadline, color: 'text-red-400' },
                          { icon: PlayCircle, label: 'Hackathon Starts', date: hackathon.startDate, color: 'text-green-400' },
                          { icon: XCircle, label: 'Hackathon Ends', date: hackathon.endDate, color: 'text-orange-400' },
                          hackathon.submissionDeadline && { icon: FileText, label: 'Submission Deadline', date: hackathon.submissionDeadline, color: 'text-purple-400' },
                          hackathon.winnerAnnouncementDate && { icon: Trophy, label: 'Winner Announcement', date: hackathon.winnerAnnouncementDate, color: 'text-yellow-400' }
                        ].filter(Boolean).map((item: any, index) => (
                          <div key={index} className="flex items-center justify-between glass-effect p-4 rounded-xl hover-lift">
                            <div className="flex items-center gap-3">
                              <item.icon className={item.color} size={20} />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <span className="font-orbitron text-slate-300">
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Submission Format */}
                    {hackathon.submissionFormat && (
                      <section className="glass-effect p-6 rounded-xl border-l-4 border-purple-500">
                        <h3 className="font-orbitron text-lg mb-3 text-purple-400 flex items-center gap-2">
                          <FileText size={20} />
                          Submission Format
                        </h3>
                        <p className="text-slate-300">{hackathon.submissionFormat}</p>
                      </section>
                    )}

                    {/* Prizes */}
                    <section>
                      <h2 className="text-2xl font-orbitron mb-4 text-yellow-400 flex items-center gap-2">
                        <Trophy className="animate-bounce" />
                        Prizes & Rewards
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {hackathon.prizes.map((prize, index) => (
                          <div key={index} className="glass-effect p-6 rounded-xl text-center border-2 border-transparent hover:border-blue-500/50 hover-lift">
                            <Trophy className={`w-12 h-12 mx-auto mb-4 ${
                              index === 0 ? 'text-yellow-400 animate-bounce' : 
                              index === 1 ? 'text-slate-400' : 'text-orange-400'
                            }`} />
                            <h3 className="font-orbitron text-xl mb-2">{prize.position} Place</h3>
                            <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">
                              ${prize.amount.toLocaleString()}
                            </div>
                            {prize.rewards && (
                              <p className="text-slate-400 text-sm mt-2">{prize.rewards}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Evaluation Criteria */}
                    {hackathon.evaluationCriteria && hackathon.evaluationCriteria.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-orbitron mb-4 text-pink-400 flex items-center gap-2">
                          <Target className="animate-pulse" />
                          Evaluation Criteria
                        </h2>
                        <div className="space-y-3">
                          {hackathon.evaluationCriteria.map((criteria, index) => (
                            <div key={index} className="glass-effect p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-orbitron">{criteria.criterion}</span>
                                <span className="text-blue-400 font-bold">{criteria.weight}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${criteria.weight}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {/* Rules Tab */}
                {activeTab === 'rules' && (
                  <div className="space-y-6 animate-slide-up">
                    <section>
                      <h2 className="text-2xl font-orbitron mb-4 text-red-400 flex items-center gap-2">
                        <AlertCircle className="animate-pulse" />
                        Hackathon Rules
                      </h2>
                      <div className="space-y-3">
                        {hackathon.rules.map((rule, index) => (
                          <div key={index} className="flex items-start gap-3 glass-effect p-4 rounded-xl hover-lift">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-blue-400 font-orbitron font-bold">{index + 1}</span>
                            </div>
                            <p className="text-slate-300 flex-1">{rule}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-4 animate-slide-up">
                    <h2 className="text-2xl font-orbitron mb-4 text-purple-400 flex items-center gap-2">
                      <AlertCircle className="animate-pulse" />
                      Frequently Asked Questions
                    </h2>
                    {hackathon.faqs.map((faq, index) => (
                      <div key={index} className="glass-effect rounded-xl overflow-hidden hover-lift">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-500/5 transition-all"
                        >
                          <span className="font-orbitron text-blue-400">{faq.question}</span>
                          {expandedFaq === index ? <ChevronUp className="text-blue-400" /> : <ChevronDown className="text-slate-400" />}
                        </button>
                        {expandedFaq === index && (
                          <div className="p-4 pt-0 text-slate-300 border-t border-blue-500/20 animate-slide-up">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Discussion Tab */}
                {activeTab === 'discussion' && (
                  <div className="space-y-6 animate-slide-up">
                    <h2 className="text-2xl font-orbitron mb-4 text-green-400 flex items-center gap-2">
                      <MessageSquare className="animate-pulse" />
                      Q&A Discussion
                    </h2>
                    
                    {/* Ask Question */}
                    <div className="glass-effect p-4 rounded-xl">
                      <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask a question about the hackathon..."
                        className="w-full bg-slate-900/50 border border-blue-500/20 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                        rows={3}
                      />
                      <button
                        onClick={handleAskQuestion}
                        className="mt-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-orbitron flex items-center gap-2 hover:scale-105 transition-all"
                      >
                        <Send size={16} />
                        Ask Question
                      </button>
                    </div>

                    {/* Discussion List */}
                    <div className="space-y-4">
                      {discussions.map((discussion) => (
                        <div key={discussion.id} className="glass-effect p-5 rounded-xl hover-lift">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-orbitron text-white text-sm flex-shrink-0">
                              {discussion.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-orbitron text-blue-400">{discussion.user}</span>
                                <span className="text-slate-500 text-sm">{discussion.timestamp}</span>
                              </div>
                              <p className="text-slate-300 mb-3">{discussion.question}</p>
                              {discussion.answer && (
                                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded-lg mb-3">
                                  <div className="text-sm text-blue-400 mb-1 font-orbitron">Answer:</div>
                                  <p className="text-slate-300">{discussion.answer}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                  <ThumbsUp size={14} />
                                  {discussion.likes}
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                  <MessageSquare size={14} />
                                  {discussion.replies} replies
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Problem Statements - Only shown during hackathon */}
            {hackathon.status === 'ongoing' && (
              <section className="glass-effect rounded-2xl p-6 shadow-xl animate-slide-up">
                <h2 className="text-2xl font-orbitron mb-6 text-blue-400 flex items-center gap-2">
                  <Target className="animate-pulse" />
                  Problem Statements
                </h2>
                <div className="grid gap-4">
                  {hackathon.problemStatements.map((statement, index) => (
                    <div key={index} className="glass-effect p-5 rounded-xl border-l-4 border-blue-500 hover-lift">
                      <h3 className="font-orbitron text-lg mb-2 text-purple-400">Challenge {index + 1}</h3>
                      <p className="text-slate-300">{statement}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="glass-effect rounded-2xl p-6 top-6 shadow-2xl shadow-blue-500/20">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="text-blue-400 animate-pulse" />
                  <span className="font-orbitron text-lg">
                    {hackathon.totalMembersJoined} / {hackathon.maxRegistrations || '∞'}
                  </span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${hackathon.maxRegistrations ? (hackathon.totalMembersJoined / hackathon.maxRegistrations * 100) : 50}%` }}
                  ></div>
                </div>
                
                {hackathon.registrationFee > 0 ? (
                  <div className="flex items-center justify-center gap-2 mb-6 text-2xl">
                    <DollarSign className="text-green-400" />
                    <span className="font-orbitron font-bold text-green-400">
                      {hackathon.registrationFee}
                    </span>
                  </div>
                ) : (
                  <div className="text-green-400 font-orbitron text-2xl mb-6 animate-pulse">FREE ENTRY</div>
                )}

<button
  onClick={handleJoinClick}
  disabled={isRegistered || hackathon.status !== 'registration_open' || isPaymentloading}
  className={`w-full py-4 px-6 rounded-xl font-orbitron text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2
    ${
      isRegistered
        ? 'bg-green-500/20 text-green-400 border-2 border-green-400/40 cursor-not-allowed'
        : hackathon.status === 'registration_open'
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 animate-glow'
        : 'bg-slate-700/50 text-slate-400 border-2 border-slate-600/40 cursor-not-allowed'
    }
  `}
>
  {isPaymentloading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
      </svg>
      <span>Processing...</span>
    </>
  ) : isRegistered ? (
    <span className="flex items-center gap-1">
      <span className="text-green-400 text-xl">✓</span> Registered
    </span>
  ) : hackathon.status === 'registration_open' ? (
    'Join Hackathon'
  ) : (
    'Registration Closed'
  )}
</button>

              </div>

              <div className="space-y-4 text-sm border-t border-blue-500/20 pt-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="text-blue-400" size={18} />
                  <span>{hackathon.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Users className="text-purple-400" size={18} />
                  <span>Team Size: {hackathon.minParticipantsToFormTeam}-{hackathon.maxTeamSize} members</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="text-pink-400" size={18} />
                  <span className="capitalize">{hackathon.mode} Event</span>
                </div>
              </div>
            </div>
            
            <div className='backdrop-blur-3'>

                                {/* Requirements */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl hover-lift">
              <h3 className="font-orbitron text-lg mb-4 text-blue-400 flex items-center gap-2">
                <CheckCircle className="animate-pulse" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {hackathon.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <span className="text-slate-300 text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organizer */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl hover-lift">
              <h3 className="font-orbitron text-lg mb-4 text-purple-400 flex items-center gap-2">
                <Building2 className="animate-pulse" />
                Organizer
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="text-yellow-400" size={16} />
                  <span className="font-orbitron text-sm">{hackathon.organizer.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="text-blue-400" size={16} />
                  <span className="text-sm">{hackathon.organizer.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="text-green-400" size={16} />
                  <a href={`mailto:${hackathon.organizer.contactEmail}`} className="text-sm hover:text-blue-400 transition-colors">
                    {hackathon.organizer.contactEmail}
                  </a>
                </div>
                {hackathon.organizer.contactNumber && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="text-purple-400" size={16} />
                    <span className="text-sm">{hackathon.organizer.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {hackathon.socialLinks && Object.values(hackathon.socialLinks).some(link => link) && (
              <div className="glass-effect rounded-2xl p-6 shadow-xl hover-lift">
                <h3 className="font-orbitron text-lg mb-4 text-pink-400 flex items-center gap-2">
                  <Globe className="animate-pulse" />
                  Connect With Us
                </h3>
                <div className="space-y-3">
                  {hackathon.socialLinks.website && (
                    <a href={hackathon.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <ExternalLink size={16} className="text-blue-400" />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                  {hackathon.socialLinks.linkedin && (
                    <a href={hackathon.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <Linkedin size={16} className="text-blue-600" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {hackathon.socialLinks.twitter && (
                    <a href={hackathon.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <Twitter size={16} className="text-blue-400" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {hackathon.socialLinks.discord && (
                    <a href={hackathon.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <MessageSquare size={16} className="text-indigo-400" />
                      <span className="text-sm">Discord Community</span>
                    </a>
                  )}
                </div>
              </div>
            )}



            </div>

          </div>
        </div>
      </div>

      {/* Fee Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-slide-up">
          <div className="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-blue-500/30 border-2 border-blue-500/30">
            <h3 className="font-orbitron text-2xl mb-4 text-blue-400">Registration Fee</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              This hackathon requires a registration fee of{' '}
              <span className="font-orbitron text-2xl text-green-400 font-bold">${hackathon.registrationFee}</span>.
              This fee helps cover event costs, infrastructure, mentorship, and prize pool.
            </p>
            <div className="glass-effect p-4 rounded-xl mb-6 border-l-4 border-blue-500">
              <p className="text-sm text-slate-400">
                All payments are secure and processed through encrypted channels. You'll receive a confirmation email after successful registration.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFeeModal(false)}
                className="flex-1 py-3 px-4 glass-effect rounded-xl font-orbitron hover:bg-slate-700/50 transition-all border border-slate-600/50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-orbitron hover:scale-105 transition-all shadow-lg shadow-blue-500/50"
              >
                Pay ${hackathon.registrationFee}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberHackathonDetail;