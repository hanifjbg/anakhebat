import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Camera, Gem, Target, Play, Award, Star, Medal, Crown } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center justify-between mb-2">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="text-lg font-extrabold text-slate-800 dark:text-white">Profile</h1>
           <button className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
             <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mt-6 mb-6">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#c084fc] to-[#8b5cf6] p-1 shadow-soft">
                <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-200">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Maktum&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <button className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-8 h-8 bg-gradient-to-br from-[#c084fc] to-[#a855f7] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 text-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-800 dark:text-white mt-4 mb-1">Maktum Talukdar</h2>
            <div className="flex items-center gap-4 text-[#ef4444] font-black text-sm mb-4">
              <span>LVL:</span>
              <span className="text-xl">500</span>
            </div>

            {/* XP Bar */}
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="bg-[#fb923c] text-white px-2 py-0.5 rounded-md">Next LVL</span>
                <span className="text-slate-400">6,049xp / 12,980xp</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#fb923c] to-[#ef4444] w-[45%] rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-white shadow-soft">
              <Target className="w-5 h-5 mb-2 opacity-80" strokeWidth={2.5}/>
              <span className="text-[10px] font-semibold opacity-90">Rank</span>
              <span className="text-sm font-black">428</span>
            </div>

            <div className="bg-gradient-to-b from-[#fcd34d] to-[#fb923c] rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-white shadow-soft">
              <Gem className="w-5 h-5 mb-2 opacity-80" strokeWidth={2.5}/>
              <span className="text-[10px] font-semibold opacity-90">Points</span>
              <span className="text-sm font-black">12000</span>
            </div>

            <div className="bg-gradient-to-b from-[#34d399] to-[#10b981] rounded-[1.5rem] p-4 flex flex-col items-center justify-center text-white shadow-soft text-center">
              <Play className="w-5 h-5 mb-2 opacity-80" strokeWidth={2.5}/>
              <span className="text-[10px] font-semibold opacity-90 leading-tight">Created Quiz</span>
              <span className="text-sm font-black mt-1">20</span>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-4">My Badges</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                 { color: 'from-[#fcd34d] to-[#fb923c]', icon: Medal },
                 { color: 'from-[#4ade80] to-[#10b981]', icon: Award },
                 { color: 'from-[#60a5fa] to-[#3b82f6]', icon: Gem },
                 { color: 'from-[#c084fc] to-[#a855f7]', icon: Crown },
                 { color: 'from-[#34d399] to-[#059669]', icon: Star },
                 { color: 'from-[#f472b6] to-[#ec4899]', icon: Target },
                 { color: 'from-[#fbbf24] to-[#d97706]', icon: HeartPulseIcon }, // mock
              ].map((badge, i) => (
                <div key={i} className={`aspect-square rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-sm`}>
                  <badge.icon className="w-6 h-6 text-white opacity-90" strokeWidth={2} />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Temp Icon since HeartPulse might not be available
const HeartPulseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
)
