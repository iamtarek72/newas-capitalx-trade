import React, { useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA on the home screen, don't show button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        id="btn-pwa-install"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm"
        title="Install as Mobile / Desktop App"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">App</span>
      </button>

      {/* Guide Modal when beforeinstallprompt is not directly triggered (e.g. iOS or manual install) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0e131d] border border-slate-700/70 rounded-2xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-100">
                  Install NEWAZ CAPITALX App
                </h3>
                <p className="text-xs text-slate-400">
                  Run directly from your Phone / PC home screen like a native app
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="bg-[#141a27] rounded-xl p-4 border border-slate-800 space-y-3 mb-5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad Installation:</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold">1</span>
                  <span>Tap the <strong className="text-slate-100 flex inline-flex items-center gap-1"><Share className="w-3 h-3 text-sky-400" /> Share</strong> button in Safari toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold">2</span>
                  <span>Scroll down and select <strong className="text-emerald-400 flex inline-flex items-center gap-1"><PlusSquare className="w-3 h-3" /> Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold">3</span>
                  <span>Tap <strong className="text-slate-100">Add</strong> in the top right corner. Done!</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#141a27] rounded-xl p-4 border border-slate-800 space-y-3 mb-5 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Android & Chrome / Edge Installation:</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold">1</span>
                  <span>Tap the browser menu <strong className="text-slate-100">(⋮ Three Dots)</strong> in the top right corner.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold">2</span>
                  <span>Select <strong className="text-emerald-400">"Install app"</strong> or <strong className="text-emerald-400">"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold">3</span>
                  <span>Confirm by clicking <strong className="text-slate-100">Install</strong>. The app icon will appear on your phone home screen!</span>
                </div>
              </div>
            )}

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-400/90 mb-5">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Full standalone screen, faster loading, offline caching, and zero browser bar clutter.</span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {installSuccess && (
        <div className="fixed bottom-6 right-6 z-[100] bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4" />
          <span>App installed successfully to your home screen!</span>
        </div>
      )}
    </>
  );
};
