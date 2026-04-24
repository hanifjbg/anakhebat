import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Volume2, RefreshCcw, BookOpen, ThumbsUp, Frown } from 'lucide-react';
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
import { TTSEngine } from '../services/TTSEngine';

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

  const speak = useCallback(async (text: string, id?: string) => {
    if (id) setActiveItem(id);
    if (!settings.ttsEnabled) {
      if (id) {
        setTimeout(() => setActiveItem(prev => prev === id ? null : prev), 1000);
      }
      return;
    }
    
    await TTSEngine.speak(text, {
      onEnd: () => {
        if (id) setActiveItem(prev => prev === id ? null : prev);
      }
    });
  }, [settings.ttsEnabled]);

  const generateVowelQuiz = useCallback((item: any) => {
    setCurrentQuiz(item);
    setQuizInput([]);
    // Scramble syllables and add extra
    const allSyls = groups.flat();
    const extras = allSyls.sort(() => 0.5 - Math.random()).slice(0, 2);
    setScrambled([...item.syllables, ...extras].sort(() => 0.5 - Math.random()));
    setFeedback('none');
    
    setTimeout(() => {
      speak(TTSEngine.getQuestionInstruction('vowel', item.syllables.join('')));
    }, 500);
  }, [speak]);

  const startQuiz = () => {
    TTSEngine.stop();
    const shuffled = [...quizPool].sort(() => 0.5 - Math.random()).slice(0, QUIZ_TOTAL);
    setQuizQueue(shuffled);
    setQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setMode('quiz');
    generateVowelQuiz(shuffled[0]);
  };

  const handleSyllableClick = async (syl: string) => {
    if (feedback !== 'none') return;
    const newInput = [...quizInput, syl];
    setQuizInput(newInput);
    
    if (newInput.length === currentQuiz.syllables.length) {
      const isCorrect = newInput.join('') === currentQuiz.syllables.join('');
      setFeedback(isCorrect ? 'correct' : 'wrong');
      
      if (isCorrect) setQuizScore(prev => prev + 1);

      const isLastQuestion = quizStep === QUIZ_TOTAL - 1;
      const isMilestone = (quizStep > 0 && (quizStep + 1) % Math.ceil(QUIZ_TOTAL / 4) === 0);
      const feedbackText = TTSEngine.getFeedback(isCorrect, currentQuiz.target, appState.user?.name || '', isMilestone, isLastQuestion);
      
      await speak(feedbackText);

      const nextStep = quizStep + 1;
      if (nextStep < QUIZ_TOTAL) {
        setQuizStep(nextStep);
        generateVowelQuiz(quizQueue[nextStep]);
      } else {
        setIsQuizFinished(true);
        const finalScorePercentage = Math.round(((quizScore + (isCorrect ? 1 : 0)) / QUIZ_TOTAL) * 100);
        const summaryText = TTSEngine.getSummary(finalScorePercentage, appState.user?.name || '');
        speak(summaryText);
      }
    } else {
      speak(syl); // Just speak single syllable
    }
  };

  useEffect(() => {
    if (isQuizFinished) saveQuizScore('vowel', Math.round((quizScore / QUIZ_TOTAL) * 100));
  }, [isQuizFinished, quizScore, saveQuizScore]);

  useEffect(() => {
    return () => TTSEngine.stop();
  }, []);

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
        <div className="px-6 flex items-center justify-between mb-4 shrink-0 relative z-50 w-full">
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
            contentClassName={`justify-center gap-3 w-full max-w-sm mx-auto ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
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
            contentClassName={`justify-center gap-5 w-full max-w-sm mx-auto ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
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
          <div className={`flex-1 flex flex-col px-6 overflow-y-auto overflow-x-hidden shrink-0 pb-[120px] no-scrollbar pt-2 ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}>
            {!isQuizFinished ? (
              <div className="flex-1 flex flex-col pt-2">
                <QuizProgress current={quizStep + 1} total={QUIZ_TOTAL} color="bg-blue-500" />
                <motion.div 
                  key={quizStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col items-center gap-6 min-h-0 py-4 relative"
                >
                  <AnimatePresence>
                    {feedback !== 'none' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -50, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`fixed top-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 py-4 px-6 rounded-3xl font-bold text-center text-white shadow-2xl flex items-center justify-center gap-3 border-4 border-white/20 backdrop-blur-sm ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                         {feedback === 'correct' ? <ThumbsUp className="w-7 h-7 sm:w-8 sm:h-8" /> : <Frown className="w-7 h-7 sm:w-8 sm:h-8" />}
                        <span className="text-lg sm:text-xl drop-shadow-sm">{feedback === 'correct' ? 'Hebat! Jawabanmu Benar' : `Kurang tepat, yang benar adalah ${settings.isCapital ? currentQuiz.target.toUpperCase() : currentQuiz.target.toLowerCase()}`}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sound & Instruction Banner */}
                  <button 
                    onClick={() => speak(TTSEngine.getQuestionInstruction('vowel', currentQuiz.syllables.join('')))}
                    className="w-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-3 sm:p-4 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm group shrink-0"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-500 transition-colors">
                      <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 flex flex-col items-start leading-tight">
                       <h2 className="text-left font-extrabold text-blue-900/80 dark:text-blue-100/80 uppercase text-[10px] sm:text-xs">
                         Susun Suku Katanya!
                       </h2>
                       <p className="font-black text-xl sm:text-2xl text-blue-800 dark:text-blue-100 uppercase mt-0.5">
                         "{currentQuiz.target}"
                       </p>
                    </div>
                  </button>

                  {/* Hint / Petunjuk Blok - MAXIMIZED VIEW */}
                  <div className="flex-1 w-full flex items-center justify-center min-h-0 shrink-0">
                     <div className="flex flex-wrap gap-2 sm:gap-4 justify-center relative px-2">
                        {currentQuiz.syllables.map((syl, idx) => {
                          let slotClass = 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 border-dashed';
                          let IconTemplate = null;
                          if (quizInput[idx]) {
                            if (feedback === 'correct') {
                              slotClass = 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800 border-solid shadow-sm';
                              if (idx === currentQuiz.syllables.length - 1) IconTemplate = <ThumbsUp className="w-5 h-5 text-green-500" />;
                            } else if (feedback === 'wrong') {
                              slotClass = 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 border-solid shadow-sm';
                              if (idx === currentQuiz.syllables.length - 1) IconTemplate = <Frown className="w-5 h-5 text-red-500" />;
                            } else {
                              slotClass = 'bg-blue-500 border-blue-600 text-white border-solid shadow-sm';
                            }
                          }
                          
                          return (
                            <motion.div 
                              key={idx} 
                              animate={quizInput[idx] ? { scale: [1, 1.1, 1] } : {}}
                              className={`w-[20vh] h-[20vh] max-w-[120px] max-h-[120px] sm:max-w-[150px] sm:max-h-[150px] rounded-[2rem] sm:rounded-[3rem] border-4 flex items-center justify-center transition-all relative ${slotClass}`}
                            >
                              <span className={`text-[7vh] sm:text-[9vh] font-black leading-none ${!quizInput[idx] ? 'opacity-20' : ''}`}>
                                {quizInput[idx] 
                                   ? (settings.isCapital ? quizInput[idx].toUpperCase() : quizInput[idx].toLowerCase()) 
                                   : ''}
                              </span>
                              {IconTemplate && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-full shadow-sm p-1 border border-slate-100">
                                  {IconTemplate}
                                </motion.span>
                              )}
                            </motion.div>
                          )
                        })}
                     </div>
                  </div>

                  {/* Options - DYNAMIC GRID */}
                  <div className={`grid gap-3 sm:gap-4 w-full shrink-0 px-1 sm:px-0 ${scrambled.length > 4 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {scrambled.map((syl, idx) => {
                       const isSelected = quizInput.includes(syl);
                       return (
                       <button
                         key={idx}
                         onClick={() => handleSyllableClick(syl)}
                         disabled={feedback !== 'none' || isSelected}
                         className={`h-[11vh] min-h-[4.5rem] max-h-[5.5rem] sm:min-h-[5.5rem] rounded-[2rem] sm:rounded-[2.5rem] border-b-4 shadow-sm transition-all font-extrabold text-[4vh] sm:text-4xl flex items-center justify-center
                           ${isSelected ? 'bg-slate-100 dark:bg-slate-800/20 text-transparent border-transparent scale-95 opacity-50' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:-translate-y-1 text-[#3b82f6] dark:text-[#60a5fa] active:scale-95'}`}
                       >
                         <span className="translate-y-1">{settings.isCapital ? syl.toUpperCase() : syl.toLowerCase()}</span>
                       </button>
                       );
                    })}
                  </div>
                  
                  <Button variant="ghost" onClick={() => setQuizInput([])} disabled={feedback !== 'none'} className="mt-[-8px] gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <RefreshCcw className="w-4 h-4" /> Reset
                  </Button>
                </motion.div>
            </div>
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

        <BottomNav />
      </div>
    </div>
  );
};
