import React from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { RightWatchlist } from './components/RightWatchlist.js';
import { BottomNav } from './components/BottomNav.js';
import { ToastContainer } from './components/Toast.js';
import { LoginModal } from './components/LoginModal.js';

import { DashboardView } from './views/DashboardView.js';
import { LiveSignalsView } from './views/LiveSignalsView.js';
import { RealTimeChartView } from './views/RealTimeChartView.js';
import { MarketsView } from './views/MarketsView.js';
import { AIAnalysisView } from './views/AIAnalysisView.js';
import { MoneyManagementView } from './views/MoneyManagementView.js';
import { TradeHistoryView } from './views/TradeHistoryView.js';
import { PerformanceView } from './views/PerformanceView.js';
import { AlertsView } from './views/AlertsView.js';
import { IntegrationsView } from './views/IntegrationsView.js';
import { AdminPanelView } from './views/AdminPanelView.js';
import { LandingPageView } from './views/LandingPageView.js';
import { Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, settings } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'signals':
        return <LiveSignalsView />;
      case 'chart':
        return <RealTimeChartView />;
      case 'markets':
        return <MarketsView />;
      case 'ai':
        return <AIAnalysisView />;
      case 'money-management':
        return <MoneyManagementView />;
      case 'history':
        return <TradeHistoryView />;
      case 'performance':
        return <PerformanceView />;
      case 'alerts':
        return <AlertsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'admin':
        return <AdminPanelView />;
      case 'landing':
      default:
        return <LandingPageView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Top Announcement Banner from Admin Settings */}
      {settings?.general?.disclaimer && (
        <div className="bg-gradient-to-r from-emerald-600/90 via-cyan-600/90 to-emerald-600/90 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2">
          <Bell className="w-3.5 h-3.5" />
          <span>{settings.general.disclaimer}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Terminal Shell */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar (visible on non-landing views, or toggleable) */}
        {activeTab !== 'landing' && <Sidebar />}

        {/* Dynamic Center Work Area */}
        <main
          className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto ${
            activeTab === 'landing' ? 'max-w-6xl mx-auto' : ''
          }`}
        >
          {renderActiveView()}
        </main>

        {/* Right Watchlist (visible on desktop terminal views) */}
        {activeTab !== 'landing' && activeTab !== 'chart' && <RightWatchlist />}
      </div>

      {/* Mobile Bottom Navigation */}
      {activeTab !== 'landing' && <BottomNav />}

      {/* Global Modals and Notifications */}
      <LoginModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
