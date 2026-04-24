import React from 'react';
import { motion } from 'motion/react';

interface QuizProgressProps {
  current: number;
  total: number;
  color?: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ current, total, color = "bg-purple-500" }) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full px-6 mb-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress Kuis</span>
        <span className="text-sm font-black text-slate-600 dark:text-slate-300">{current}/{total}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
        <motion.div 
          animate={{ width: `${progress}%` }}
          className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
        />
      </div>
    </div>
  );
};
