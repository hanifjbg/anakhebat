import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Volume2, BookA } from 'lucide-react';
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
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizQueue, setQuizQueue] = useState<string[]>([]);

  const QUIZ_TOTAL = 10;
  const ITEMS_PER_PAGE = 12;
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

  const speak = useCallback((text: string, id?: string) => {
    if (id) setActiveItem(id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text.toLowerCase());
      msg.lang = 'id-ID';
      msg.rate = 0.8;
      const userName = appState.user?.name || '';
      // Prefix with name if feedback is correct
      msg.text = text.includes('Bagus') ? `${text} ${userName}` : msg.text;
      
      msg.onend = () => {
        if (id) setActiveItem(prev => prev === id ? null : prev);
      };
      window.speechSynthesis.speak(msg);
    }
  }, [appState.user?.name]);

  const generateQuiz = useCallback((targetLetter?: string) => {
    const target = targetLetter || letters[Math.floor(Math.random() * letters.length)];
    const others = letters.filter(l => l !== target);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 5);
    const choices = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    
    setQuizTarget(target);
    setQuizChoices(choices);
    setFeedback('none');
    
    setTimeout(() => speak(target), 500);
  }, [speak]);

  const startQuiz = () => {
    const shuffledLetters = [...letters].sort(() => 0.5 - Math.random()).slice(0, QUIZ_TOTAL);
    setQuizQueue(shuffledLetters);
    setQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setMode('quiz');
    generateQuiz(shuffledLetters[0]);
  };

  const handleChoice = (choice: string) => {
    if (feedback !== 'none') return;

    if (choice === quizTarget) {
      setFeedback('correct');
      setQuizScore(prev => prev + 1);
      speak('Bagus! Benar!');
    } else {
      setFeedback('wrong');
      speak('Ayo coba lagi, ini huruf ' + quizTarget);
    }

    setTimeout(() => {
      const nextStep = quizStep + 1;
      if (nextStep < QUIZ_TOTAL) {
        setQuizStep(nextStep);
        generateQuiz(quizQueue[nextStep]);
      } else {
        // Quiz is actually finished
      }
    }, 1500);
  };

  useEffect(() => {
    if (isQuizFinished) {
      saveQuizScore('alphabet', quizScore);
    }
  }, [isQuizFinished, quizScore, saveQuizScore]);

  // Effect to handle state after delay correctly without stale closures
  useEffect(() => {
    if (feedback !== 'none' && !isQuizFinished) {
      const timer = setTimeout(() => {
        const nextStep = quizStep + 1;
        if (nextStep >= QUIZ_TOTAL) {
          setIsQuizFinished(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [feedback, isQuizFinished, quizStep, QUIZ_TOTAL]);


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
        <div className="px-6 flex items-center justify-between mb-6 shrink-0 z-10 w-full bg-[#f8f9fe] dark:bg-slate-900 pb-2">
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
            contentClassName={`flex flex-col justify-center h-full gap-4 w-full max-w-sm mx-auto ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
            actionButton={
              <></>
            }
          >
            <div className="grid grid-cols-3 gap-4">
              {currentLetters.map((letter) => (
                <button 
                  key={letter}
                  onClick={() => speak(letter, letter)} 
                  className={`aspect-[4/5] w-full rounded-2xl flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border transition-transform ${
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
          <div className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 pb-24">
            {!isQuizFinished ? (
              <motion.div 
                key={quizStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <QuizProgress current={quizStep + 1} total={QUIZ_TOTAL} color="bg-purple-500" />
                
                <div className="flex-1 flex flex-col items-center justify-center gap-10">
                  <button 
                    onClick={() => speak(quizTarget)}
                    className="w-28 h-28 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 hover:scale-110 active:scale-90 transition-transform group"
                  >
                    <Volume2 className="w-12 h-12 text-purple-600 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  </button>

                  <h2 className="text-center font-extrabold text-slate-800 dark:text-white mb-2 uppercase text-xl">Huruf Apakah Ini?</h2>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    {quizChoices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChoice(choice)}
                        className={`h-22 flex items-center justify-center bg-white dark:bg-slate-800 rounded-3xl border-2 shadow-sm transition-all
                          ${feedback === 'correct' && choice === quizTarget ? 'bg-green-500 border-green-500 scale-105' : 'border-slate-100 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:scale-105'}
                          ${feedback === 'wrong' && choice !== quizTarget ? 'opacity-50' : ''}
                        `}
                      >
                        <span className={`text-5xl font-black ${feedback === 'correct' && choice === quizTarget ? 'text-white' : 'text-purple-600'}`}>
                          {settings.isCapital ? choice.toUpperCase() : choice.toLowerCase()}
                        </span>
                      </button>
                    ))}
                  </div>
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
