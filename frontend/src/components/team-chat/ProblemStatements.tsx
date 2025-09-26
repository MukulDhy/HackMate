import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Target } from 'lucide-react';

interface ProblemStatementsProps {
  problemStatements: string[];
}

export const ProblemStatements = ({ problemStatements }: ProblemStatementsProps) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
    <GlassCard className="p-4 xs:p-5 sm:p-6">
      <h3 className="font-orbitron font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Problem Statements
      </h3>
      <div className="prose prose-sm max-w-none">
        <ul className="space-y-2">
          {problemStatements.map((statement, index) => (
            <li key={index} className="text-foreground">
              {statement}
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  </motion.div>
);