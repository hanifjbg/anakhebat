import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | 'none';
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ type }) => {
  return (
    <AnimatePresence>
      {type !== 'none' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className={`p-8 rounded-full shadow-2xl ${
            type === 'correct' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {type === 'correct' ? (
              <Check className="w-24 h-24 text-white" strokeWidth={4} />
            ) : (
              <X className="w-24 h-24 text-white" strokeWidth={4} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
