import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Flame } from 'lucide-react';

export const Leaderboard = () => {
  const navigate = useNavigate();

  const leaders = [
    { rank: 1, name: 'Annette Black', points: 12450, avatar: 'Ane', isMe: false },
    { rank: 2, name: 'Jacob Jones', points: 11200, avatar: 'Jac', isMe: false },
    { rank: 3, name: 'Maktum Talukdar', points: 12000, avatar: 'Mak', isMe: true }, // Not actually sorted for design purposes
    { rank: 4, name: 'Esther Howard', points: 9800, avatar: 'Est', isMe: false },
    { rank: 5, name: 'Guy Hawkins', points: 9200, avatar: 'Guy', isMe: false },
    { rank: 6, name: 'Savannah Nguyen', points: 8900, avatar: 'Sav', isMe: false },
  ];

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-gradient-to-b from-[#8b5cf6] to-[#a855f7] md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center mb-6 shrink-0 text-white">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
             <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-lg font-extrabold mr-10">Leaderboard</h1>
        </div>

        {/* Top 3 Graphic */}
        <div className="flex justify-center items-end px-6 h-40 shrink-0 gap-3 pb-8">
          
          {/* Rank 2 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full border-4 border-[#8b5cf6] relative shadow-soft mb-2 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Jacob&backgroundColor=e2e8f0`} alt="Rank 2" />
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white text-slate-700">2</div>
            </div>
            <div className="text-white font-bold text-[10px]">Jacob</div>
            <div className="text-white/80 font-semibold text-[9px]">11.2k</div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center -translate-y-4">
            <Trophy className="w-6 h-6 text-[#fcd34d] fill-[#fcd34d] mb-1 drop-shadow-sm" />
            <div className="w-16 h-16 bg-white rounded-full border-4 border-[#fcd34d] relative shadow-soft mb-2 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Annette&backgroundColor=e2e8f0`} alt="Rank 1" />
               <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#fcd34d] rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white text-orange-700">1</div>
            </div>
            <div className="text-white font-extrabold text-xs">Annette</div>
            <div className="text-white/80 font-bold text-[10px]">12.4k</div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full border-4 border-[#8b5cf6] relative shadow-soft mb-2 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Maktum&backgroundColor=e2e8f0`} alt="Rank 3" />
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#fb923c] rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white text-white">3</div>
            </div>
            <div className="text-white font-bold text-[10px]">Maktum</div>
            <div className="text-white/80 font-semibold text-[9px]">12.0k</div>
          </div>

        </div>

        {/* List */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col pt-6">
           {/* Tabs */}
           <div className="flex justify-center mb-4 px-6 shrink-0">
             <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex w-full">
                <button className="flex-1 py-2 text-xs font-bold bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-full shadow-sm">All Time</button>
                <button className="flex-1 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">This Week</button>
                <button className="flex-1 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">Month</button>
             </div>
           </div>

           <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 no-scrollbar text-slate-800 dark:text-white">
              {leaders.slice(3).map((leader) => (
                <div key={leader.rank} className={`flex items-center gap-4 p-3 rounded-2xl ${leader.isMe ? 'bg-[#f4effd] dark:bg-[#8b5cf6]/20 border border-[#c084fc]' : ''}`}>
                  <span className="font-extrabold w-4 text-center">{leader.rank}</span>
                  <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${leader.name}&backgroundColor=e2e8f0`} alt={leader.name} />
                  </div>
                  <span className="font-bold flex-1 text-sm">{leader.name}</span>
                  <div className="font-black text-sm flex items-center gap-1">
                    {leader.points} <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
