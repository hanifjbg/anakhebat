import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RefreshCcw, Check, Volume2, Sparkles, ThumbsUp, Frown, RotateCcw } from 'lucide-react';
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

  const speak = useCallback(async (text: string, id: string) => {
    setActiveItem(id);
    if (!settings.ttsEnabled) {
      setTimeout(() => setActiveItem(prev => prev === id ? null : prev), 1000);
      return;
    }
    
    await TTSEngine.speak(text, {
      onEnd: () => {
        setActiveItem(prev => prev === id ? null : prev);
      }
    });
  }, [settings.ttsEnabled]);

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
    
    setTimeout(() => {
      speak(TTSEngine.getQuestionInstruction('sentence', item.target), 'target');
    }, 500);
  }, [speak]);

  const startQuiz = () => {
    TTSEngine.stop();
    const shuffled = [...quizLibrary].sort(() => 0.5 - Math.random()).slice(0, QUIZ_TOTAL);
    setQuizQueue(shuffled);
    setQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setMode('quiz');
    loadSentenceQuiz(shuffled[0]);
  };

  const handleKeyTap = async (key: {id: string, text: string, used: boolean}) => {
    if (key.used || feedback !== 'none') return;
    
    const newKeypad = shuffledKeypad.map(k => k.id === key.id ? { ...k, used: true } : k);
    setShuffledKeypad(newKeypad);
    
    const newAnswers = [...answerSlots, key.text];
    setAnswerSlots(newAnswers);

    if (newAnswers.length === currentQuiz.splits.length) {
      const targetWord = currentQuiz.splits.join('');
      const isCorrect = newAnswers.join('') === targetWord;

      setFeedback(isCorrect ? 'correct' : 'wrong');
      
      if (isCorrect) setQuizScore(prev => prev + 1);

      const isLastQuestion = quizStep === QUIZ_TOTAL - 1;
      const isMilestone = (quizStep > 0 && (quizStep + 1) % Math.ceil(QUIZ_TOTAL / 4) === 0);
      const feedbackText = TTSEngine.getFeedback(isCorrect, currentQuiz.target, appState.user?.name || '', isMilestone, isLastQuestion);
      
      await speak(feedbackText, 'feedback');

      const nextStep = quizStep + 1;
      if (nextStep < QUIZ_TOTAL) {
        setQuizStep(nextStep);
        loadSentenceQuiz(quizQueue[nextStep]);
      } else {
        setIsQuizFinished(true);
        const finalScorePercentage = Math.round(((quizScore + (isCorrect ? 1 : 0)) / QUIZ_TOTAL) * 100);
        const summaryText = TTSEngine.getSummary(finalScorePercentage, appState.user?.name || '');
        speak(summaryText, 'summary');
      }
    } else {
      speak(key.text, key.id);
    }
  };

  useEffect(() => {
    if (isQuizFinished) saveQuizScore('sentence', Math.round((quizScore / QUIZ_TOTAL) * 100));
  }, [isQuizFinished, quizScore, saveQuizScore]);

  useEffect(() => {
    return () => TTSEngine.stop();
  }, []);

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
        <div className="px-6 flex items-center justify-between mb-6 shrink-0 relative z-50 w-full">
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
            contentClassName={`items-center justify-center w-full max-w-sm mx-auto gap-8 ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}
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
          <div className={`flex-1 flex flex-col px-6 overflow-y-auto overflow-x-hidden shrink-0 relative pb-[120px] no-scrollbar pt-2 ${settings.fontType === 'comic' ? 'font-comic' : settings.fontType === 'quicksand' ? 'font-quicksand' : 'font-sans'}`}>
            {!isQuizFinished ? (
              <div className="flex-1 flex flex-col">
                <QuizProgress current={quizStep + 1} total={QUIZ_TOTAL} color="bg-green-500" />
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
                    onClick={() => speak(TTSEngine.getQuestionInstruction('sentence', currentQuiz.target), 'target')}
                    className="w-full bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-3xl p-3 sm:p-4 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm group shrink-0"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:bg-green-500 transition-colors">
                      <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 group-hover:text-white transition-colors" strokeWidth={2.5} />
                    </div>
                    <h2 className="flex-1 text-left font-extrabold text-green-900 dark:text-green-100 uppercase text-base sm:text-xl leading-tight">
                      Susun Kalimatnya!
                    </h2>
                  </button>

                  {/* Answer Slots Display (Petunjuk Visual) - MAXIMIZED VIEW */}
                  <div className="flex-1 w-full min-h-0 bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] p-4 sm:p-6 shadow-inner flex flex-wrap gap-2 sm:gap-4 justify-center items-center content-center shrink-0 border-4 border-dashed border-slate-200 dark:border-slate-700 relative">
                    <AnimatePresence>
                      {currentQuiz.splits.map((expectedText: string, i: number) => {
                         const isFilled = i < answerSlots.length;
                         const slotText = isFilled ? answerSlots[i] : expectedText;
                         
                         let slotClass = 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600 border-2 border-slate-300 dark:border-slate-600 border-dashed'; // Default empty
                         
                         if (isFilled) {
                           if (feedback === 'wrong') slotClass = 'bg-red-500 text-white border-red-600 border-b-4 border-solid shadow-sm';
                           else if (feedback === 'correct') slotClass = 'bg-green-500 text-white border-green-600 border-b-4 border-solid shadow-sm';
                           else slotClass = 'bg-green-500 text-white border-green-600 border-b-4 border-solid shadow-sm';
                         }

                         let IconTemplate = null;
                         if (isFilled && i === currentQuiz.splits.length - 1 && feedback !== 'none') {
                           if (feedback === 'correct') IconTemplate = <ThumbsUp className="w-5 h-5 text-green-500" />;
                           if (feedback === 'wrong') IconTemplate = <Frown className="w-5 h-5 text-red-500" />;
                         }

                         return (
                        <motion.div 
                          key={`slot-${i}`} 
                          animate={isFilled ? { scale: [1, 1.1, 1] } : {}}
                          className={`${slotClass} px-4 py-3 sm:px-6 sm:py-5 rounded-2xl sm:rounded-[2rem] text-[4vh] sm:text-4xl font-black relative flex items-center justify-center min-w-[80px] sm:min-w-[100px] transition-colors`}
                        >
                          <span className={`translate-y-1 leading-none ${!isFilled ? 'opacity-30' : ''}`}>
                            {settings.isCapital ? slotText.toUpperCase() : slotText.toLowerCase()}
                          </span>
                          {IconTemplate && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-full shadow-sm p-1 border border-slate-100">
                              {IconTemplate}
                            </motion.span>
                          )}
                        </motion.div>
                         );
                      })}
                    </AnimatePresence>
                  
                    {(feedback === 'none' && answerSlots.length > 0) && (
                      <button 
                        onClick={handleReset}
                        className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 text-slate-400 p-3 sm:p-4 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:text-red-500 hover:scale-110 active:scale-90 transition-all z-10"
                      >
                        <RotateCcw className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  {/* Shuffled Keys (Jawaban) - DYNAMIC FLEX/GRID */}
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full shrink-0 px-1 sm:px-0">
                    {shuffledKeypad.map((key) => (
                      <button
                        key={key.id}
                        disabled={key.used || feedback !== 'none'}
                        onClick={() => handleKeyTap(key)}
                        className={`h-[11vh] min-h-[4.5rem] max-h-[5.5rem] px-4 min-w-[70px] sm:min-w-[90px] flex-grow basis-[28%] sm:basis-[22%] max-w-[160px] rounded-[2rem] sm:rounded-[2.5rem] border-b-4 flex items-center justify-center font-black text-[4vh] sm:text-4xl transition-all
                          ${key.used 
                            ? 'bg-slate-100 dark:bg-slate-800/20 text-transparent border-transparent scale-95 opacity-50' 
                            : 'bg-white dark:bg-slate-800 text-[#16a34a] dark:text-[#4ade80] border-slate-200 dark:border-slate-700 shadow-sm hover:border-green-300 hover:-translate-y-1 active:scale-95'
                          }`}
                      >
                        <span className="translate-y-1">{settings.isCapital ? key.text.toUpperCase() : key.text.toLowerCase()}</span>
                      </button>
                    ))}
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
