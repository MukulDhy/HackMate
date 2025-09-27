import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TeamChatHeaderProps {
  hackathonTitle: string;
  timeLeft: string; // ISO string like "2025-09-27T16:44:00.000Z"
  onRefresh: () => void;
}

export const TeamChatHeader = ({ hackathonTitle, timeLeft, onRefresh }: TeamChatHeaderProps) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeLeft(timeLeft));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeLeft(timeLeft));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function calculateTimeLeft(deadline: string) {
    const difference = new Date(deadline).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      expired: false
    };
  }

  const formatTimeLeft = () => {
    if (timeRemaining.expired) {
      return "00:00:00";
    }
    
    // If there are days remaining, show days + hours
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours.toString().padStart(2, '0')}h`;
    }
    
    // Otherwise show hours:minutes:seconds
    return `${timeRemaining.hours.toString().padStart(2, '0')}:${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4"
    >
      <div>
        <h1 className="font-orbitron font-bold text-2xl xs:text-3xl lg:text-4xl text-foreground">
          {hackathonTitle}
        </h1>
        <p className="text-sm xs:text-base lg:text-lg text-muted-foreground">
          Team Collaboration Hub
        </p>
      </div>
      <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 xs:px-6 py-3 xs:py-4 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 xs:w-5 h-4 xs:h-5 text-primary" />
          <span className="text-muted-foreground text-xs xs:text-sm">Time Remaining</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="font-mono text-xl xs:text-2xl font-bold text-foreground">
            {formatTimeLeft()}
          </div>
          {/* <button 
            onClick={onRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-150"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button> */}
        </div>
      </div>
    </motion.div>
  );
};