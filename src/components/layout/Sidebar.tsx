import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  ScanLine,
  BarChart3,
  BrainCircuit,
  Bell,
  FileText,
  Settings,
  Zap,
  Circle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Belt Monitoring', path: '/belt-monitoring', icon: Activity },
  { label: 'Laser Inspection', path: '/laser-inspection', icon: ScanLine },
  { label: 'Damage Analysis', path: '/damage-analysis', icon: BarChart3 },
  { label: 'Predictive Maintenance', path: '/predictive-maintenance', icon: BrainCircuit },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { alerts, isDamageSimulated } = useApp();
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64
          bg-white dark:bg-[#0B0B0B]
          border-r border-[#E5E7EB] dark:border-[#292929]
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E7EB] dark:border-[#292929]">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#111827] dark:text-white leading-tight">CBH</div>
            <div className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA] leading-tight">
              Conveyor Belt Health
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    isActive ? 'nav-item-active flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer' :
                    'nav-item-inactive flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer'
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.label === 'Alerts' && unacknowledgedCount > 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                            isDamageSimulated
                              ? 'bg-red-500 text-white'
                              : isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {unacknowledgedCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* System status */}
        <div className="px-4 py-4 border-t border-[#E5E7EB] dark:border-[#292929]">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B7280] dark:text-[#A1A1AA] mb-2">
            System Status
          </div>
          <div className="flex items-center gap-2">
            <Circle
              className={`w-2.5 h-2.5 fill-current flex-shrink-0 ${
                isDamageSimulated ? 'text-red-500' : 'text-green-500'
              }`}
            />
            <span className="text-xs text-[#111827] dark:text-white">
              {isDamageSimulated ? 'Critical alert active' : 'All systems operational'}
            </span>
          </div>
          {isDamageSimulated && (
            <div className="mt-2 text-[10px] text-red-500 dark:text-red-400 font-medium">
              ⚠ Simulation mode active
            </div>
          )}
          <div className="mt-3">
            <div className="sim-badge">
              <Circle className="w-1.5 h-1.5 fill-current text-amber-500" />
              SIMULATION DATA
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
