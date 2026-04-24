import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RefreshCcw, Check, Volume2, Sparkles } from 'lucide-react';
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

const sentenceLibrary = [
  [["ma", "ya"], ["su", "ka"], ["sa", "te"]],
  [["bu", "di"], ["ba", "ca"], ["bu", "ku"]],
  [["ni", "na"], ["cu", "ci"], ["ba", "ju"]],
  [["do", "ni"], ["ba", "wa"], ["bo", "la"]],
  [["pa", "pa"], ["be", "li"], ["to", "pi"]],
  [["gi", "gi"], ["sa", "pi"], ["i", "tu"]],
  [["ha", "ri"], ["ra", "bu"], ["ba", "ca"]],
  [["wi", "ra"], ["sa", "pu"], ["de", "bu"]],
  [["fe", "ri"], ["ba", "wa"], ["ka", "ca"], ["ma", "ta"]],
  [["ve", "na"], ["su", "ka"], ["pi", "za"]],
  [["qa", "ri"], ["di"], ["ki", "ni"]],
  [["xe", "na"], ["be", "li"], ["ro", "ti"]],
  [["ya", "ya"], ["lu", "pa"], ["ba", "wa"], ["bo", "lu"]],
  [["za", "za"], ["ja", "ga"], ["to", "ko"]],
  [["gu", "ru"], ["ba", "ru"], ["i", "tu"]],
];

const quizLibrary = [
  { target: "MAYA SUKA", extra: ["MI", "LU"], splits: ["MA", "YA", "SU", "KA"] },
  { target: "BUDI BACA", extra: ["BI", "BA"], splits: ["BU", "DI", "BA", "CA"] },
  { target: "NINA CUCI", extra: ["NA", "CA"], splits: ["NI", "NA", "CU", "CI"] },
  { target: "DONI BAWA", extra: ["DA", "BO"], splits: ["DO", "NI", "BA", "WA"] },
  { target: "PAPA BELI", extra: ["PI", "BE"], splits: ["PA", "PA", "BE", "LI"] },
  { target: "WIRA SAPU", extra: ["RU", "SA"], splits: ["WI", "RA", "SA", "PU"] },
  { target: "ZAZA JAGA", extra: ["ZI", "JU"], splits: ["ZA", "ZA", "JA", "GA"] },
];

export const SentenceModule = () => {
  const navigate = useNavigate();
  const { state: appState, markPageCompleted, saveQuizScore } = useApp();
  const [mode, setMode] = useState<'overview' | 'content' | 'quiz'>('overview');
  const [contentPage, setContentPage] = useState(appState.progress['sentence']?.lastPage || 0);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { settings } = useSettings();
  
  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(quizLibrary[0]);
  const [shuffledKeypad, setShuffledKeypad] = useState<{id: string, text: string, used: boolean}[]>([]);
  const [answerSlots, setAnswerSlots] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizQueue, setQuizQueue] = useState<any[]>([]);

  const QUIZ_TOTAL = 5;

  const currentSentence = sentenceLibrary[contentPage];
  const totalPages = sentenceLibrary.length;

  const completedPages = appState.progress['sentence']?.completedPages || [];
  const bestScore = appState.progress['sentence']?.bestScore || null;

  useEffect(() => {
    if (mode === 'content') markPageCompleted('sentence', contentPage);
  }, [contentPage, mode, markPageCompleted]);

  const speak = useCallback((text: string, id: string) => {
    setActiveItem(id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text.toLowerCase());
      msg.lang = 'id-ID';
      msg.rate = 0.8;
      const userName = appState.user?.name || '';
      msg.text = text.includes('Luar biasa') ? `${text} ${userName}` : msg.text;

      msg.onend = () => {
        setActiveItem(prev => prev === id ? null : prev);
      };
      window.speechSynthesis.speak(msg);
    }
  }, [appState.user?.name]);

  const loadSentenceQuiz = useCallback((item: any) => {
    setCurrentQuiz(item);
    const allKeys = [...item.splits, ...item.extra].map((text, i) => ({
      id: `${text}-${i}`,
      text,
      used: false
    })).sort(() => Math.random() - 0.5);

    setShuffledKeypad(allKeys);
    setAnswerSlots([]);
    setFeedback('none');
    
    setTimeout(() => speak(item.target, 'target'), 500);
  }, [speak]);

  const startQuiz = () => {
    const shuffled = [...quizLibrary].sort(() => 0.5 - Math.random()).slice(0, QUIZ_TOTAL);
    setQuizQueue(shuffled);
    setQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setMode('quiz');
    loadSentenceQuiz(shuffled[0]);
  };

  const handleKeyTap = (key: {id: string, text: string, used: boolean}) => {
    if (key.used || feedback !== 'none') return;
    
    const newKeypad = shuffledKeypad.map(k => k.id === key.id ? { ...k, used: true } : k);
    setShuffledKeypad(newKeypad);
    
    const newAnswers = [...answerSlots, key.text];
    setAnswerSlots(newAnswers);
    speak(key.text, key.id);

    if (newAnswers.length === currentQuiz.splits.length) {
      const targetWord = currentQuiz.splits.join('');
      const isCorrect = newAnswers.join('') === targetWord;

      if (isCorrect) {
        setFeedback('correct');
        setQuizScore(prev => prev + 1);
        speak('Luar biasa! Benar!', 'correct');
      } else {
        setFeedback('wrong');
        speak('Sedikit lagi, coba lagi ya!', 'wrong');
      }

      setTimeout(() => {
        const next = quizStep + 1;
        if (next < QUIZ_TOTAL) {
          setQuizStep(next);
          loadSentenceQuiz(quizQueue[next]);
        } else {
          // Handled by effect
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (isQuizFinished) saveQuizScore('sentence', quizScore);
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

  const handleReset = () => {
    setShuffledKeypad(shuffledKeypad.map(k => ({ ...k, used: false })));
    setAnswerSlots([]);
  };

  if (mode === 'overview') {
    return (
      <ModuleOverview
        title="Merakit Kalimat"
        description="Menyusun suku kata menjadi kalimat yang bermakna"
        color="bg-[#10b981]"
        icon={<Sparkles className="w-16 h-16 text-white" />}
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
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#f8f9fe] md:bg-[#10b981] md:p-4 dark:bg-slate-950 transition-colors">
      <div className="w-full md:max-w-[400px] h-[100dvh] md:h-[calc(100dvh-32px)] bg-[#f8f9fe] dark:bg-slate-900 md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-10">
        
        {/* Header */}
        <div className="px-6 flex items-center justify-between mb-6 shrink-0 z-10 w-full">
           <button onClick={() => setMode('overview')} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform">
             <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
           </button>
           <h1 className="flex-1 text-center text-lg font-extrabold text-slate-800 dark:text-white uppercase tracking-tight">Merakit Kalimat</h1>
           <TextSettingsMenu />
        </div>

        {mode === 'content' && (
          <ModuleCard
            page={contentPage}
            totalPages={totalPages}
            onPageChange={setContentPage}
            indicatorType="dots"
            colorScheme="green"
            header={
              <h3 className="font-extrabold text-[#10b981] mb-0 uppercase tracking-wider text-xs text-center">Ayo Membaca!</h3>
            }
            contentClassName={`flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto gap-8 ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
            actionButton={<></>}
          >
            <div className="flex flex-col items-center justify-center gap-8 py-4">
              <div className="flex flex-wrap gap-4 justify-center w-full">
                {currentSentence.map((word, wIdx) => (
                  <div key={wIdx} className="flex gap-1.5 md:gap-2 flex-wrap justify-center">
                    {word.map((syl, sIdx) => {
                      const id = `syl-${wIdx}-${sIdx}`;
                      return (
                        <button 
                          key={sIdx} 
                          onClick={() => speak(syl, id)}
                          className={`border-2 font-black rounded-xl aspect-[4/5] flex items-center justify-center px-1.5 md:px-2 transition-transform shadow-[2px_2px_0px_0px_currentColor] 
                            ${settings.size === 'sm' ? 'text-xl min-w-[3rem]' : settings.size === 'lg' ? 'text-4xl min-w-[4.5rem]' : 'text-2xl min-w-[3.5rem]'}
                            ${activeItem === id
                              ? 'bg-[#10b981] border-[#10b981] text-white scale-105'
                              : 'bg-green-50 dark:bg-green-900/20 border-[#10b981] text-[#10b981] dark:text-[#34d399] hover:scale-105 active:scale-95'
                          }`}
                        >
                          {settings.isCapital ? syl.toUpperCase() : syl.toLowerCase()}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => speak(currentSentence.map(word => word.join('')).join(' '), 'full-sentence')}
                className={`w-full font-black tracking-[0.2em] text-center py-3 px-6 rounded-2xl border-2 shadow-sm leading-relaxed transition-all 
                  ${settings.size === 'sm' ? 'text-xl md:text-2xl' : settings.size === 'lg' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}
                  ${activeItem === 'full-sentence'
                    ? 'bg-slate-700 text-white border-slate-700 dark:bg-slate-200 dark:text-slate-800'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {settings.isCapital ? currentSentence.map(word => word.join('')).join(' ').toUpperCase() : currentSentence.map(word => word.join('')).join(' ').toLowerCase()}
              </button>
            </div>
          </ModuleCard>
        )}

        {mode === 'quiz' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto shrink-0 relative pb-24">
            {!isQuizFinished ? (
              <motion.div 
                key={quizStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <QuizProgress current={quizStep + 1} total={QUIZ_TOTAL} color="bg-green-500" />
                
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => speak(currentQuiz.target, 'target')}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 hover:scale-110 active:scale-90 transition-transform group"
                    >
                      <Volume2 className="w-8 h-8 text-green-600" />
                    </button>
                    <h2 className="text-center font-extrabold text-slate-800 dark:text-white uppercase text-xl">
                      {currentQuiz.target}
                    </h2>
                  </div>
                  
                  {/* Answer Slots Display */}
                  <div className="min-h-[100px] w-full bg-white dark:bg-slate-800/50 rounded-3xl p-6 shadow-inner flex flex-wrap gap-2 justify-center items-center mb-4 border-2 border-slate-100 dark:border-slate-700 relative">
                    <AnimatePresence>
                      {answerSlots.map((slot, i) => (
                        <motion.div 
                          key={`${slot}-${i}`} 
                          initial={{ scale: 0, y: 10 }} 
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0 }}
                          className="bg-green-500 text-white px-5 py-2.5 rounded-2xl text-2xl font-black shadow-sm"
                        >
                          {slot}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {answerSlots.length === 0 && <span className="text-slate-300 dark:text-slate-600 font-bold italic">Ketuk kepingan di bawah...</span>}
                  
                    {answerSlots.length > 0 && feedback === 'none' && (
                      <button onClick={handleReset} className="absolute -bottom-3 right-4 w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 border border-slate-100 dark:border-slate-700 transition-colors">
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Shuffled Keys */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
                    {shuffledKeypad.map((key) => (
                      <button
                        key={key.id}
                        disabled={key.used}
                        onClick={() => handleKeyTap(key)}
                        className={`h-16 rounded-2xl border-2 flex items-center justify-center font-black text-2xl transition-all
                          ${key.used 
                            ? 'bg-slate-50 dark:bg-slate-800/20 border-transparent text-transparent scale-90' 
                            : 'bg-white dark:bg-slate-800 text-green-600 border-slate-100 dark:border-slate-700 shadow-sm hover:border-green-400 active:scale-95'
                          }
                        `}
                      >
                        {key.text}
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
