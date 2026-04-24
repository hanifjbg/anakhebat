import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Gem, Clock, ChevronDown } from 'lucide-react';

export const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Completed');

  const historyItems = [
    { id: 1, title: 'Beginner Math quiz', author: 'Mahmud Saimon', points: 500, time: '5min', color: 'from-[#60a5fa] to-[#3b82f6]', image: '📐' },
    { id: 2, title: 'Sports notifications', author: 'Mahmud Saimon', points: 500, time: '5min', color: 'from-[#34d399] to-[#10b981]', image: '🏃' },
    { id: 3, title: 'Central History', author: 'Mahmud Saimon', points: 500, time: '5min', color: 'from-[#fcd34d] to-[#fb923c]', image: '🏛️' },
    { id: 4, title: 'Music Classics', author: 'Mahmud Saimon', points: 500, time: '5min', color: 'from-[#c084fc] to-[#a855f7]', image: '🎵' },
    { id: 5, title: 'Drama\'s of Century', author: 'Mahmud Saimon', points: 500, time: '5min', color: 'from-[#f472b6] to-[#ec4899]', image: '🎭' },
  ];

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center mb-6 shrink-0">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-lg font-extrabold text-slate-800 dark:text-white mr-10">History</h1>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-full p-1.5 flex shadow-sm">
            {['Ongoing', 'Completed', 'Created'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-soft scale-100' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 scale-95'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="px-6 flex justify-center mb-6 shrink-0">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-600 dark:text-slate-300">
            This week <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 no-scrollbar">
          {historyItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded-[1.5rem] flex items-center gap-4 shadow-sm hover:shadow-soft transition-shadow cursor-pointer">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shrink-0 shadow-sm`}>
                {item.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{item.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 mb-1">by {item.author}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#b794f6]">
                    <Gem className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold">{item.points}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{item.time}</span>
                  </div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fcd34d] to-[#fb923c] text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform shrink-0">
                <Play className="w-4 h-4 fill-white" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
