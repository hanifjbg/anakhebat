import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, PlayCircle, Star, Sparkles, BookA, BookOpen, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { BottomNav } from '../components/BottomNav';

export const Home = () => {
  const navigate = useNavigate();
  const { state, logout } = useApp();
  const userName = state.user?.name || "Teman";
  const userAvatar = state.user?.avatar || "https://api.dicebear.com/7.x/identicon/svg?seed=budi";

  const totalScore = Object.values(state.progress).reduce((acc, curr: any) => acc + (curr?.bestScore || 0), 0);

  const modules = [
    {
      id: 'alphabet',
      title: 'Mengenal Huruf',
      description: 'A sampai Z dengan cara yang menyenangkan',
      icon: <BookA className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />,
      gradient: 'from-[#8b5cf6] to-[#a855f7]',
      shadow: 'shadow-[0_8px_30px_rgba(139,92,246,0.3)]',
      path: '/alphabet',
      totalEstimatedPages: 6
    },
    {
      id: 'vowel',
      title: 'Huruf Vokal',
      description: 'Belajar menggabungkan konsonan dan vokal',
      icon: <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />,
      gradient: 'from-[#eab308] to-[#f59e0b]',
      shadow: 'shadow-[0_8px_30px_rgba(245,158,11,0.3)]',
      path: '/vokalm',
      totalEstimatedPages: 8
    },
    {
      id: 'sentence',
      title: 'Merakit Kalimat',
      description: 'Menyusun suku kata menjadi kalimat',
      icon: <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />,
      gradient: 'from-[#10b981] to-[#34d399]',
      shadow: 'shadow-[0_8px_30px_rgba(16,185,129,0.3)]',
      path: '/sentence',
      totalEstimatedPages: 15
    }
  ];

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-slate-200 md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-6 md:pt-10 transition-colors">
        
        {/* Decorative Blob */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar z-10">
          
          {/* Header Profile */}
          <div className="flex justify-between items-center mb-8 pt-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-[20px] bg-white dark:bg-slate-800 p-1 shadow-lg border-2 border-slate-100 dark:border-slate-700 overflow-hidden">
                  <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-950 shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-900" /> {totalScore}
                </div>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide">Selamat datang,</p>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white capitalize leading-tight">{userName}!</h1>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={logout}
                className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-2 border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500"
              >
                <LogOut strokeWidth={2.5} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2 mb-4">Pelajaran Hari Ini</h2>
          
          <div className="flex flex-col gap-5 pb-12">
            {modules.map((module, index) => {
              const progress = state.progress[module.id];
              const completedCount = progress?.completedPages?.length || 0;
              const percent = Math.min(100, Math.round((completedCount / module.totalEstimatedPages) * 100));
              
              return (
                <motion.button
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(module.path)}
                  className="group relative w-full bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm hover:shadow-xl transition-all duration-300 text-left border-2 border-slate-100 dark:border-slate-800 overflow-hidden flex items-center gap-4 md:gap-5 cursor-pointer hover:-translate-y-1"
                >
                  {/* Glowing background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:to-slate-800/50" />

                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[24px] bg-gradient-to-br ${module.gradient} ${module.shadow} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 z-10`}>
                    {module.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2 z-10">
                    <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white mb-1 md:mb-1.5 line-clamp-1">{module.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold leading-snug line-clamp-2">{module.description}</p>
                    
                    {completedCount > 0 && (
                       <div className="mt-3 flex items-center gap-2">
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full bg-gradient-to-r ${module.gradient}`} style={{ width: `${percent}%` }} />
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border-2 border-slate-100 dark:border-slate-700 group-hover:border-purple-200 dark:group-hover:border-purple-900 transition-colors z-10">
                    <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-purple-500" />
                  </div>
                </motion.button>
              )
            })}
          </div>

        </div>
        <BottomNav />
      </div>
    </div>
  );
};

