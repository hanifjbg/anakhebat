import React, { useState } from 'react';
import { Type, Plus, Minus, X, Volume2, VolumeX } from 'lucide-react';
import { useSettings, FontType, SizeType } from '../contexts/SettingsContext';

export const TextSettingsMenu = () => {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSize = (dir: 'up' | 'down') => {
    const sizes: SizeType[] = ['sm', 'md', 'lg'];
    const currentIndex = sizes.indexOf(settings.size);
    if (dir === 'up' && currentIndex < sizes.length - 1) {
      updateSettings({ size: sizes[currentIndex + 1] });
    } else if (dir === 'down' && currentIndex > 0) {
      updateSettings({ size: sizes[currentIndex - 1] });
    }
  };

  return (
    <div className="relative z-[100]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-105 active:scale-95 transition-transform"
      >
        <Type className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Pengaturan Teks</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ukuran</label>
              <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-1 bg-slate-50 dark:bg-slate-800/50">
                <button
                  onClick={() => toggleSize('down')}
                  disabled={settings.size === 'sm'}
                  className="flex-1 py-1.5 flex justify-center items-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-[2] flex justify-center items-center font-bold text-sm">
                  {settings.size.toUpperCase()}
                </div>
                <button
                  onClick={() => toggleSize('up')}
                  disabled={settings.size === 'lg'}
                  className="flex-1 py-1.5 flex justify-center items-center rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Gaya Huruf</label>
              <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => updateSettings({ isCapital: true })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${settings.isCapital ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
                >
                  A-Z
                </button>
                <button 
                  onClick={() => updateSettings({ isCapital: false })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${!settings.isCapital ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
                >
                  a-z
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Jenis Font</label>
              <div className="space-y-1">
                {(['comic', 'quicksand', 'inter'] as FontType[]).map((font) => (
                  <button
                    key={font}
                    onClick={() => updateSettings({ fontType: font })}
                    className={`w-full py-2 px-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      settings.fontType === font 
                        ? 'border-[#8b5cf6] bg-purple-50 dark:bg-purple-900/10 text-[#8b5cf6]' 
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span style={{ 
                      fontFamily: font === 'comic' ? '"Comic Neue", cursive' : 
                                  font === 'quicksand' ? '"Quicksand", sans-serif' : 
                                  '"Nunito", sans-serif'
                    }} className="font-bold">
                      {font === 'comic' ? 'Comic' : font === 'quicksand' ? 'Quicksand' : 'Default'}
                    </span>
                    {settings.fontType === font && <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Suara (TTS)</label>
              <button
                onClick={() => updateSettings({ ttsEnabled: !settings.ttsEnabled })}
                className={`w-full py-3 px-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  settings.ttsEnabled 
                    ? 'border-[#8b5cf6] bg-purple-50 dark:bg-purple-900/10 text-[#8b5cf6]' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {settings.ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="font-bold">{settings.ttsEnabled ? 'Aktif' : 'Nonaktif'}</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.ttsEnabled ? 'bg-[#8b5cf6]' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.ttsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
