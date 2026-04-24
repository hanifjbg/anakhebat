/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { MockPage } from './pages/MockPages';
import { UIKit } from './pages/UIKit';
import { QCNav } from './components/QCNav';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { Leaderboard } from './pages/Leaderboard';
import { QuizSession } from './pages/QuizSession';
import { Achievements } from './pages/Achievements';
import { AlphabetModule } from './pages/AlphabetModule';
import { VowelModule } from './pages/VowelModule';
import { SentenceModule } from './pages/SentenceModule';
import { Onboarding } from './pages/Onboarding';

import { SettingsProvider } from './contexts/SettingsContext';
import { AppProvider, useApp } from './contexts/AppContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.user) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { state } = useApp();

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={!state.user ? <Onboarding /> : <Navigate to="/home" replace />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><QuizSession /></PrivateRoute>} />
        <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
        <Route path="/alphabet" element={<PrivateRoute><AlphabetModule /></PrivateRoute>} />
        <Route path="/vokalm" element={<PrivateRoute><VowelModule /></PrivateRoute>} />
        <Route path="/sentence" element={<PrivateRoute><SentenceModule /></PrivateRoute>} />
        
        <Route path="/uikit" element={<UIKit />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <QCNav />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </SettingsProvider>
  );
}



