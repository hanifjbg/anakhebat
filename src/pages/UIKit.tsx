import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Info, XCircle, Search, Mail, Lock } from 'lucide-react';

export const UIKit = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center mb-6 shrink-0">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-[19px] font-extrabold text-slate-800 dark:text-white mr-10">UI Kit</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-12 no-scrollbar">
           
           {/* Section 1: Typography */}
           <section>
             <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">1. Typography</h2>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm space-y-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white">Heading 1</h1>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">30px / Black</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Heading 2</h2>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">24px / ExtraBold</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Heading 3</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">18px / Bold</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Body regular text goes here. It is used for descriptions and general content.</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">14px / SemiBold</span>
                </div>
             </div>
           </section>

           {/* Section 2: Buttons */}
           <section>
             <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">2. Buttons & Actions</h2>
             <div className="space-y-4">
                <button className="w-full h-14 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white rounded-full font-extrabold text-[15px] shadow-float hover:scale-[1.02] active:scale-95 transition-all">
                  Primary Button
                </button>
                <button className="w-full h-14 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full font-extrabold text-[15px] shadow-sm hover:scale-[1.02] active:scale-95 transition-all outline outline-2 outline-slate-200 dark:outline-slate-700">
                  Secondary Outline
                </button>
                <button className="w-full h-14 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full font-extrabold text-[15px] hover:scale-[1.02] active:scale-95 transition-all">
                  Danger / Warning
                </button>
                <button className="w-full h-14 bg-transparent text-slate-500 dark:text-slate-400 rounded-full font-bold text-[15px] hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all">
                  Ghost Button
                </button>
             </div>
           </section>

           {/* Section 3: Forms & Inputs */}
           <section>
             <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">3. Forms & Inputs</h2>
             <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" placeholder="Email Address" className="w-full h-14 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:border-[#8b5cf6] dark:focus:border-[#8b5cf6] focus:outline-none transition-colors shadow-sm" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" placeholder="Password" className="w-full h-14 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:border-[#8b5cf6] dark:focus:border-[#8b5cf6] focus:outline-none transition-colors shadow-sm" />
                </div>
                <div>
                  <textarea placeholder="Write a message..." rows={4} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:border-[#8b5cf6] dark:focus:border-[#8b5cf6] focus:outline-none transition-colors shadow-sm resize-none"></textarea>
                </div>
             </div>
           </section>

           {/* Section 4: Cards */}
           <section>
             <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">4. Cards & Containers</h2>
             <div className="space-y-4">
                {/* Standard Card */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] shadow-soft">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Standard Card</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-2 leading-relaxed">Perfect for simple data display, settings options, or list items.</p>
                </div>

                {/* Highlight/Gradient Card */}
                <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] p-6 rounded-[2rem] text-white shadow-soft relative overflow-hidden">
                  <div className="relative z-10 w-2/3">
                    <h3 className="font-extrabold text-lg mb-1 drop-shadow-sm">Premium Feature</h3>
                    <p className="text-xs font-semibold opacity-90 mb-4 drop-shadow-sm">Unlock amazing abilities and powerups.</p>
                    <button className="bg-white text-blue-600 text-[11px] font-black px-4 py-2 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all">Upgrade</button>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                </div>
             </div>
           </section>

           {/* Section 5: Feedback / Alerts */}
           <section>
             <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">5. Feedback & Alerts</h2>
             <div className="space-y-3">
                {/* Success */}
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800/50 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800 dark:text-green-400 text-sm">Action Successful</h4>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-500">Your profile has been updated.</p>
                  </div>
                </div>

                {/* Danger/Error */}
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5 text-red-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 dark:text-red-400 text-sm">Connection Error</h4>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-500">Could not connect to the server.</p>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800/50 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm">System Update</h4>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-500">New features are available.</p>
                  </div>
                </div>
             </div>
           </section>

           {/* Empty padding for bottom nav */}
           <div className="h-6"></div>
        </div>

      </div>
    </div>
  );
};
