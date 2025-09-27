

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Upload, Calendar, FileText } from 'lucide-react';

interface ProjectSubmissionProps {
  submissionDeadline: string;
  submissionFormat: string;
  formatDate: (dateString: string) => string;
}

export const ProjectSubmission = ({ 
  submissionDeadline, 
  submissionFormat, 
  formatDate 
}: ProjectSubmissionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="p-4 xs:p-5 sm:p-6">
        <h3 className="font-orbitron font-bold text-lg text-foreground mb-3 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Project Submission
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Submit your final project before the deadline. Make sure to include all required components.
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Deadline:</span>
            <span className="text-foreground">{formatDate(submissionDeadline)}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <span className="text-muted-foreground">Format:</span>
              <p className="text-foreground text-xs mt-1">{submissionFormat}</p>
            </div>
          </div>
        </div>
        
        <Button variant="hero" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Submit Project
        </Button>
      </GlassCard>
    </motion.div>
  );
};