import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModuleCardProps {
  children: React.ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  indicatorType?: 'dots' | 'text';
  colorScheme?: 'purple' | 'blue' | 'green';
  actionButton?: React.ReactNode;
  header?: React.ReactNode;
  contentClassName?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  children,
  page,
  totalPages,
  onPageChange,
  indicatorType = 'dots',
  colorScheme = 'purple',
  actionButton,
  header,
  contentClassName = ''
}) => {
  const schemeStyles = {
    purple: {
       btn: 'bg-[#f4effd] dark:bg-slate-700 text-[#8b5cf6]',
       dotActive: 'bg-[#8b5cf6]',
    },
    blue: {
       btn: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
       dotActive: 'bg-blue-600',
    },
    green: {
       btn: 'bg-green-100 dark:bg-green-900/40 text-[#10b981]',
       dotActive: 'bg-[#10b981]',
    }
  };

  const style = schemeStyles[colorScheme];

  return (
    <div className="flex-1 min-h-0 px-4 md:px-6 flex flex-col w-full pb-[110px] z-10 w-full relative">
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100/80 dark:border-slate-700/50 flex-1 flex flex-col min-h-0">
        
        {header && <div className="shrink-0 mb-3">{header}</div>}

        <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col px-1 -mx-1 py-4 ${contentClassName}`}>
          {children}
        </div>
        
        {totalPages > 1 && (
          <div className="shrink-0 pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <button 
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${page === 0 ? 'opacity-30' : `${style.btn} hover:scale-105 active:scale-95`}`}
            >
              <ChevronLeft strokeWidth={3} />
            </button>

            {indicatorType === 'text' ? (
              <span className="font-bold text-slate-400 text-sm tracking-wide">{page + 1} / {totalPages}</span>
            ) : (
              <div className="flex gap-2">
                {Array.from({length: totalPages}).map((_, i) => (
                  <div key={i} className={`h-2.5 rounded-full transition-all ${i === page ? `w-6 ${style.dotActive}` : 'w-2.5 bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
            )}

            <button 
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${page === totalPages - 1 ? 'opacity-30' : `${style.btn} hover:scale-105 active:scale-95`}`}
            >
              <ChevronRight strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {actionButton && (
        <div className="shrink-0 mt-4 flex justify-center">
          {actionButton}
        </div>
      )}
    </div>
  );
};
