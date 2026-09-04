import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import NotificationToasts from './components/ui/NotificationToasts';
import EmergencyModal from './components/ui/EmergencyModal';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BeltMonitoring from './pages/BeltMonitoring';
import LaserInspection from './pages/LaserInspection';
import DamageAnalysis from './pages/DamageAnalysis';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AppLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('cbh-theme');
    return stored === 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cbh-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cbh-theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0B0B] transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopNavbar
        onMenuClick={() => setSidebarOpen(true)}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
      {/* Main content */}
      <main className="lg:ml-64 pt-14 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/belt-monitoring" element={<BeltMonitoring />} />
            <Route path="/laser-inspection" element={<LaserInspection />} />
            <Route path="/damage-analysis" element={<DamageAnalysis />} />
            <Route path="/predictive-maintenance" element={<PredictiveMaintenance />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      <EmergencyModal />
      <NotificationToasts />
    </div>
  );
}

export default function App() {
  // Apply stored theme immediately on mount
  useEffect(() => {
    const stored = localStorage.getItem('cbh-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
