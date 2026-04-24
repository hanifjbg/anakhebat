import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuizSummaryProps {
  score: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({ score, total, onRestart, onHome }) => {
  const percentage = (score / total) * 100;
  let message = "Hebat! Kamu pintar sekali! 🌟";
  let stars = 3;

  if (percentage < 50) {
    message = "Ayo semangat belajar lagi ya! 💪";
    stars = 1;
  } else if (percentage < 80) {
    message = "Bagus sekali prestasimu! 👍";
    stars = 2;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-xl border-4 border-purple-100 dark:border-slate-700 w-full max-w-sm mx-auto"
    >
      <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-200">
        <Trophy className="w-12 h-12 text-white" />
      </div>

      <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Hore! Selesai</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-center font-bold">{message}</p>

      <div className="flex gap-2 mb-8">
        {[...Array(3)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-10 h-10 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} 
          />
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl w-full mb-8 border-2 border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-500">Skor Kamu</span>
          <span className="text-3xl font-black text-purple-600">{(score/total * 100).toFixed(0)}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-purple-500"
          />
        </div>
        <p className="text-center mt-3 text-sm font-bold text-slate-400">{score} dari {total} soal benar</p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button onClick={onRestart} size="xl" variant="gradient-purple" className="gap-2">
          <RotateCcw className="w-5 h-5" /> Main Lagi
        </Button>
        <Button onClick={onHome} size="xl" variant="outline" className="gap-2 border-2 border-slate-200">
          <Home className="w-5 h-5" /> Kembali Ke Menu
        </Button>
      </div>
    </motion.div>
  );
};
