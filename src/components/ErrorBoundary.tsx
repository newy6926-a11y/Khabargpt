import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Khabar GPT Uncaught Error Boundary:', error, errorInfo);
  }

  private handleReload = () => {
    // Clear potentially corrupted session storage or caches on reload
    try {
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center font-sans">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                पृष्ठ पुन: लोड गर्नुहोस्
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                केही प्राविधिक कारणले सामग्री लोड हुन सकेन। कृपया एकपटक पुन: ताजा (Refresh) गर्नुहोस्।
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पेज पुन: लोड गर्नुहोस् (Refresh Page)</span>
            </button>

            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full py-2 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              गृहपृष्ठमा जानुहोस् (Go to Home)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
