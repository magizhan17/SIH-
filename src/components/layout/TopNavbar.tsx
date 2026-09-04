import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { conveyors } from '../../data/conveyors';

interface TopNavbarProps {
  onMenuClick: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Conveyor Health Overview',
  '/belt-monitoring': 'Belt Monitoring',
  '/laser-inspection': 'Laser Crack Inspection',
  '/damage-analysis': 'Damage Analysis',
  '/predictive-maintenance': 'Predictive Maintenance',
  '/alerts': 'Alerts & Emergency Center',
  '/reports': 'Inspection & Maintenance Reports',
  '/settings': 'System Settings',
};

export default function TopNavbar({ onMenuClick, isDarkMode, onThemeToggle }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedConveyor, setSelectedConveyor, openEmergencyModal, alerts, isDamageSimulated } = useApp();
  const [showConveyorMenu, setShowConveyorMenu] = useState(false);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const pageTitle = pageTitles[location.pathname] || 'CBH Monitor';

  const now = new Date();
  const shift = now.getHours() < 8 ? 'Night Shift' : now.getHours() < 16 ? 'Day Shift' : 'Evening Shift';
  const lastUpdated = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 z-10 h-14 bg-white dark:bg-[#0B0B0B] border-b border-[#E5E7EB] dark:border-[#292929] flex items-center px-4 gap-3">
      {/* Menu button - mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] text-[#6B7280] dark:text-[#A1A1AA]"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-[#111827] dark:text-white hidden sm:block truncate">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Conveyor selector */}
      <div className="relative">
        <button
          onClick={() => setShowConveyorMenu(!showConveyorMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#292929] hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] transition-colors text-sm font-medium text-[#111827] dark:text-white"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          {selectedConveyor}
          <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A1A1AA]" />
        </button>
        {showConveyorMenu && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#161616] border border-[#E5E7EB] dark:border-[#292929] rounded-lg shadow-lg z-20 py-1">
            {conveyors.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedConveyor(c.id); setShowConveyorMenu(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] transition-colors ${
                  c.id === selectedConveyor ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-[#111827] dark:text-white'
                }`}
              >
                <div className="font-medium">{c.id}</div>
                <div className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">{c.location}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Simulation badge */}
      <div className="hidden md:flex sim-badge">
        SIMULATION DATA
      </div>

      {/* Shift info */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#A1A1AA]">
        <Clock className="w-3.5 h-3.5" />
        <span>{shift}</span>
        <span className="text-[#E5E7EB] dark:text-[#292929]">|</span>
        <span>{lastUpdated}</span>
      </div>

      {/* Notifications */}
      <button
        onClick={() => navigate('/alerts')}
        className="relative p-1.5 rounded-lg hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] text-[#6B7280] dark:text-[#A1A1AA]"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unacknowledgedCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
          </span>
        )}
      </button>

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#292929] hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] transition-colors text-xs font-medium text-[#6B7280] dark:text-[#A1A1AA]"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
      </button>

      {/* Emergency button */}
      <button
        onClick={openEmergencyModal}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-all ${
          isDamageSimulated
            ? 'bg-red-600 hover:bg-red-700 emergency-pulse'
            : 'bg-red-600 hover:bg-red-700'
        }`}
        aria-label="Emergency"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>EMERGENCY</span>
      </button>
    </header>
  );
}
