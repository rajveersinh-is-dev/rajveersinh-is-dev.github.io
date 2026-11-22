import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#121110] text-[#ede8df] flex items-center justify-center p-6 font-serif">
          <div className="max-w-xl w-full border border-[#5c5449] bg-[#1a1816] p-8 rounded-sm shadow-xl space-y-6">
            <div className="border-b border-[#38332d] pb-3 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#be123c]">
              <span>Acta Mathematica &amp; Computatoria</span>
              <span>Fault Recovery</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#ede8df]">
                Computational Kernel Exception
              </h1>
              <p className="text-sm text-[#bab2a4] leading-relaxed">
                An unexpected runtime condition halted client rendering. You can reload the research archive or restore standard preferences below.
              </p>
            </div>
            {this.state.error && (
              <pre className="p-3 bg-[#121110] border border-[#38332d] text-xs font-mono text-[#d97706] overflow-x-auto rounded">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#be123c] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#9f1239] transition-colors cursor-pointer"
              >
                Reload Archive
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 border border-[#5c5449] bg-[#24211e] text-[#ede8df] text-xs font-mono uppercase tracking-wider rounded hover:bg-[#38332d] transition-colors cursor-pointer"
              >
                Reset Preferences &amp; Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
