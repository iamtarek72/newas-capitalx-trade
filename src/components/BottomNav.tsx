import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext.js';
import { LayoutDashboard, Radio, LineChart, Calculator, Menu } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Command', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'signals', label: 'Signals', icon: <Radio className="w-5 h-5" /> },
    { id: 'chart', label: 'Chart', icon: <LineChart className="w-5 h-5" /> },
    { id: 'money-management', label: 'Risk MM', icon: <Calculator className="w-5 h-5" /> },
    { id: 'admin', label: 'Control', icon: <Menu className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0f17]/95 border-t border-slate-800/90 backdrop-blur-lg px-2 py-1">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-[#0c0f17]" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
