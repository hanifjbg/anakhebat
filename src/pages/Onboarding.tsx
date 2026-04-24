import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';

const AVATARS = [
  'adventurer',
  'avataaars',
  'bottts',
  'fun-emoji',
  'micah',
  'miniavs'
];

export const Onboarding = () => {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  const getAvatarUrl = (seed: string, style: string) => 
    `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Namanya diisi dulu ya!');
      return;
    }
    if (cleanName.includes(' ')) {
      setError('Satu kata saja ya panggilannya!');
      return;
    }
    login({ name: cleanName, avatar: getAvatarUrl(cleanName, selectedAvatar) });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border-4 border-slate-100 dark:border-slate-800"
      >
        <h1 className="text-3xl font-black text-center text-slate-800 dark:text-white mb-2">Halo Teman!</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 font-bold">Siapa nama panggilannmu?</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Contoh: Budi"
              className="w-full h-16 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-2xl font-black text-center focus:border-purple-500 focus:outline-none uppercase"
            />
            {error && <p className="text-red-500 text-center text-sm font-bold mt-2">{error}</p>}
          </div>

          <div className="space-y-4">
            <p className="text-center font-bold text-slate-600 dark:text-slate-300">Pilih Avatar Kamu:</p>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative aspect-square rounded-2xl border-4 transition-all overflow-hidden bg-slate-100 dark:bg-slate-800
                    ${selectedAvatar === avatar ? 'border-purple-500 scale-105 shadow-md' : 'border-transparent hover:scale-105'}
                  `}
                >
                  <img src={getAvatarUrl(name || 'budi', avatar)} alt={avatar} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" size="xl" variant="gradient-purple" className="mt-4 w-full h-16 text-xl">
            Mulai Bermain!
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
