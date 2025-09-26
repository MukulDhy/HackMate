import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Hackathon } from '@/types/hackathon';

interface HackathonDetailsProps {
  hackathonData: Hackathon;
  formatDate: (dateString: string) => string;
}

export const HackathonDetails = ({ hackathonData, formatDate }: HackathonDetailsProps) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
    <GlassCard className="p-4 xs:p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Target className="w-5 xs:w-6 h-5 xs:h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-orbitron font-bold text-xl xs:text-2xl text-foreground mb-2">
            {hackathonData.title}
          </h2>
          <p className="text-muted-foreground text-sm xs:text-base">
            {hackathonData.description}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Starts:</span>
          <span className="text-foreground">{formatDate(hackathonData.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Ends:</span>
          <span className="text-foreground">{formatDate(hackathonData.endDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Venue:</span>
          <span className="text-foreground">{hackathonData.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Fee:</span>
          <span className="text-foreground">${hackathonData.registrationFee}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-6">
        {hackathonData.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </GlassCard>
  </motion.div>
);