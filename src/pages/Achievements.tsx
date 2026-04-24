import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Medal, Crown, Gem } from 'lucide-react';

export const Achievements = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Stats');

  const achievements = [
    { title: '5 in a Row Streak', desc: 'Give 5 Correct Answers in a row', progress: 10, target: 100, reward: 25, color: 'from-[#fcd34d] to-[#fb923c]', icon: Medal },
    { title: 'Master of the Heart', desc: 'Give 5 Correct Answers in a row', claimable: true, reward: 50, color: 'from-[#4ade80] to-[#10b981]', icon: Crown },
    { title: '5 in a Row Streak', desc: 'Give 5 Correct Answers in a row', progress: 10, target: 100, reward: 25, color: 'from-[#60a5fa] to-[#3b82f6]', icon: Gem },
  ];

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center mb-6 shrink-0">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-lg font-extrabold text-slate-800 dark:text-white mr-10">Achievements</h1>
        </div>

        {/* Tabs - Centered style like the screenshot */}
        <div className="px-6 mb-6 flex justify-center shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-full flex shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveTab('Stats')}
              className={`px-8 py-3 text-sm font-bold transition-all ${
                activeTab === 'Stats' 
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-soft rounded-full' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('All Badges')}
              className={`px-8 py-3 text-sm font-bold transition-all ${
                activeTab === 'All Badges' 
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-soft rounded-full' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              All Badges
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-y-auto no-scrollbar space-y-4">
          {achievements.map((item, i) => (
            <div key={i} className="flex gap-4 items-center bg-[#f8f9fe] dark:bg-slate-700/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm shrink-0`}>
                <item.icon className="w-6 h-6 text-white" strokeWidth={2.5}/>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{item.title}</h3>
                <p className="text-[10px] font-semibold text-slate-400 mb-2 leading-tight">{item.desc}</p>
                
                {item.claimable ? (
                  <button className="bg-gradient-to-r from-[#fb923c] to-[#ef4444] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-1">
                    Claim
                    <div className="flex items-center gap-0.5 ml-1 bg-white/20 px-1.5 py-0.5 rounded-full">
                      <Gem className="w-2.5 h-2.5 fill-current" />
                      <span>{item.reward}</span>
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7]" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-800 dark:text-white">{item.progress}%</span>
                    <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      <Gem className="w-2.5 h-2.5 fill-[#b794f6] text-[#b794f6]" />
                      <span>{item.reward}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
