import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Volume2, RefreshCcw, BookOpen } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { ModuleCard } from '../components/ModuleCard';
import { Button } from '../components/ui/Button';
import { TextSettingsMenu } from '../components/TextSettingsMenu';
import { useSettings } from '../contexts/SettingsContext';
import { FeedbackOverlay } from '../components/quiz/FeedbackOverlay';
import { QuizProgress } from '../components/quiz/QuizProgress';
import { QuizSummary } from '../components/quiz/QuizSummary';
import { ModuleOverview } from '../components/ModuleOverview';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'motion/react';

const groups = [
  ['A', 'I', 'U', 'E', 'O'],
  ['BA', 'BI', 'BU', 'BE', 'BO'],
  ['CA', 'CI', 'CU', 'CE', 'CO'],
  ['DA', 'DI', 'DU', 'DE', 'DO'],
  ['FA', 'FI', 'FU', 'FE', 'FO'],
  ['GA', 'GI', 'GU', 'GE', 'GO'],
  ['HA', 'HI', 'HU', 'HE', 'HO'],
  ['JA', 'JI', 'JU', 'JE', 'JO'],
  ['KA', 'KI', 'KU', 'KE', 'KO'],
  ['LA', 'LI', 'LU', 'LE', 'LO'],
  ['MA', 'MI', 'MU', 'ME', 'MO'],
  ['NA', 'NI', 'NU', 'NE', 'NO'],
  ['PA', 'PI', 'PU', 'PE', 'PO'],
  ['QA', 'QI', 'QU', 'QE', 'QO'],
  ['RA', 'RI', 'RU', 'RE', 'RO'],
  ['SA', 'SI', 'SU', 'SE', 'SO'],
  ['TA', 'TI', 'TU', 'TE', 'TO'],
  ['VA', 'VI', 'VU', 'VE', 'VO'],
  ['WA', 'WI', 'WU', 'WE', 'WO'],
  ['XA', 'XI', 'XU', 'XE', 'XO'],
  ['YA', 'YI', 'YU', 'YE', 'YO'],
  ['ZA', 'ZI', 'ZU', 'ZE', 'ZO'],
];

const practicePages: { target: string, sentences: string[] }[] = [];

groups.slice(1).forEach((group, index) => {
  const syl = group[0].toUpperCase(); // e.g., 'BA'
  const c = syl[0]; // 'B'
  const v = syl[1]; // 'A'
  
  const availableSyls = groups.slice(1, index + 2).map(g => g[0].toUpperCase());
  
  practicePages.push({
    target: syl.toLowerCase(),
    sentences: [
      `${c} ${c} ${c}`,
      `${syl} ${syl} ${syl} ${syl}`,
      `${v} ${syl} ${v} ${syl}`
    ]
  });

  if (index > 2) {
    let review1 = availableSyls.slice().sort(() => 0.5 - Math.random()).slice(0, 4).join(' ');
    let review2 = availableSyls.slice().sort(() => 0.5 - Math.random()).slice(0, 4).join(' ');
    let review3 = availableSyls.slice().sort(() => 0.5 - Math.random()).slice(0, 4).join(' ');
    practicePages.push({
      target: `Review ${syl}`,
      sentences: [review1, review2, review3]
    });
  }
});

const quizPool = [
  { target: "BOLA", syllables: ["BO", "LA"] },
  { target: "BUKU", syllables: ["BU", "KU"] },
  { target: "MATA", syllables: ["MA", "TA"] },
  { target: "TOPI", syllables: ["TO", "PI"] },
  { target: "NINA", syllables: ["NI", "NA"] },
  { target: "BUDI", syllables: ["BU", "DI"] },
  { target: "SAPI", syllables: ["SA", "PI"] },
  { target: "CUCI", syllables: ["CU", "CI"] },
  { target: "ROTI", syllables: ["RO", "TI"] },
  { target: "KACA", syllables: ["KA", "CA"] },
];

export const VowelModule = () => {
  const navigate = useNavigate();
  const { state: appState, markPageCompleted, saveQuizScore } = useApp();
  const [mode, setMode] = useState<'overview' | 'content' | 'practice' | 'quiz'>('overview');
  const [page, setPage] = useState(appState.progress['vowel']?.lastPage || 0);
  const [practicePage, setPracticePage] = useState(0);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { settings } = useSettings();

  // Content Pagination
  const GROUPS_PER_PAGE = 3;
  const totalPages = Math.ceil(groups.length / GROUPS_PER_PAGE);
  const currentGroups = groups.slice(page * GROUPS_PER_PAGE, (page + 1) * GROUPS_PER_PAGE);

  const completedPages = appState.progress['vowel']?.completedPages || [];
  const bestScore = appState.progress['vowel']?.bestScore || null;

  useEffect(() => {
    if (mode === 'content') markPageCompleted('vowel', page);
  }, [page, mode, markPageCompleted]);

  // Quiz States
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState({ target: '', syllables: [] as string[] });
  const [quizInput, setQuizInput] = useState<string[]>([]);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizQueue, setQuizQueue] = useState<any[]>([]);

  const QUIZ_TOTAL = 5;

  const speak = useCallback((text: string, id?: string) => {
    if (id) setActiveItem(id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text.toLowerCase());
      msg.lang = 'id-ID';
      msg.rate = 0.8;
      const userName = appState.user?.name || '';
      msg.text = text.includes('Hebat') ? `${text} ${userName}` : msg.text;

      msg.onend = () => {
        if (id) setActiveItem(prev => prev === id ? null : prev);
      };
      window.speechSynthesis.speak(msg);
    }
  }, [appState.user?.name]);

  const generateVowelQuiz = useCallback((item: any) => {
    setCurrentQuiz(item);
    setQuizInput([]);
    // Scramble syllables and add extra
    const allSyls = groups.flat();
    const extras = allSyls.sort(() => 0.5 - Math.random()).slice(0, 2);
    setScrambled([...item.syllables, ...extras].sort(() => 0.5 - Math.random()));
    setFeedback('none');
    
    setTimeout(() => speak(item.syllables.join('')), 500);
  }, [speak]);

  const startQuiz = () => {
    const shuffled = [...quizPool].sort(() => 0.5 - Math.random()).slice(0, QUIZ_TOTAL);
    setQuizQueue(shuffled);
    setQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setMode('quiz');
    generateVowelQuiz(shuffled[0]);
  };

  const handleSyllableClick = (syl: string) => {
    if (feedback !== 'none') return;
    const newInput = [...quizInput, syl];
    setQuizInput(newInput);
    speak(syl);

    if (newInput.length === currentQuiz.syllables.length) {
      const result = newInput.join('') === currentQuiz.syllables.join('');
      if (result) {
        setFeedback('correct');
        setQuizScore(prev => prev + 1);
        speak('Hebat! ' + currentQuiz.target);
      } else {
        setFeedback('wrong');
        speak('Ayo coba lagi');
      }

      setTimeout(() => {
        const next = quizStep + 1;
        if (next < QUIZ_TOTAL) {
          setQuizStep(next);
          generateVowelQuiz(quizQueue[next]);
        } else {
          // Finished delay handled by effect
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (isQuizFinished) saveQuizScore('vowel', quizScore);
  }, [isQuizFinished, quizScore, saveQuizScore]);

  useEffect(() => {
    if (feedback !== 'none' && !isQuizFinished) {
      const timer = setTimeout(() => {
        const nextStep = quizStep + 1;
        if (nextStep >= QUIZ_TOTAL) setIsQuizFinished(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback, isQuizFinished, quizStep, QUIZ_TOTAL]);

  if (mode === 'overview') {
    return (
      <ModuleOverview
        title="Huruf Vokal"
        description="Belajar menggabungkan huruf konsonan dan vokal"
        color="bg-[#eab308]"
        icon={<BookOpen className="w-16 h-16 text-white" />}
        totalPages={totalPages}
        completedPages={completedPages}
        bestScore={bestScore}
        onBack={() => navigate(-1)}
        onEnterLearn={() => setMode('content')}
        onEnterQuiz={startQuiz}
      />
    );
  }

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#8050f2] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center justify-between mb-4 shrink-0 z-10 w-full">
           <button onClick={() => setMode('overview')} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-lg font-extrabold text-slate-800 dark:text-white">Huruf Vokal</h1>
           <TextSettingsMenu />
        </div>

        {/* Tab Selection if in content */}
        {mode !== 'quiz' && (
          <div className="px-6 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-full p-1.5 flex shadow-sm">
              <button onClick={() => setMode('content')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${mode === 'content' ? 'bg-[#3b82f6] text-white shadow-soft' : 'text-slate-500'}`}>Suku Kata</button>
              <button onClick={() => setMode('practice')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${mode === 'practice' ? 'bg-[#3b82f6] text-white shadow-soft' : 'text-slate-500'}`}>Latihan</button>
            </div>
          </div>
        )}

        {mode === 'content' && (
          <ModuleCard
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            indicatorType="text"
            colorScheme="blue"
            contentClassName={`flex flex-col justify-center h-full gap-3 w-full max-w-sm mx-auto ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
            actionButton={<></>}
          >
            <div className="flex flex-col justify-center h-full gap-3 w-full max-w-sm mx-auto">
              {currentGroups.map((group, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-5 gap-2">
                  {group.map((syl, colIdx) => {
                    const id = `content-${rowIdx}-${colIdx}`;
                    return (
                      <button 
                        key={colIdx} 
                        onClick={() => speak(syl, id)}
                        className={`aspect-[3/4] w-full rounded-2xl flex items-center justify-center border shadow-sm transition-transform ${
                          activeItem === id
                            ? 'bg-blue-500 border-blue-500 scale-105'
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 hover:scale-105 active:scale-95'
                        }`}
                      >
                        <span className={`${settings.size === 'sm' ? 'text-lg' : settings.size === 'lg' ? 'text-3xl' : 'text-xl'} md:${settings.size === 'sm' ? 'text-xl' : settings.size === 'lg' ? 'text-4xl' : 'text-2xl'} font-black ${activeItem === id ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                          {settings.isCapital ? syl.toUpperCase() : syl.toLowerCase()}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </ModuleCard>
        )}

        {mode === 'practice' && (
          <ModuleCard
            page={practicePage}
            totalPages={practicePages.length}
            onPageChange={setPracticePage}
            indicatorType="text"
            colorScheme="blue"
            contentClassName={`flex flex-col justify-center h-full gap-5 w-full max-w-sm mx-auto ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
            header={
              <div className="flex justify-center mb-0">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
                  Membaca "{settings.isCapital ? practicePages[practicePage].target.toUpperCase() : practicePages[practicePage].target.toLowerCase()}"
                </span>
              </div>
            }
          >
            {practicePages[practicePage].sentences.map((sentence, i) => (
              <div key={i} className="flex flex-wrap flex-row gap-3 justify-center">
                {sentence.split(' ').map((syl, j) => {
                  const id = `practice-${i}-${j}`;
                  return (
                    <button 
                      key={j} 
                      onClick={() => speak(syl, id)}
                      className={`min-w-[4.5rem] md:min-w-[5rem] px-4 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all font-extrabold
                        ${settings.size === 'sm' ? 'h-12 md:h-16 text-2xl md:text-3xl' : settings.size === 'lg' ? 'h-20 md:h-24 text-4xl md:text-5xl' : 'h-16 md:h-20 text-3xl md:text-4xl'}
                        ${activeItem === id
                          ? 'bg-blue-500 border-blue-500 text-white scale-105'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500 text-blue-600 dark:text-blue-400 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {settings.isCapital ? syl.toUpperCase() : syl.toLowerCase()}
                    </button>
                  )
                })}
              </div>
            ))}
          </ModuleCard>
        )}

        {mode === 'quiz' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0">
            {!isQuizFinished ? (
              <motion.div 
                key={quizStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col pt-8"
              >
                <QuizProgress current={quizStep + 1} total={QUIZ_TOTAL} color="bg-blue-500" />
                
                <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-32">
                  <button 
                    onClick={() => speak(currentQuiz.syllables.join(''))}
                    className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 hover:scale-110 active:scale-90 transition-transform group"
                  >
                    <Volume2 className="w-10 h-10 text-blue-600" />
                  </button>

                  <h2 className="text-sm font-extrabold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">Apa Suku Katanya?</h2>

                  {/* Input slots */}
                  <div className="flex gap-2 min-h-[80px] w-full justify-center">
                    {currentQuiz.syllables.map((_, idx) => (
                      <div key={idx} className={`w-18 h-22 rounded-2xl border-4 flex items-center justify-center shadow-inner transition-all ${
                        quizInput[idx] ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}>
                        <span className="text-2xl font-black uppercase">{quizInput[idx] || '?'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                    {scrambled.map((syl, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleSyllableClick(syl)}
                         className="h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 active:scale-95 transition-all text-blue-600 dark:text-blue-400 font-extrabold text-2xl uppercase"
                       >
                         {syl}
                       </button>
                    ))}
                  </div>
                  
                  <Button variant="ghost" onClick={() => setQuizInput([])} className="mt-4 gap-2 text-slate-400">
                    <RefreshCcw className="w-4 h-4" /> Reset
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <QuizSummary 
                  score={quizScore} 
                  total={QUIZ_TOTAL} 
                  onRestart={startQuiz} 
                  onHome={() => setMode('overview')} 
                />
              </div>
            )}
          </div>
        )}

        <FeedbackOverlay type={feedback} />
      </div>
    </div>
  );
};
