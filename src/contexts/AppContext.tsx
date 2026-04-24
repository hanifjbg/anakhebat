import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  name: string;
  avatar: string;
}

export interface ModuleProgress {
  lastPage: number;
  completedPages: number[]; // indices of completed pages
  bestScore: number | null; 
  lastScore: number | null;
}

interface AppState {
  user: User | null;
  progress: Record<string, ModuleProgress>;
}

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  markPageCompleted: (moduleId: string, pageIndex: number) => void;
  saveQuizScore: (moduleId: string, score: number) => void;
  logout: () => void;
}

const defaultState: AppState = { user: null, progress: {} };

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'kids_app_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = useCallback((user: User) => setState(prev => ({ ...prev, user })), []);
  const logout = useCallback(() => setState(defaultState), []);

  const updateProgress = useCallback((moduleId: string, updates: Partial<ModuleProgress>) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [moduleId]: {
          ...(prev.progress[moduleId] || { lastPage: 0, completedPages: [], bestScore: null, lastScore: null }),
          ...updates
        }
      }
    }));
  }, []);

  const markPageCompleted = useCallback((moduleId: string, pageIndex: number) => {
    setState(prev => {
      const modProgress = prev.progress[moduleId] || { lastPage: 0, completedPages: [], bestScore: null, lastScore: null };
      const set = new Set(modProgress.completedPages);
      set.add(pageIndex);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [moduleId]: {
            ...modProgress,
            lastPage: pageIndex,
            completedPages: Array.from(set)
          }
        }
      };
    });
  }, []);

  const saveQuizScore = useCallback((moduleId: string, score: number) => {
    setState(prev => {
      const modProgress = prev.progress[moduleId] || { lastPage: 0, completedPages: [], bestScore: null, lastScore: null };
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [moduleId]: {
            ...modProgress,
            lastScore: score,
            bestScore: Math.max(modProgress.bestScore || 0, score)
          }
        }
      };
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, login, updateProgress, markPageCompleted, saveQuizScore, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
