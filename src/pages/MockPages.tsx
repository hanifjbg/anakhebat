import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const MockPage = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center mb-6">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-xl font-extrabold text-slate-800 dark:text-white mr-10">{title}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 text-center">
           <div>
             <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
               <span className="text-4xl animate-bounce">🚧</span>
             </div>
             <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Under Construction</h2>
             <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
               The <span className="text-[#8050f2]">{title}</span> page is currently being designed and developed.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};
