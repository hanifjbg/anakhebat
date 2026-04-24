import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';

export const QuizSession = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = "Which of the following is commonly used as a CSS preprocessor?";
  const options = [
    { id: 1, text: "HTML" },
    { id: 2, text: "SASS" }, // Correct answer in reality, but we'll just mock interaction
    { id: 3, text: "React" },
    { id: 4, text: "Node.js" },
  ];

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col transition-colors">
        
        {/* Progress Bar Header */}
        <div className="px-6 pt-10 pb-4 shrink-0 flex items-center gap-4 bg-white dark:bg-slate-800 shadow-sm relative z-10">
           <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
             <X className="w-5 h-5" strokeWidth={2.5} />
           </button>
           
           <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-[#4ade80] rounded-full w-[40%] transition-all duration-500"></div>
           </div>
           
           <div className="flex items-center gap-1 font-black text-slate-800 dark:text-white">
             <span className="text-[#8b5cf6]">4</span>
             <span className="text-slate-300">/</span>
             <span className="text-slate-400">10</span>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col no-scrollbar">
           
           {/* Question */}
           <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm mb-6 relative">
              <div className="absolute -top-4 -left-2 text-6xl opacity-10 font-black text-[#8b5cf6]">Q.</div>
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-white relative z-10 leading-relaxed text-center">
                {question}
              </h2>
           </div>

           {/* Options */}
           <div className="space-y-3 flex-1">
             {options.map((option) => {
               const isSelected = selectedAnswer === option.id;
               return (
                 <button 
                   key={option.id}
                   onClick={() => setSelectedAnswer(option.id)}
                   className={`w-full p-4 rounded-2xl flex items-center gap-4 border-2 transition-all duration-200 active:scale-95 ${
                     isSelected 
                       ? 'bg-[#f4effd] dark:bg-[#8b5cf6]/20 border-[#a855f7] shadow-[0_4px_15px_-3px_rgba(168,85,247,0.3)]' 
                       : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#eaddfb] shadow-sm'
                   }`}
                 >
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                     isSelected 
                      ? 'bg-[#a855f7] text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                   }`}>
                     {String.fromCharCode(64 + option.id)}
                   </div>
                   <span className={`font-bold text-left flex-1 ${
                     isSelected ? 'text-[#8b5cf6]' : 'text-slate-700 dark:text-slate-200'
                   }`}>
                     {option.text}
                   </span>
                 </button>
               )
             })}
           </div>

        </div>

        {/* Bottom Actions */}
        <div className="px-6 pb-8 pt-4 bg-white dark:bg-slate-800 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex gap-3">
          <button className="h-14 w-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm text-slate-500 hover:text-[#8b5cf6] transition-colors active:scale-95 shrink-0">
             <HelpCircle className="w-6 h-6" strokeWidth={2.5} />
          </button>
          
          <button 
            disabled={!selectedAnswer}
            className={`flex-1 h-14 rounded-2xl font-extrabold text-white text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
              selectedAnswer 
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:shadow-soft' 
                : 'bg-slate-300 dark:bg-slate-600 text-slate-100 cursor-not-allowed'
            }`}
          >
            Check Answer
            <ArrowRight className="w-5 h-5" strokeWidth={2.5}/>
          </button>
        </div>

      </div>
    </div>
  );
};
