import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PenTool, Home, User, Clock, Trophy, Target, LayoutTemplate, X } from 'lucide-react';

export const QCNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/history', label: 'History', icon: Clock },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/achievements', label: 'Achievements', icon: Target },
    { path: '/alphabet', label: 'Mengenal Abjad', icon: LayoutTemplate },
    { path: '/vokalm', label: 'Huruf Vokal', icon: LayoutTemplate },
    { path: '/sentence', label: 'Membaca Kalimat', icon: LayoutTemplate },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/quiz', label: 'Quiz Session', icon: Target },
    { path: '/uikit', label: 'UI Kit Showcase', icon: LayoutTemplate },
  ];

  if (location.pathname === '/' || location.pathname === '') return null;

  return (
    <div className="fixed bottom-24 right-4 md:right-[calc(50%-180px)] z-[100] flex flex-col items-end gap-2 transition-all">
       {isOpen && (
         <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-700 p-2 flex flex-col gap-1 w-52 mb-2 origin-bottom-right transition-all">
            <div className="text-[10px] font-black text-slate-400 px-3 py-2 uppercase tracking-widest mb-1">QC Navigation</div>
            {links.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button 
                  key={link.path}
                  onClick={() => { navigate(link.path); setIsOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all ${
                    isActive 
                      ? 'bg-[#8050f2] text-white shadow-soft' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                   <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                   {link.label}
                </button>
              )
            })}
         </div>
       )}
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-14 h-14 bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] rounded-full flex items-center justify-center shadow-float hover:scale-110 active:scale-95 transition-transform outline-none border-[4px] border-[#f8f9fe] dark:border-slate-900"
       >
         {isOpen ? <X className="w-6 h-6" strokeWidth={2.5} /> : <PenTool className="w-6 h-6" strokeWidth={2.5} />}
       </button>
    </div>
  );
}
