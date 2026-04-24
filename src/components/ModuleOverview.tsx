import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Lock, BookOpen, Star, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

interface ModuleOverviewProps {
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  totalPages: number;
  completedPages: number[];
  bestScore: number | null;
  onBack: () => void;
  onEnterLearn: () => void;
  onEnterQuiz: () => void;
  hasQuiz?: boolean;
}

import { BottomNav } from '../components/BottomNav';

export const ModuleOverview: React.FC<ModuleOverviewProps> = ({
  title,
  description,
  color,
  icon,
  totalPages,
  completedPages,
  bestScore,
  onBack,
  onEnterLearn,
  onEnterQuiz,
  hasQuiz = true
}) => {
  const isQuizUnlocked = completedPages.length >= totalPages;
  const progressPercent = Math.round((completedPages.length / totalPages) * 100) || 0;

  return (
    <div className="w-full min-h-[100dvh] flex flex-col md:items-center md:justify-center bg-[#f8f9fe] dark:bg-slate-950 overflow-hidden relative">
      <div className="w-full md:max-w-md h-[100dvh] md:h-auto md:min-h-[700px] bg-white dark:bg-slate-900 md:rounded-[40px] md:shadow-2xl flex flex-col md:relative fixed inset-0">
        
        {/* Header */}
        <div className="px-6 pt-10 pb-4 flex items-center justify-between shrink-0">
          <button onClick={onBack} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
          </button>
          <div className="flex-1"></div>
        </div>

        <div className="flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pb-[120px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-4"
          >
            <div className={`w-32 h-32 rounded-full ${color} shadow-lg flex items-center justify-center mb-6`}>
              {icon}
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2 text-center">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-center mb-8">{description}</p>
          </motion.div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[24px] border-2 border-slate-100 dark:border-slate-800 mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress Modul</span>
              <span className="text-sm font-black text-slate-600 dark:text-slate-300">{completedPages.length}/{totalPages}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full ${color.replace('bg-', 'bg-').split(' ')[0]}`} // Assuming primary background class is passed 
              />
            </div>
            
            {hasQuiz && bestScore !== null && (
              <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-700 mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Skor Kuis Tertinggi:</span>
                <span className="text-lg font-black text-yellow-500 flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-500" /> {bestScore}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button size="xl" variant="default" onClick={onEnterLearn} className={`h-16 text-lg gap-3 shadow-lg ${color}`}>
              <BookOpen className="w-6 h-6" /> {completedPages.length > 0 && completedPages.length < totalPages ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
            </Button>

            {hasQuiz && (
              <Button 
                size="xl" 
                variant={isQuizUnlocked ? 'outline' : 'ghost'} 
                disabled={!isQuizUnlocked}
                onClick={onEnterQuiz} 
                className={`h-16 text-lg gap-3 border-2 ${isQuizUnlocked ? 'hover:bg-slate-50 bg-white border-slate-200' : 'opacity-60 bg-slate-100 border-transparent text-slate-400'}`}
              >
                {!isQuizUnlocked ? <Lock className="w-6 h-6" /> : (bestScore !== null ? <RefreshCcw className="w-6 h-6" /> : <Play className="w-6 h-6" />)}
                {isQuizUnlocked && bestScore !== null ? 'Main Kuis Lagi' : 'Mulai Kuis'}
              </Button>
            )}
            
            {hasQuiz && !isQuizUnlocked && (
              <p className="text-center text-xs font-bold text-slate-400 mt-2">Selesaikan semua halaman belajar untuk membuka kuis.</p>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};
