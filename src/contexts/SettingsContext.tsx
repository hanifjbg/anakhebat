import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontType = 'comic' | 'inter' | 'quicksand';
export type SizeType = 'sm' | 'md' | 'lg';

export interface CardSettings {
  isCapital: boolean;
  fontType: FontType;
  size: SizeType;
  ttsEnabled: boolean;
}

const defaultSettings: CardSettings = {
  isCapital: true,
  fontType: 'comic',
  size: 'md',
  ttsEnabled: true
};

interface SettingsContextType {
  settings: CardSettings;
  updateSettings: (updates: Partial<CardSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CardSettings>(() => {
    try {
      const stored = window.localStorage.getItem('card_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    window.localStorage.setItem('card_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<CardSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
