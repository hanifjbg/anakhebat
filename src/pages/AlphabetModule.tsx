import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Volume2, BookA, ThumbsUp, Frown } from 'lucide-react';
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

const letters = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));

export const AlphabetModule = () => {
  const navigate = useNavigate();
  const { state: appState, markPageCompleted, saveQuizScore } = useApp();
  const [mode, setMode] = useState<'overview' | 'content' | 'quiz'>('overview');
  const [page, setPage] = useState(appState.progress['alphabet']?.lastPage || 0);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { settings } = useSettings();
  
  // Quiz states
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTarget, setQuizTarget] = useState('A');
  const [quizChoices, setQuizChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizQueue, setQuizQueue] = useState<string[]>([]);

  const QUIZ_TOTAL = 10;
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(letters.length / ITEMS_PER_PAGE);
  const currentLetters = letters.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const completedPages = appState.progress['alphabet']?.completedPages || [];
  const bestScore = appState.progress['alphabet']?.bestScore || null;

  // Auto-mark current page visited when reading
  useEffect(() => {
    if (mode === 'content') {
      markPageCompleted('alphabet', page);
    }
  }, [page, mode, markPageCompleted]);

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

  const generateQuiz = useCallback((targetLetter?: string) => {
    const target = targetLetter || letters[Math.floor(Math.random() * letters.length)];
    const others = letters.filter(l => l !== target);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 5);
    const choices = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    
    setQuizTarget(target);
    setQuizChoices(choices);
    setFeedback('none');
    setSelectedChoice(null);
    
    setTimeout(() => {
      speak(TTSEngine.getQuestionInstruction('alphabet', target));
    }, 500);
  }, [speak]);

  const startQuiz = () => {
    TTSEngine.stop();
    const shuffledLetters = [...letters].sort(() => 0.5 - Math.random()).slice(0, QUIZ_TOTAL);
    setQuizQueue(shuffledLetters);
    setQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setMode('quiz');
    generateQuiz(shuffledLetters[0]);
  };

  const handleChoice = async (choice: string) => {
    if (feedback !== 'none') return;
    
    setSelectedChoice(choice);
    
    // Add brief delay to show the blue "selected" state
    await new Promise(resolve => setTimeout(resolve, 300));

    const isCorrect = choice === quizTarget;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setQuizScore(prev => prev + 1);

    const isLastQuestion = quizStep === QUIZ_TOTAL - 1;
    const isMilestone = (quizStep > 0 && (quizStep + 1) % Math.ceil(QUIZ_TOTAL / 4) === 0);
    const feedbackText = TTSEngine.getFeedback(isCorrect, quizTarget, appState.user?.name || '', isMilestone, isLastQuestion);
    
    await speak(feedbackText);

    const nextStep = quizStep + 1;
    if (nextStep < QUIZ_TOTAL) {
      setQuizStep(nextStep);
      generateQuiz(quizQueue[nextStep]);
    } else {
      setIsQuizFinished(true);
      const finalScorePercentage = Math.round(((quizScore + (isCorrect ? 1 : 0)) / QUIZ_TOTAL) * 100);
      const summaryText = TTSEngine.getSummary(finalScorePercentage, appState.user?.name || '');
      speak(summaryText);
    }
  };

  useEffect(() => {
    if (isQuizFinished) {
      saveQuizScore('alphabet', Math.round((quizScore / QUIZ_TOTAL) * 100));
    }
  }, [isQuizFinished, quizScore, saveQuizScore]);

  useEffect(() => {
    return () => TTSEngine.stop();
  }, []);



  if (mode === 'overview') {
    return (
      <ModuleOverview
        title="Mengenal Abjad"
        description="A sampai Z dengan cara yang menyenangkan"
        color="bg-purple-500"
        icon={<BookA className="w-16 h-16 text-white" />}
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
        <div className="px-6 flex items-center justify-between mb-6 shrink-0 relative z-50 w-full bg-[#f8f9fe] dark:bg-slate-900 pb-2">
           <button onClick={() => setMode('overview')} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-lg font-extrabold text-slate-800 dark:text-white">
             {mode === 'content' ? 'Belajar Abjad' : 'Kuis Abjad'}
           </h1>
           <TextSettingsMenu />
        </div>

        {mode === 'content' ? (
          <ModuleCard
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            indicatorType="dots"
            colorScheme="purple"
            contentClassName={`justify-center gap-4 w-full max-w-sm mx-auto ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
            actionButton={
              <></>
            }
          >
            <div className="grid grid-cols-3 gap-4">
              {currentLetters.map((letter) => (
                <button 
                  key={letter}
                  onClick={() => speak(letter, letter)} 
                  className={`aspect-square w-full rounded-2xl flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border transition-transform ${
                    activeItem === letter
                      ? 'bg-[#8b5cf6] border-[#8b5cf6] scale-105'
                      : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 hover:scale-105 active:scale-95 shadow-sm'
                  }`}
                >
                  <span className={`${settings.size === 'sm' ? 'text-2xl' : settings.size === 'lg' ? 'text-6xl' : 'text-4xl'} font-black ${activeItem === letter ? 'text-white' : 'text-[#8b5cf6]'}`}>
                    {settings.isCapital ? letter.toUpperCase() : letter.toLowerCase()}
                  </span>
                </button>
              ))}
            </div>
          </ModuleCard>
        ) : (
          <div className={`flex-1 flex flex-col px-6 overflow-y-auto overflow-x-hidden shrink-0 pb-[120px] no-scrollbar pt-2 ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}>
            {!isQuizFinished ? (
              <div className="flex-1 flex flex-col">
                <QuizProgress current={quizStep + 1} total={QUIZ_TOTAL} color="bg-purple-500" />
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
                        <span className="text-lg sm:text-xl drop-shadow-sm">{feedback === 'correct' ? 'Hebat! Jawabanmu Benar' : `Kurang tepat, yang benar adalah ${settings.isCapital ? quizTarget.toUpperCase() : quizTarget.toLowerCase()}`}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sound & Instruction Banner */}
                  <button 
                    onClick={() => speak(TTSEngine.getQuestionInstruction('alphabet', quizTarget))}
                    className="w-full bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-800 rounded-3xl p-3 sm:p-4 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm group shrink-0"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:bg-purple-500 transition-colors">
                      <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:text-white transition-colors" strokeWidth={2.5} />
                    </div>
                    <h2 className="flex-1 text-left font-extrabold text-purple-900 dark:text-purple-100 uppercase text-base sm:text-xl leading-tight">
                      Cari Huruf yang Disebut!
                    </h2>
                  </button>

              {/* Hint / Petunjuk Blok - MAXIMIZED VIEW */}
              <div className="flex-1 w-full flex items-center justify-center min-h-0 shrink-0">
                <motion.div 
                  key={feedback === 'correct' ? 'correct' : 'question'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className={`w-[35vh] h-[35vh] max-w-[200px] max-h-[200px] sm:max-w-[280px] sm:max-h-[280px] rounded-[3rem] sm:rounded-[4rem] border-4 flex items-center justify-center shadow-inner relative overflow-hidden ${feedback === 'correct' ? 'bg-green-50 border-green-200 text-green-500 dark:bg-green-900/20 dark:border-green-800 border-solid' : 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 border-dashed'}`}
                >
                  <span className={`text-[12vh] sm:text-[15vh] font-black leading-none ${feedback !== 'correct' ? 'opacity-20' : ''}`}>
                    {settings.isCapital ? quizTarget.toUpperCase() : quizTarget.toLowerCase()}
                  </span>
                </motion.div>
              </div>

              {/* Options - FULL GRID */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full shrink-0 px-1 sm:px-0">
                {quizChoices.map((choice, idx) => {
                  const isSelected = selectedChoice === choice;
                  const isCorrectAnswer = choice === quizTarget;
                  
                  let btnClass = 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-[#8b5cf6] hover:border-purple-300 dark:hover:border-purple-600 hover:-translate-y-1';
                  let IconTemplate = null;

                  if (feedback !== 'none') {
                    if (isCorrectAnswer) {
                      btnClass = 'bg-green-500 border-green-600 text-white scale-105 shadow-green-500/30';
                      IconTemplate = <ThumbsUp className="w-5 h-5 text-white" />;
                    } else if (isSelected && !isCorrectAnswer) {
                      btnClass = 'bg-red-500 border-red-600 text-white scale-95 opacity-80';
                      IconTemplate = <Frown className="w-5 h-5 text-white" />;
                    } else {
                      btnClass = 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-[#8b5cf6] opacity-40 scale-95';
                    }
                  } else if (isSelected) {
                    btnClass = 'bg-blue-500 border-blue-600 text-white scale-95';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice)}
                      disabled={feedback !== 'none'}
                      className={`h-[11vh] min-h-[4.5rem] max-h-[5.5rem] sm:min-h-[5.5rem] flex flex-col items-center justify-center rounded-[2rem] sm:rounded-[2.5rem] border-b-4 shadow-sm transition-all relative ${btnClass}`}
                    >
                      <span className={`text-[5vh] sm:text-5xl font-black translate-y-1`}>
                        {settings.isCapital ? choice.toUpperCase() : choice.toLowerCase()}
                      </span>
                      {IconTemplate && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-white/20 backdrop-blur-md rounded-full shadow-sm p-1 border border-white/30">
                          {IconTemplate}
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
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
