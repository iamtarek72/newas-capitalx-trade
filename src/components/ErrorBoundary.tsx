import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terminal runtime error caught by boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('nxt_settings');
      localStorage.removeItem('nxt_trades');
      localStorage.removeItem('nxt_token');
      localStorage.removeItem('nxt_user');
    } catch {
      // Ignore
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6 text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-100 mb-2">
            Terminal Display Safeguard
          </h1>

          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            The NEWAZ CAPITALX terminal encountered an unexpected execution state while rendering.
            You can refresh the interface or reset local workspace storage.
          </p>

          {this.state.error && (
            <div className="w-full max-w-lg bg-[#0e121a] border border-slate-800 rounded-xl p-4 text-left mb-6 font-mono text-xs text-rose-400/90 overflow-x-auto">
              {this.state.error.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Terminal</span>
            </button>

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Local Storage</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
