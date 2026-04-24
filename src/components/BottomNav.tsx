import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as IconHome, Clock, Trophy, User, Plus } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="absolute bottom-0 w-full left-0 right-0 z-50">
      {/* Main Bar */}
      <div className="bg-white dark:bg-slate-800 h-20 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-5px_30px_rgba(0,0,0,0.5)] flex justify-between px-6 pt-2 pb-6 relative transition-colors">
        
        {/* Left Items */}
        <div className="flex gap-6 w-[35%] justify-between">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 group w-12 pt-2">
            <IconHome className={`w-[22px] h-[22px] transition-colors ${isActive('/home') ? 'text-[#8b5cf6] fill-[#8b5cf6]' : 'text-slate-300 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-300'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-extrabold transition-colors ${isActive('/home') ? 'text-[#8b5cf6]' : 'text-slate-400 dark:text-slate-500'}`}>Home</span>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 group w-12 pt-2">
            <Clock className={`w-[22px] h-[22px] transition-colors ${isActive('/history') ? 'text-[#8b5cf6]' : 'text-slate-300 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-300'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-bold transition-colors ${isActive('/history') ? 'text-[#8b5cf6]' : 'text-slate-400 dark:text-slate-500'}`}>History</span>
          </button>
        </div>

        {/* Center + Button */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2">
          <button onClick={() => navigate('/quiz')} className="w-16 h-16 bg-gradient-to-tr from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center text-white shadow-float hover:scale-105 active:scale-95 transition-transform border-[6px] border-[#f8f9fe] dark:border-slate-900">
            <Plus className="w-8 h-8" strokeWidth={3} />
          </button>
        </div>

        {/* Right Items */}
        <div className="flex gap-6 w-[35%] justify-between">
          <button onClick={() => navigate('/leaderboard')} className="flex flex-col items-center gap-1 group w-14 pt-2">
            <Trophy className={`w-[22px] h-[22px] transition-colors ${isActive('/leaderboard') ? 'text-[#8b5cf6]' : 'text-slate-300 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-300'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-bold leading-tight transition-colors ${isActive('/leaderboard') ? 'text-[#8b5cf6]' : 'text-slate-400 dark:text-slate-500'}`}>Leader Board</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 group w-12 pt-2">
            <User className={`w-[22px] h-[22px] transition-colors ${isActive('/profile') ? 'text-[#8b5cf6]' : 'text-slate-300 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-300'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-bold transition-colors ${isActive('/profile') ? 'text-[#8b5cf6]' : 'text-slate-400 dark:text-slate-500'}`}>Profile</span>
          </button>
        </div>
        
      </div>
    </div>
  );
};
